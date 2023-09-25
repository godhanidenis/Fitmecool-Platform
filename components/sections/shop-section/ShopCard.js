import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import { useSelector } from "react-redux";
import Carousel from "react-multi-carousel";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const TrendingCustomLeftArrow = ({ onClick }) => {
  return (
    <div
      style={{
        background: "black",
        color: "white",
        left: 0,
        position: "absolute",
        cursor: "pointer",
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        marginLeft: "16px",
        marginBottom: "25%",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onClick()}
    >
      <i
        style={{
          border: "solid",
          width: "10px",
          height: "10px",
          borderWidth: "0px 2px 2px 0px",
          display: "inline-block",
          transform: "rotate(135deg)",
          cursor: "pointer",
          position: "relative",
          right: "-1px",
        }}
      />
    </div>
  );
};

const TrendingCustomRightArrow = ({ onClick }) => {
  return (
    <div
      style={{
        background: "black",
        color: "white",
        right: 0,
        position: "absolute",
        cursor: "pointer",
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        marginRight: "16px",
        marginBottom: "25%",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onClick()}
    >
      <i
        style={{
          border: "solid",
          width: "10px",
          height: "10px",
          borderWidth: "0px 2px 2px 0px",
          display: "inline-block",
          transform: "rotate(-45deg)",
          cursor: "pointer",
          position: "relative",
          left: "-1px",
        }}
      />
    </div>
  );
};

const ShopCard = ({ shop }) => {
  const { themeLayout } = useSelector((state) => state.themeLayout);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [autoplay, setAutoplay] = useState(false);
  const [isShopLogoLoaded, setIsShopLogoLoaded] = useState(false);
  const [isShopImagesLoaded, setShopImagesLoaded] = useState(false);

  const carouselRef = useRef(null);

  const shopImages = shop.shop_images.map((itm, index) => {
    return (
      <div
        className="relative"
        key={index}
        style={{
          width: "100%",
          height: themeLayout === "mobileScreen" ? 250 : 300,
        }}
        onMouseEnter={() => {
          setAutoplay(true);
          setCurrentImageIndex(null);
        }}
        onMouseLeave={() => {
          setAutoplay(false);
          setCurrentImageIndex(0);
        }}
      >
        {!isShopImagesLoaded && (
          <ImageLoadingSkeleton className="object-cover" />
        )}

        <Image
          // src={itm?.links ?? ""}
          src={
            currentImageIndex === null
              ? itm?.links
              : currentImageIndex === 0 && shop.shop_images[0]?.links
          }
          alt={shop?.shop_name}
          className={`object-cover absolute top-0 left-0 ${
            isShopImagesLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setShopImagesLoaded(true)}
          layout="fill"
        />
      </div>
    );
  });

  return (
    <div className="bg-white shadow-xl h-full">
      <div className="">
        <div className="cursor-pointer product-parent-div">
          <div className="grid grid-cols-1 place-items-center">
            <div className="w-[100%]">
              <Carousel
                ref={carouselRef}
                autoPlay={autoplay}
                autoPlaySpeed={900}
                infinite
                // removeArrowOnDeviceType={["mobile"]}
                arrows={false}
                responsive={responsive}
                // customLeftArrow={
                //   <TrendingCustomLeftArrow onClick={TrendingCustomLeftArrow} />
                // }
                // customRightArrow={
                //   <TrendingCustomRightArrow
                //     onClick={TrendingCustomRightArrow}
                //   />
                // }
                dotListClass={"Landing_customDots"}
              >
                {shopImages}
              </Carousel>
            </div>
          </div>

          {/* <div className="product-overlay">
            <Link href={`/shop/${shop.id}`}>
              <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                <button className="text-colorWhite text-base px-4 py-2 w-full md:w-1/2 lg:w-full xl:w-1/2 bg-colorPrimary rounded-t-[16px] detailButton whitespace-nowrap">
                  Visit Shop
                </button>
              </a>
            </Link>
          </div> */}
        </div>
      </div>
      <Link href={`/shop/${shop.id}`}>
        <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
          <div className="px-5 py-3">
            <div
              style={{ alignItems: "flex-start" }}
              className="flex gap-2 justify-between"
            >
              <div className="flex gap-2 justify-start">
                <div className="flex justify-center items-center">
                  <div className="flex justify-center items-center relative w-[50px] h-[50px]">
                    {!isShopLogoLoaded && (
                      <ImageLoadingSkeleton
                        className="rounded-[50%]"
                        variant="circular"
                      />
                    )}
                    <Image
                      alt="Shop Logo"
                      src={shop?.shop_logo ?? ""}
                      layout="fill"
                      className={`rounded-[50%] absolute top-0 left-0 ${
                        isShopLogoLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setIsShopLogoLoaded(true)}
                    />
                  </div>
                </div>
                <div className="flex flex-col align-baseline">
                  <p className="text-[#000000] text-base font-semibold cursor-pointer hover:text-colorPrimary">
                    {shop.shop_name}
                  </p>

                  <p className="text-[#888888] text-sm font-normal">
                    <LocationOnIcon fontSize="small" className="!mr-1" />
                    {shop?.branch_info?.length > 1
                      ? shop?.branch_info?.map(
                          (itm) =>
                            itm.branch_type === "main" && itm.branch_address
                        )
                      : shop?.branch_info[0]?.branch_address}
                  </p>

                  <span className="text-[14px] font-normal flex items-center mt-2 text-colorBlack">
                    {`${shop?.shopFollowerCount} Followers`}
                  </span>
                </div>
              </div>

              <div className="flex items-center mt-2 flex-wrap gap-2">
                <div className="p-1 flex items-center gap-1">
                  <StarIcon fontSize="small" className="!text-yellow-400" />
                  <p className="text-colorBlack text-[14px] font-normal">
                    {shop.shop_rating}
                  </p>
                </div>
                <span className="text-[14px] font-normal text-[gray]">
                  ({shop.shopReviewCount})
                </span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ShopCard;
