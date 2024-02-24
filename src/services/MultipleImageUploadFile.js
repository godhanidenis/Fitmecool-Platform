import axios from 'axios';
import FormData from 'form-data';
import appConfig from '../config';

export const MultipleImageUploadFile = async data => {
  var formData = new FormData();
  formData.append(
    'operations',
    `{ "query": "mutation multipleUpload($file: Upload!, $fileType: String) {multipleUpload(file: [$file], fileType: $fileType)}", "variables": { "file": [${new Array(
      data.length,
    ).fill('null')}], "fileType": "image" } }`,
  );

  if (data.length > 0) {
    const map = {};
    data.forEach((file, i) => {
      map[i] = [`variables.file.${i}`];
    });
    formData.append('map', JSON.stringify(map));
    data.forEach((file, i) => {
      const newData = {
        name: file.fileName,
        size: file.fileSize,
        type: file.type,
        uri: file.uri,
      };
      formData.append(`${i}`, newData);
    });
  }

  try {
    const response = await axios.post(`${appConfig.appUrl}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Axios Error23:', error);
    throw error;
  }
};
