/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";

const CustomReactImageMagnify = ({ large, preview }) => {
  const [imageHover, setImageHover] = useState(false);
  const [isShopImages, setIsShopImages] = useState(false);
  const [isProductImage, setIsProductImage] = useState("");

  useEffect(() => {
    let elem = document.getElementById("preview");

    elem.addEventListener("mousemove", (event) => {
      let bounds = elem.getBoundingClientRect();

      let xPosition = event.clientX - bounds.left;
      let yPosition = event.clientY - bounds.top;

      let xPercent = Math.round(100 / (bounds.width / xPosition));
      let yPercent = Math.round(100 / (bounds.height / yPosition));

      document.querySelector(".zoom-box").style.backgroundPosition =
        xPercent + "% " + yPercent + "%";
    });
  }, []);

  const loadImage = () => {
    // larger image lazy loads so it's not slowing down the page on load
    setImageHover(true);
  };

  let divShow = {
    backgroundImage: `url(${large?.src})`,
  };

  let divHide = {
    backgroundImage: "none",
  };
  return (
    <>
      <div className="image-preview">
        {preview ? (
          isProductImage === preview && isShopImages ? (
            <div className="w-full h-full cursor-pointer rounded-[16px] bg-[#00000031]" />
          ) : (
            <>
              {preview?.type === "image" && (
                <img
                  id="preview"
                  src={preview?.src}
                  onMouseEnter={loadImage}
                  onMouseLeave={() => setImageHover(false)}
                  alt="product"
                  onError={() => {
                    setIsShopImages(true);
                    setIsProductImage(preview);
                  }}
                  className="rounded-[16px]"
                />
              )}

              {preview?.type === "video" && (
                <video
                  src={preview?.src}
                  alt="product-video"
                  onError={() => {
                    setIsShopImages(true);
                    setIsProductImage(preview);
                  }}
                  className="!rounded-[16px] h-full w-full !cursor-pointer !object-cover"
                  autoPlay={true}
                  controls
                  muted
                  loop
                />
              )}
            </>
          )
        ) : (
          <div className="w-full h-full" id="preview">
            <ImageLoadingSkeleton className="rounded-xl" />
          </div>
        )}
        {imageHover ? (
          <div style={divShow} className="zoom-box"></div>
        ) : (
          <div style={divHide} className="zoom-box"></div>
        )}
        <style jsx>
          {`
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .zoom-box {
              width: 400px;
              height: 65%;
              position: absolute;
              margin-left: 175%;
              top: 0;
              display: none;
            }

            .image-preview {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
            }

            .image-preview:hover {
              cursor: zoom-in;
            }

            .image-preview:hover .zoom-box {
              display: block;
              z-index: 30;
            }
            @media (max-width: 1024px) {
              .zoom-box {
              width: 0px;
              height: 0px;
              position: absolute;
              margin-left: 0px;
              top: 0;
              display: none;
              }
            @media (max-width: 767px) {
              .image-preview:hover {
                cursor: pointer;
              }
              .image-preview:hover .zoom-box {
                display: block;
              }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default CustomReactImageMagnify;
