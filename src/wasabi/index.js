import RNFetchBlob from 'rn-fetch-blob';
import {destinationBucketName, s3} from '../config/config';
import {decode} from 'base64-arraybuffer';

const generateFileType = fileType => {
  if (fileType === 'image/png') {
    return '.png';
  } else if (fileType === 'image/jpeg') {
    return '.jpeg';
  } else if (fileType === 'image/jpg') {
    return '.jpg';
  } else if (fileType === 'image/webp') {
    return '.webp';
  } else if (fileType === 'image/heic') {
    return '.heic';
  } else if (fileType === 'video/mp4') {
    return '.mp4';
  }
};

export const fileUpload = async (selectedFile, folderStructure) => {
  const fileUri = selectedFile?.uri;
  const fileData = await RNFetchBlob.fs.readFile(fileUri, 'base64');
  const arrayBuffer = decode(fileData);

  const Bucket = destinationBucketName + '/seller/' + folderStructure;

  const FileName = selectedFile?.name ?? selectedFile?.fileName;

  let extensionIndex = FileName?.lastIndexOf('.');

  let newName = selectedFile?.imageSize
    ? FileName?.substring(0, extensionIndex) +
      '_' +
      selectedFile?.imageSize +
      FileName?.substring(extensionIndex)
    : FileName?.substring(0, extensionIndex) +
      FileName?.substring(extensionIndex);

  const key = newName.replaceAll(' ', '_');

  const params = {
    Bucket: Bucket,
    Key: key,
    Body: arrayBuffer,
    ContentType: selectedFile?.type,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading to Wasabi:', error);
  }
};

export const deleteObjectsInFolder = async folderPrefix => {
  const params = {
    Bucket: destinationBucketName,
    Prefix: 'seller/' + folderPrefix,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    const objects = data.Contents;

    if (objects.length === 0) {
      console.log('No objects found in the specified folder.');
      return;
    }

    const deleteParams = {
      Bucket: destinationBucketName,
      Delete: {
        Objects: objects.map(({Key}) => ({Key})),
        Quiet: false,
      },
    };

    await s3.deleteObjects(deleteParams).promise();

    console.log(`Objects in folder '${folderPrefix}' deleted successfully.`);
  } catch (error) {
    console.error('Error deleting objects:', error);
  }
};

export const fileDelete = async (link, type) => {
  var objectKey =
    type === 'image'
      ? link?.split('/test-image2/')[1]
      : link?.split('/test-videos/')[1];

  const params = {
    Bucket:
      destinationBucketName +
      (type === 'image' ? '/test-image2' : '/test-videos'),
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

export const fileUpdate = async (link, type, selectedFile) => {
  const fileUri = selectedFile.uri;
  const fileData = await RNFetchBlob.fs.readFile(fileUri, 'base64');
  const arrayBuffer = decode(fileData);

  let objectKey =
    type === 'image'
      ? link?.split('/test-img/')[1]
      : link?.split('/test-videos/')[1];

  const params = {
    Bucket:
      destinationBucketName + (type === 'image' ? '/test-img' : '/test-videos'),
    Key: objectKey,
    Body: arrayBuffer,
    ContentType: selectedFile.type,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading to Wasabi:', error);
  }
};
