import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";
import { useSelector } from "react-redux";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";
import Link from "next/link";
import { Avatar } from "@mui/material";

const ShopCard = ({ shop }) => {
  const { themeLayout } = useSelector((state) => state.themeLayout);
  const [isShopLogoLoaded, setIsShopLogoLoaded] = useState(false);
  const [isShopImagesLoaded, setShopImagesLoaded] = useState(false);
  const [isLogoImage, setIsLogoImage] = useState(false);
  const [isShopImages, setIsShopImages] = useState(false);

  return (
    <div className="rounded-lg shadow-md flex flex-col w-[100%] cursor-pointer">
      <Link href={`/shop/${shop.id}`} passHref>
        <a
          target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
          rel="noopener noreferrer"
        >
          <div className="relative top-0 left-0">
            <div
              className="relative"
              style={{
                width: "100%",
                height: themeLayout === "mobileScreen" ? 100 : 150,
              }}
            >
              {!isShopImagesLoaded && (
                <ImageLoadingSkeleton className="object-cover" />
              )}
              {isShopImages ? (
                <></>
              ) : (
                <Image
                  src={shop?.shop_cover_image ?? ""}
                  unoptimized={true}
                  alt={shop?.shop_name}
                  className={`object-cover absolute top-0 left-0 rounded-t-lg  ${
                    isShopImagesLoaded ? "opacity-100" : "opacity-0 "
                  }`}
                  onLoad={() => setShopImagesLoaded(true)}
                  layout="fill"
                  onError={() => {
                    setIsShopImages(true);
                  }}
                />
              )}

              <div
                className={`absolute top-0 left-0 w-full h-full bg-black opacity-50 rounded-t-lg ${
                  isShopImagesLoaded ? "opacity-100" : "opacity-0 "
                }`}
                style={{
                  opacity: isShopImagesLoaded ? 0.2 : 0, // Set the opacity value as needed
                }}
              />
            </div>
            <div className=" w-full flex -mt-10 md:-mt-10 lg:-mt-14 xl:-mt-14 2xl:-mt-12  justify-center">
              <div
                className="flex relative"
                style={{
                  width: themeLayout === "mobileScreen" ? "60px" : "90px",
                  height: themeLayout === "mobileScreen" ? "60px" : "90px",
                }}
              >
                {isLogoImage && (
                  <Avatar
                    className="!bg-colorGreen"
                    sx={{
                      fontSize: "40px",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {String(shop.shop_name)?.split(" ")[0][0].toUpperCase()}
                  </Avatar>
                )}
                <Image
                  src={shop?.shop_logo ?? ""}
                  unoptimized={true}
                  alt="Shop Logo"
                  objectFit="cover"
                  className={`rounded-full absolute top-0 left-0  ${
                    isShopLogoLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setIsShopLogoLoaded(true)}
                  width="100%"
                  height="100%"
                  onError={() => {
                    setIsLogoImage(true);
                  }}
                />
                {!isShopLogoLoaded && (
                  <ImageLoadingSkeleton
                    className="rounded-[50%] absolute"
                    variant="circular"
                    width="100%"
                    height="100%"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-center p-5 shadow-md rounded-lg">
              <p className="text-[16px] text-[#151827] font-semibold line-clamp-1">
                {shop.shop_name}
              </p>
              <p className="text-[#878A99] text-[12px]  font-light flex justify-center items-center">
                <span className="text-center line-clamp-1 ">
                  <LocationOnIcon className="!mr-1 !w-4" />
                  {shop?.branch_info?.length > 1
                    ? shop?.branch_info?.map(
                        (itm) =>
                          itm.branch_type === "main" && itm.branch_address
                      )
                    : shop?.branch_info[0]?.branch_address}
                </span>
              </p>
              <div className="flex justify-between gap-3">
                <p className="text-[#151827] text-[14px] flex items-center">
                  <span className="rounded-full flex items-center">
                    <PersonIcon className="!w-4" />
                  </span>
                  {shop?.shopFollowerCount}
                </p>
                <p className="text-[#151827] text-[14px] flex items-center">
                  <StarIcon className="!text-yellow-400 !w-4" />
                  {shop.shop_rating}
                  <span className="text-[#15182766] ml-1">
                    ({shop.shopReviewCount})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ShopCard;
