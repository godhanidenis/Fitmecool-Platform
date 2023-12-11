import sharp from "sharp";
import formidable from "formidable-serverless";
import fs from "fs";
import {
  generateFileType,
  generateRandomNumberString,
} from "../../utils/common";
import { destinationBucketName, s3 } from "../../wasabi/config";

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
    const sizeVariants = [
      { width: 126, size: "small" },
      { width: 300, size: "medium" },
      { width: 600, size: "large" },
      // Add more size variants as needed
    ];

    // Process each size variant
    const uploadPromises = sizeVariants.map(async (variant) => {
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize({ width: variant.width, fit: sharp.fit.cover })
        .toBuffer();

      const key =
        new Date().getTime().toString() +
        generateRandomNumberString(5) +
        generateFileType(files.image.type);

      const Bucket = destinationBucketName + "/images";

      const uploadParams = {
        Bucket: Bucket,
        Key: key,
        Body: resizedImageBuffer,
        ContentType: files.image.type,
      };

      try {
        await s3.upload(uploadParams).promise();
        const imageUrl = `https://s3.us-east-1.wasabisys.com/${Bucket}/${key}`;
        return { success: true, size: variant.size, imageUrl };
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
