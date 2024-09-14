import React from "react";
import Carousel from "react-multi-carousel";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ImageLoadingSkeleton from "../Modal/ImageLoadingSkeleton";
import { useState } from "react";
import Image from "next/image";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const CustomDot = ({ onClick, active }) => {
  return (
    <li className="" onClick={() => onClick()}>
      <FiberManualRecordIcon
        className={`${
          active ? "!text-[#31333E]" : "!text-[#31333e33]"
        } !w-2 lg:!w-3 !h-2 lg:!h-3 !mx-1 !cursor-pointer`}
        fontSize="small"
      />
    </li>
  );
};

const BannerHero = ({ carouselItems, className }) => {
  const [isBannerImagesLoaded, setBannerImagesLoaded] = useState(false);
  return (
    <Carousel
      responsive={responsive}
      arrows={false}
      showDots
      customDot={<CustomDot />}
      customTransition="all .5s ease-in-out"
      infinite
      autoPlay
      autoPlaySpeed={5000}
      className="!pb-8"
    >
      {carouselItems &&
        carouselItems.map((item, index) => (
          <div
            key={index}
            className="flex w-full h-[150px] md:h-[400px] relative"
          >
            <Image
              src={item.imageSrc}
              alt="banner"
              onLoad={() => setBannerImagesLoaded(true)}
              onClick={item?.func}
              className={className}
              layout="fill"
              objectFit="cover"
            />

            {!isBannerImagesLoaded && (
              <ImageLoadingSkeleton className="!object-cover" />
            )}
          </div>
        ))}
    </Carousel>
  );
};

export default BannerHero;
