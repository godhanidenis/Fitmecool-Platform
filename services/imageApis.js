export const handleUploadImage = async (file, uploadImageSectionType) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("uploadImageSectionType", uploadImageSectionType);

  try {
    const response = await fetch("/api/image-upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return result.imageUrls;
    } else {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }
  } catch (error) {
    throw error;
  }
};

export const handleUpdateImage = async (
  links,
  file,
  uploadImageSectionType
) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("links", JSON.stringify(links));
  formData.append("uploadImageSectionType", uploadImageSectionType);

  try {
    const response = await fetch("/api/image-update", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return result.imageUrls;
    } else {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }
  } catch (error) {
    throw error;
  }
};
