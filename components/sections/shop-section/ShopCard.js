import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import { useSelector } from "react-redux";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { assets } from "../../../constants";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

const ShopCard = ({ shop }) => {
  const { themeLayout } = useSelector((state) => state.themeLayout);
  const [isShopLogoLoaded, setIsShopLogoLoaded] = useState(false);
  const [isShopImagesLoaded, setShopImagesLoaded] = useState(false);
  const [isLogoImage, setIsLogoImage] = useState(false);
  const [isShopImages, setIsShopImages] = useState(false);

  const shopSlug = shop.shop_name?.toLowerCase()?.replaceAll(" ", "-");

  return (
    <div className="w-[98%] sm:w-[49%] lg:w-[32%] mb-3 sm:mb-0 bg-white shadow-md h-full rounded-lg ">
      <div className="">
        <div className="cursor-pointer relative top-0 left-0">
          <div className="grid grid-cols-1 place-items-center">
            <div
              className={`relative rounded-t-lg`}
              style={{
                width: "100%",
                height: themeLayout === "mobileScreen" ? 250 : 300,
              }}
            >
              <Link href={`/shop/${shopSlug}/${shop.id}`}>
                <a
                  target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}
                  rel="noopener noreferrer"
                >
                  {!isShopImagesLoaded && (
                    <ImageLoadingSkeleton className="!object-cover !h-full !rounded-t-lg !bg-[#00000049]" />
                  )}
                  {!shop?.shop_images[0]?.links?.medium || isShopImages ? (
                    <>
                      <Image
                        src={assets.shopBackgroundCover4 ?? ""}
                        alt={shop?.shop_name}
                        className={`object-cover absolute top-0 left-0 rounded-t-lg
                        `}
                        onLoad={() => setShopImagesLoaded(true)}
                        layout="fill"
                        onError={() => {
                          setIsShopImages(true);
                        }}
                      />
                      <div className="w-full h-full bg-[#00000031] rounded-t-lg absolute top-0" />
                    </>
                  ) : (
                    <Image
                      src={shop?.shop_images[0]?.links?.medium ?? ""}
                      alt={shop?.shop_name}
                      className={`object-cover object-top absolute top-0 left-0 rounded-t-lg`}
                      onLoad={() => setShopImagesLoaded(true)}
                      onError={() => {
                        setIsShopImages(true);
                      }}
                      layout="fill"
                    />
                  )}
                </a>
              </Link>
            </div>
          </div>

          <div className="absolute top-2 z-10">
            <span
              className={`flex items-center justify-center gap-1 label label-large arrowed-right text-white font-semibold ${
                shop?.shop_status ? "bg-[#29977E]" : "bg-[#ff0000cc]"
              }`}
            >
              {shop?.shop_status ? (
                <>
                  <VerifiedIcon /> Verified
                </>
              ) : (
                <>
                  <AccessibilityNewIcon /> HandPicked
                </>
              )}
            </span>
          </div>
        </div>
      </div>
      <Link href={`/shop/${shopSlug}/${shop.id}`}>
        <a target={`${themeLayout === "webScreen" ? "_blank" : "_self"}`}>
          <div className="px-5 py-3">
            <div
              style={{ alignItems: "flex-start" }}
              className="flex gap-2 justify-between"
            >
              <div className="flex gap-2 justify-start">
                <div className="flex justify-center items-start">
                  <div className="flex justify-center items-center relative w-[50px] h-[50px]">
                    {!isShopLogoLoaded && (
                      <ImageLoadingSkeleton
                        className="!rounded-[50%]"
                        variant="circular"
                      />
                    )}
                    <Image
                      alt="Shop Logo"
                      src={shop?.shop_logo?.small ?? ""}
                      layout="fill"
                      className={`rounded-[50%] absolute top-0 left-0 object-cover object-center ${
                        isShopLogoLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setIsShopLogoLoaded(true)}
                      onError={() => {
                        setIsLogoImage(true);
                      }}
                    />
                    {isLogoImage && (
                      <Avatar
                        className="!bg-colorGreen"
                        sx={{
                          fontSize: "18px",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {String(shop.shop_name)?.split(" ")[0][0].toUpperCase()}
                      </Avatar>
                    )}
                  </div>
                </div>
                <div className="flex flex-col align-baseline">
                  <p className="text-[#000000] text-base font-semibold cursor-pointer hover:text-colorPrimary line-clamp-1">
                    {shop.shop_name}
                  </p>

                  <p className="text-[#878A99] text-sm font-light flex justify-start">
                    <span className="text-start line-clamp-1 ">
                      <LocationOnIcon fontSize="small" className="!mr-1" />
                      {shop?.branch_info?.length > 1
                        ? shop?.branch_info?.map(
                            (itm) =>
                              itm.branch_type === "main" && itm.branch_address
                          )
                        : shop?.branch_info[0]?.branch_address}
                    </span>
                  </p>

                  <p className="text-[16px] font-normal flex items-center mt-2 text-colorBlack gap-1">
                    <span className="rounded-full flex items-center">
                      <PersonIcon className="!w-4" />
                    </span>
                    <span className="flex items-center justify-center">
                      {shop?.shopFollowerCount}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center flex-nowrap">
                <p className="text-[#151827] text-[14px] flex items-center gap-[2px]">
                  <StarIcon className="!text-yellow-400 !w-4" />
                  {shop.shop_rating}{" "}
                  <span className="text-[#15182766]">
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
