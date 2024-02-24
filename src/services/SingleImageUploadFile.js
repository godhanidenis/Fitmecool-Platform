import axios from 'axios';
import FormData from 'form-data';
import appConfig from '../config';

export const SingleImageUploadFile = async data => {
  const formData = new FormData();
  const newData = {
    name: data.fileName,
    size: data.fileSize,
    type: data.type,
    uri: data.uri,
  };

  const uploadFile = newData;
  console.log('uploadFile', uploadFile);
  formData.append(
    'operations',
    '{"query" : "mutation singleUpload($file: Upload!, $fileType: String) {singleUpload(file: $file, fileType: $fileType)}", "variables" : {"file": null, "fileType": "image"}}',
  );
  formData.append('map', '{"0": ["variables.file"]}');
  formData.append('0', uploadFile);

  try {
    const response = await axios.post(`${appConfig.appUrl}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Axios Error111:', error);
    throw error;
  }
};
