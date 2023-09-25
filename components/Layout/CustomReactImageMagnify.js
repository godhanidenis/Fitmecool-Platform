/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";

const CustomReactImageMagnify = ({ large, preview }) => {
  const [imageHover, setImageHover] = useState(false);

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
    backgroundImage: `url(${large})`,
  };

  let divHide = {
    backgroundImage: "none",
  };
  return (
    <>
      <div className="image-preview">
        {preview ? (
          <img
            id="preview"
            src={preview}
            onMouseEnter={loadImage}
            onMouseLeave={() => setImageHover(false)}
            alt=""
          />
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
              width: 500px;
              height: 100%;
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
