import React, { useEffect, useState } from "react";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";

const DirectoryHero = ({ title, bgImg }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = bgImg;
    img.onload = () => {
      setLoaded(true);
    };
  }, [bgImg]);

  return (
    <>
      <section
        className="py-24 md:py-36 bg-cover bg-repeat-round"
        style={{
          backgroundImage: `url(${loaded && bgImg})`,
          display: !loaded && "none",
        }}
      >
        <div className="container">
          <h1 className="text-center font-semibold text-colorWhite text-2xl md:text-5xl">
            {title}
          </h1>
        </div>
      </section>

      {!loaded && (
        <ImageLoadingSkeleton className="py-24 md:py-36 bg-cover bg-repeat-round" />
      )}
    </>
  );
};

export default DirectoryHero;
