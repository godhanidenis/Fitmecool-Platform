import axios from "axios";
import FormData from "form-data";

export const VideoUploadFile = async (data) => {
  const formData = new FormData();
  const uploadFile = data;

  formData.append(
    "operations",
    '{"query" : "mutation singleUpload($file: Upload!, $fileType: String!) {singleUpload(file: $file, fileType: $fileType)}", "variables" : {"file": null, "fileType": "video"}}'
  );
  formData.append("map", '{"0": ["variables.file"]}');
  formData.append("0", uploadFile);
  return await axios.post(`${process.env.NEXT_PUBLIC_API_URL}`, formData, {});
};
