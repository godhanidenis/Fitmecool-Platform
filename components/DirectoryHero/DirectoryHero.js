import React, { useEffect, useState } from "react";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";
import { assets } from "../../constants";

const DirectoryHero = ({ title, bgImg }) => {
  const [loaded, setLoaded] = useState(false);
  const [isShopImages, setIsShopImages] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = bgImg;
    img.onload = () => {
      setLoaded(true);
    };
    img.onerror = () => {
      setIsShopImages(true);
    };
  }, [bgImg]);

  return (
    <>
      {isShopImages ? (
        <section
          className={`py-24 md:py-36 bg-cover bg-repeat-round`}
          style={{
            backgroundImage: `url(${assets.shopBackgroundCover3})`,
          }}
        />
      ) : loaded && !isShopImages ? (
        <section
          className="py-24 md:py-36 bg-cover bg-repeat-round"
          style={{
            backgroundImage: `url(${loaded && bgImg})`,
            display: !loaded && "none",
          }}
        />
      ) : (
        !loaded && (
          <ImageLoadingSkeleton className="!py-24 md:!py-36 !bg-cover !bg-repeat-round" />
        )
      )}
    </>
  );
};

export default DirectoryHero;
