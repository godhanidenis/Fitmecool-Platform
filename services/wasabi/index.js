import { generateRandomNumberString } from "../../utils/common";
import { s3 } from "../../wasabi/config";

const destinationBucketName = "rentbless-dev";

const generateFileType = (fileType) => {
  if (fileType === "image/png") {
    return ".png";
  } else if (fileType === "image/jpeg") {
    return ".jpeg";
  } else if (fileType === "image/jpg") {
    return ".jpg";
  } else if (fileType === "video/mp4") {
    return ".mp4";
  }
};

export const fileUpload = (selectedFile) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket:
        destinationBucketName +
        (selectedFile?.type === "image/png" ||
        selectedFile?.type === "image/jpeg" ||
        selectedFile?.type === "image/jpg"
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
        reject(err); // Reject the promise on error
      } else {
        resolve(data.Location);
      }
    });
  });
};

export const fileDelete = async (link, type) => {
  var objectKey =
    type === "image"
      ? link.split("/test-img/")[1]
      : link.split("/test-videos/")[1];

  const params = {
    Bucket:
      destinationBucketName + (type === "image" ? "/test-img" : "/test-videos"),
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
    var objectKey =
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
        reject(err); // Reject the promise on error
      } else {
        resolve(data.Location);
      }
    });
  });
};
