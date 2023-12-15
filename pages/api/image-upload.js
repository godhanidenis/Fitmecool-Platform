import formidable from "formidable-serverless";
import fs from "fs";
import {
  productImageSizeVariants,
  shopCoverSizeVariants,
  shopImageSizeVariants,
  shopLogoSizeVariants,
} from "../../utils/common";
import { destinationBucketName, s3 } from "../../wasabi/config";
import { resizeImage } from "../../utils/image-jimp";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).end("Error parsing form data");
    }

    const imageBuffer = fs.readFileSync(files.image.path);

    // Define an array of size variants
    const sizeVariants =
      (fields?.uploadImageSectionType === "product-image" &&
        productImageSizeVariants) ||
      (fields?.uploadImageSectionType === "shop-logo" &&
        shopLogoSizeVariants) ||
      (fields?.uploadImageSectionType === "shop-cover" &&
        shopCoverSizeVariants) ||
      (fields?.uploadImageSectionType === "shop-image" &&
        shopImageSizeVariants);

    // Process each size variant
    const uploadPromises = sizeVariants.map(async (variant) => {
      const resizedImageBuffer = await resizeImage(
        imageBuffer,
        variant.width,
        variant.height
      );

      let extensionIndex = files.image.name.lastIndexOf(".");
      let newName =
        files.image.name.substring(0, extensionIndex) +
        "_" +
        variant.size +
        files.image.name.substring(extensionIndex);

      const key = newName.replaceAll(" ", "_");

      const Bucket =
        destinationBucketName + "/seller/" + fields?.folderStructure;

      const uploadParams = {
        Bucket: Bucket,
        Key: key,
        Body: resizedImageBuffer,
        ContentType: files.image.type,
      };

      try {
        const data = await s3.upload(uploadParams).promise();
        return { success: true, size: variant.size, imageUrl: data?.Location };
      } catch (uploadError) {
        console.error("Error uploading image to S3:", uploadError);
        return {
          success: false,
          size: variant.size,
          error: "Error uploading image to S3",
        };
      }
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Check if any upload failed
    const hasFailedUpload = results.some((result) => !result.success);

    if (hasFailedUpload) {
      return res.status(500).end("One or more uploads failed");
    }
    // All uploads succeeded, return success
    const imageUrls = {};
    results.forEach((result) => {
      imageUrls[result.size] = result.imageUrl;
    });

    return res.status(200).json({
      success: true,
      imageUrls: imageUrls,
    });
  });
}
