import sharp from "sharp";
import formidable from "formidable-serverless";
import fs from "fs";
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

    // Define an array of size variants
    const sizeVariants = [
      { width: 126, size: "small" },
      { width: 300, size: "medium" },
      { width: 600, size: "large" },
      // Add more size variants as needed
    ];

    const uploadPromises = sizeVariants.map(async (variant) => {
      const imageUrl = JSON.parse(fields.links)[variant.size];

      const imageBuffer = fs.readFileSync(files.image.path);

      // Resize the image using sharp
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize({ width: variant.width, fit: sharp.fit.cover })
        .toBuffer();

      const key = imageUrl?.split("/test-img/")[1];

      const Bucket = destinationBucketName + "/test-img";

      const uploadParams = {
        Bucket: Bucket,
        Key: key,
        Body: resizedImageBuffer,
        ContentType: files.image.type,
      };

      try {
        await s3.upload(uploadParams).promise();
        const resizedImageUrl = `https://s3.us-east-1.wasabisys.com/${Bucket}/${key}`;
        return { success: true, size: variant.size, imageUrl: resizedImageUrl };
      } catch (uploadError) {
        console.error(
          `Error uploading ${variant.size} image to S3:`,
          uploadError
        );
        return {
          success: false,
          size: variant.size,
          error: `Error uploading ${variant.size} image to S3`,
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.reduce((acc, result) => {
        acc[result.size] = result.imageUrl;
        return acc;
      }, {});

      return res.status(200).json({ success: true, imageUrls });
    } catch (error) {
      console.error("Error during image upload:", error);
      return res.status(500).end("Error during image upload");
    }
  });
}
