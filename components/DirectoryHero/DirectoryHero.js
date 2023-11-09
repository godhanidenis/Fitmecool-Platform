import React, { useEffect, useState } from "react";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";

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
        <section className="bg-[#00000079]">
          <div className="h-[192px] md:h-[288px] flex justify-center pt-2 md:pt-20">
            {/* <h1 className="text-center font-semibold  text-2xl md:text-5xl bg-gradient-to-r from-[#29977E] to-[#fff]  inline-block text-transparent bg-clip-text"> */}
            {/* <h1 className="text-center font-nova text-4xl md:text-5xl text-[#fff]">
              {title}
            </h1> */}
          </div>
        </section>
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
          <ImageLoadingSkeleton className="py-24 md:py-36 bg-cover bg-repeat-round" />
        )
      )}
    </>
  );
};

export default DirectoryHero;
