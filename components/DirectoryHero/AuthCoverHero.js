import React, { useEffect, useState } from "react";
import { assets } from "../../constants";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";

const AuthCoverHero = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = assets.authCover;
    img.onload = () => {
      setLoaded(true);
    };
  }, []);

  return (
    <>
      <div
        className="hidden md:block md:w-[50%] bg-cover bg-repeat-round"
        style={{
          backgroundImage: `url(${loaded && assets.authCover})`,
          display: !loaded && "none",
        }}
      />

      {!loaded && (
        <ImageLoadingSkeleton className="!hidden md:!block md:!w-[50%] !h-screen" />
      )}
    </>
  );
};

export default AuthCoverHero;
