export const handleUploadImage = async (
  file,
  folderStructure,
  imageSizesVariants
) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("imageSizesVariants", JSON.stringify(imageSizesVariants));
  formData.append("folderStructure", folderStructure);

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
