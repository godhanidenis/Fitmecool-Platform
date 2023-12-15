import { useState } from "react";
import Image from "next/image";
import axios from "axios";

import React from "react";

const HomeImageStuff = () => {
  const [withOutResizedImage, setWithOutResizedImage] = useState(null);

  const handleFileChange = async (e) => {
    const file = event.target.files[0];
    setWithOutResizedImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response;
        // const result = await response.json();
        console.log("Image uploaded successfully:", result.imagePath);
      } else {
        console.error("Error uploading image:", response.statusText);
      }
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  return (
    <div>
      <h1>Image Resizer</h1>
      <input type="file" onChange={handleFileChange} />
      {withOutResizedImage && (
        <div className="w-[400px] h-[400px]">
          <Image
            src={withOutResizedImage}
            alt="Uploaded Image"
            height={400}
            width={400}
            objectFit="contain"
            className="!object-cover !h-full !w-full !rounded-full !object-center"
            objectPosition="center"
          />
        </div>
      )}
    </div>
  );
};

export default HomeImageStuff;
