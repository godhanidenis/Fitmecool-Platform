/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable @next/next/no-img-element */
// import React, { useEffect, useState } from "react";
// import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";

// const CustomReactImageMagnify = ({ large, preview }) => {
//   const [imageHover, setImageHover] = useState(false);
//   const [isShopImages, setIsShopImages] = useState(false);
//   const [isProductImage, setIsProductImage] = useState("");

//   useEffect(() => {
//     let elem = document.getElementById("preview");

//     elem.addEventListener("mousemove", (event) => {
//       let bounds = elem.getBoundingClientRect();

//       let xPosition = event.clientX - bounds.left;
//       let yPosition = event.clientY - bounds.top;

//       let xPercent = Math.round(100 / (bounds.width / xPosition));
//       let yPercent = Math.round(100 / (bounds.height / yPosition));

//       document.querySelector(".zoom-box").style.backgroundPosition =
//         xPercent + "% " + yPercent + "%";
//     });
//   }, []);

//   const loadImage = () => {
//     // larger image lazy loads so it's not slowing down the page on load
//     setImageHover(true);
//   };

//   let divShow = {
//     backgroundImage: `url(${large?.src})`,
//   };

//   let divHide = {
//     backgroundImage: "none",
//   };
//   return (
//     <>
//       <div className="image-preview">
//         {preview ? (
//           isProductImage === preview && isShopImages ? (
//             <div className="w-full h-full cursor-pointer rounded-[16px] bg-[#00000031]" />
//           ) : (
//             <>
//               {preview?.type === "image" && (
//                 <img
//                   id="preview"
//                   src={preview?.src}
//                   onMouseEnter={loadImage}
//                   onMouseLeave={() => setImageHover(false)}
//                   alt="product"
//                   onError={() => {
//                     setIsShopImages(true);
//                     setIsProductImage(preview);
//                   }}
//                   className="rounded-[16px]"
//                 />
//               )}

//               {preview?.type === "video" && (
//                 <video
//                   src={preview?.src}
//                   alt="product-video"
//                   onError={() => {
//                     setIsShopImages(true);
//                     setIsProductImage(preview);
//                   }}
//                   className="!rounded-[16px] h-full w-full !cursor-pointer !object-cover"
//                   autoPlay={true}
//                   controls
//                   muted
//                   loop
//                 />
//               )}
//             </>
//           )
//         ) : (
//           <div className="w-full h-full" id="preview">
//             <ImageLoadingSkeleton className="rounded-xl" />
//           </div>
//         )}
//         {imageHover ? (
//           <div style={divShow} className="zoom-box"></div>
//         ) : (
//           <div style={divHide} className="zoom-box"></div>
//         )}
//         <style jsx>
//           {`
//             img {
//               width: 100%;
//               height: 100%;
//               object-fit: cover;
//             }

//             .zoom-box {
//               width: 400px;
//               height: 65%;
//               position: absolute;
//               margin-left: 175%;
//               top: 0;
//               display: none;
//             }

//             .image-preview {
//               position: relative;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               width: 100%;
//               height: 100%;
//             }

//             .image-preview:hover {
//               cursor: zoom-in;
//             }

//             .image-preview:hover .zoom-box {
//               display: block;
//               z-index: 30;
//             }
//             @media (max-width: 1024px) {
//               .zoom-box {
//               width: 0px;
//               height: 0px;
//               position: absolute;
//               margin-left: 0px;
//               top: 0;
//               display: none;
//               }
//             @media (max-width: 767px) {
//               .image-preview:hover {
//                 cursor: pointer;
//               }
//               .image-preview:hover .zoom-box {
//                 display: block;
//               }
//             }
//           `}
//         </style>
//       </div>
//     </>
//   );
// };

// export default CustomReactImageMagnify;

import React, { useState } from "react";

const CustomReactImageMagnify = ({
  className,
  src,
  width,
  height,
  magnifierHeight = 300,
  magnifieWidth = 300,
  zoomLevel = 1.5,
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        height: height,
        width: width,
      }}
    >
      <img
        className={className}
        src={src}
        style={{ height: height, width: width }}
        onMouseEnter={(e) => {
          // update image size and turn-on magnifier
          const elem = e.currentTarget;
          const { width, height } = elem.getBoundingClientRect();
          setSize([width, height]);
          setShowMagnifier(true);
        }}
        onMouseMove={(e) => {
          // update cursor position
          const elem = e.currentTarget;
          const { top, left } = elem.getBoundingClientRect();

          // calculate cursor position on the image
          const x = e.pageX - left - window.pageXOffset;
          const y = e.pageY - top - window.pageYOffset;
          setXY([x, y]);
        }}
        onMouseLeave={() => {
          // close magnifier
          setShowMagnifier(false);
        }}
        alt={"img"}
      />

      <div
        style={{
          display: showMagnifier ? "" : "none",
          position: "absolute",

          // prevent maginier blocks the mousemove event of img
          pointerEvents: "none",
          // set size of magnifier
          height: `${magnifierHeight}px`,
          width: `${magnifieWidth}px`,
          // move element center to cursor pos
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifieWidth / 2}px`,
          opacity: "1", // reduce opacity so you can verify position
          border: "1px solid #00000014;",
          backgroundColor: "white",
          backgroundImage: `url('${src}')`,
          backgroundRepeat: "no-repeat",

          //calculate zoomed image size
          backgroundSize: `${imgWidth * zoomLevel}px ${
            imgHeight * zoomLevel
          }px`,

          //calculete position of zoomed image.
          backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      ></div>
    </div>
  );
};

export default CustomReactImageMagnify;
