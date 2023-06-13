/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

const CustomReactImageMagnify = (props) => {
  const [imageHover, setImageHover] = useState(false);

  useEffect(() => {
    let elem = document.getElementById("preview");

    elem.addEventListener("mousemove", (event) => {
      let bounds = elem.getBoundingClientRect();

      let xposition = event.clientX - bounds.left;
      let yposition = event.clientY - bounds.top;

      let xpercent = Math.round(100 / (bounds.width / xposition));
      let ypercent = Math.round(100 / (bounds.height / yposition));

      document.querySelector(".zoom-box").style.backgroundPosition = xpercent + "% " + ypercent + "%";
    });
  }, []);

  const loadImage = () => {
    // larger image lazy loads so it's not slowing down the page on load
    setImageHover(true);
  };

  let divShow = {
    backgroundImage: `url(${props.large})`,
  };

  let divHide = {
    backgroundImage: "none",
  };
  return (
    <>
      <div className="image-preview">
        <img
          id="preview"
          src={props.preview}
          onMouseEnter={loadImage}
          onMouseLeave={() => setImageHover(false)}
          alt=""
        />
        {imageHover ? (
          <div style={divShow} className="zoom-box"></div>
        ) : (
          <div style={divHide} className="zoom-box"></div>
        )}
        <style jsx>
          {`
            img {
              width: 100%;
            }

            .zoom-box {
              width: 80%;
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
