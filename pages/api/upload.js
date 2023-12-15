import { resizeImage } from "../../utils/image-jimp";
import { destinationBucketName, s3 } from "../../wasabi/config";
import formidable from "formidable-serverless";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing
  },
};

export default async function handler(req, res) {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).end("Error parsing form data");
      }

      const imageBuffer = fs.readFileSync(files.image.path);

      // Resize the image
      const resizedImage = await resizeImage(imageBuffer, 300, 200);

      // Upload the resized image to Wasabi

      const uploadParams = {
        Bucket: destinationBucketName,
        Key: `resized/${files.image.name}`,
        Body: resizedImage,
        ContentType: files.image.type,
      };

      try {
        const data = await s3.upload(uploadParams).promise();

        return res
          .status(200)
          .json({ success: true, imageUrl: data?.Location });
      } catch (uploadError) {
        console.log("Error uploading image to S3:", uploadError);
        return res.status(500).end("One or more uploads failed");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
