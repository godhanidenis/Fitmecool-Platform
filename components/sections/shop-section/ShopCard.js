import React from "react";
import { Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import { useSelector } from "react-redux";
import Carousel from "react-multi-carousel";

const ShopCard = ({ shop }) => {
  const shopsFiltersReducer = useSelector((state) => state.shopsFiltersReducer);

  const { themeLayout } = useSelector((state) => state.themeLayout);

  const items = shop.shop_images.map((itm) => {
    return (
      <Image
        src={itm?.links ?? ""}
        alt={shop.name}
        width={350}
        height={shopsFiltersReducer.shopLayout === "list" ? 356 : 400}
        className="rounded-[8px] object-cover"
        key={itm}
      />
    );
  });
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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

  return (
    <div className="bg-white rounded-lg ">
      <div className="">
        <div className="my-[5px] cursor-pointer product-parent-div">
          <div className="grid grid-cols-1 place-items-center">
            <div className="w-[100%]">
              <Carousel
                infinite
                responsive={responsive}
                customLeftArrow={<TrendingCustomLeftArrow onClick={TrendingCustomLeftArrow} />}
                customRightArrow={<TrendingCustomRightArrow onClick={TrendingCustomRightArrow} />}
                dotListClass={"Landing_customDots"}
              >
                {items}
              </Carousel>
              {/* <Slider {...settings}>{items}</Slider> */}
            </div>
          </div>

          <div className="product-overlay">
            <Link href={`/shop/${shop.id}`}>
              <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                <button className="text-colorWhite text-base px-4 py-2 w-full md:w-1/2 lg:w-full xl:w-1/2 bg-colorPrimary rounded-md detailButton">
                  Visit Shop
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="px-5 py-3">
        <div style={{ alignItems: "flex-start" }} className="flex gap-2 justify-between">
          <div className="flex gap-2 justify-start">
            <div className="flex justify-center items-center">
              <Image alt="Shop Logo" src={shop?.shop_logo ?? ""} width={50} height={50} className="rounded-[50%]" />
            </div>
            <div className="flex flex-col align-baseline">
              <Link href={`/shop/${shop.id}`}>
                <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
                  <p className="text-[#000000] text-base font-semibold cursor-pointer hover:text-colorPrimary">
                    {shop.shop_name}
                  </p>
                </a>
              </Link>
              <p className="text-[#888888] text-sm font-normal">
                <LocationOnIcon fontSize="small" className="!mr-1" />
                {shop?.branch_info?.length > 1
                  ? shop?.branch_info?.map((itm) => itm.branch_type === "main" && itm.branch_address)
                  : shop?.branch_info[0]?.branch_address}
              </p>
              {shopsFiltersReducer.shopLayout === "list" && (
                <span className="text-[14px] font-normal flex items-center mt-2 text-colorBlack">
                  {`${shop?.shopFollowerCount} Followers`}
                </span>
              )}
            </div>
          </div>
          {shopsFiltersReducer.shopLayout === "list" && (
            <div className="flex items-center mt-2 flex-wrap gap-2">
              <div className="p-1 flex items-center gap-1">
                <StarIcon fontSize="small" className="!text-yellow-400" />
                <p className="text-colorBlack text-[14px] font-normal">{shop.shop_rating}</p>
              </div>
              <span className="text-[14px] font-normal text-[gray]">({shop.shopReviewCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* {shopsFiltersReducer.shopLayout === "list" && (
        <div className="px-5 flex justify-between">
          <div className="py-3 w-2/5">
            <p className="font-semibold text-colorBlack text-center">Followers</p>
            <span className="font-medium text-base lg:text-lg flex items-center mt-2 justify-center text-colorBlack">
              {shop?.shopFollowerCount}
            </span>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="py-3 w-2/5">
            <p className="font-semibold text-colorBlack text-center">Reviews</p>
            <div className="flex items-center mt-2 justify-center flex-wrap gap-2">
              <div className="border rounded-lg p-1 flex items-center gap-1">
                <StarIcon fontSize="medium" className="!text-yellow-400" />
                <p className="text-colorBlack font-semibold">{shop.shop_rating}</p>
              </div>
              <span className="font-medium text-base lg:text-lg text-colorBlack">({shop.shopReviewCount})</span>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ShopCard;
