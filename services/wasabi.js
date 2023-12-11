import { generateFileType, generateRandomNumberString } from "../utils/common";
import { destinationBucketName, s3 } from "../wasabi/config";

export const fileUpload = (selectedFile) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket:
        destinationBucketName +
        (selectedFile?.type === "image/png" ||
        selectedFile?.type === "image/jpeg" ||
        selectedFile?.type === "image/jpg" ||
        selectedFile?.type === "image/webp" ||
        selectedFile?.type === "image/heic"
          ? "/test-img"
          : "/test-videos"),
      Key:
        new Date().getTime().toString() +
        generateRandomNumberString(5) +
        generateFileType(selectedFile?.type),
      Body: selectedFile,
      ContentEncoding: "base64",
      ContentType: selectedFile?.type,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error during file upload:", err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

export const fileDelete = async (link, type) => {
  let objectKey =
    type === "image" ? link.split("/images/")[1] : link.split("/videos/")[1];

  const params = {
    Bucket: destinationBucketName + (type === "image" ? "/images" : "/videos"),
    Key: objectKey,
  };

  try {
    await s3.deleteObject(params).promise();
    return `Image "${objectKey}" deleted successfully!`;
  } catch (error) {
    console.error(`Error deleting image "${objectKey}":`, error);
    throw error;
  }
};

export const fileUpdate = (link, type, selectedFile) => {
  return new Promise((resolve, reject) => {
    let objectKey =
      type === "image"
        ? link?.split("/test-img/")[1]
        : link?.split("/test-videos/")[1];

    const params = {
      Bucket:
        destinationBucketName +
        (type === "image" ? "/test-img" : "/test-videos"),
      Key: objectKey,
      Body: selectedFile,
      ContentEncoding: "base64",
      ContentType: selectedFile?.type,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error during file upload:", err);
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};
