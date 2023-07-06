import React, { useEffect, useState } from "react";
import { Tooltip, styled, tooltipClasses } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { TbShare3 } from "react-icons/tb";
import facebookIcon from "../../../assets/facebook.png";
import googleIcon from "../../../assets/googleIcon.svg";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Image from "next/image";
import { useRouter } from "next/router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

const VendorSidebar = ({ vendorShopDetails }) => {
  const [ratingValue, setRatingValue] = useState(null);

  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    const withoutLastChunk = router.pathname.slice(
      0,
      router.pathname.lastIndexOf("/")
    );

    if (router.pathname === "/vendor/dashboard") {
      setSelectedValue("Dashboard");
    } else if (withoutLastChunk === "/vendor/shopEdit") {
      setSelectedValue("Shop");
    } else if (
      withoutLastChunk === "/vendor/shop" ||
      `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/`
    ) {
      setSelectedValue("Products");
    }
  }, [router.pathname]);

  useEffect(() => {
    if (vendorShopDetails) {
      setRatingValue(vendorShopDetails?.shop_rating);
    }
  }, [vendorShopDetails]);

  return (
    <div className="sm:bg-white sm:h-screen lg:p-6 p-5 sm:py-10 flex flex-col items-center">
      <div className="flex justify-center">
        <div className="w-[182px] h-[182px] mb-10 sm:mt-10 rounded-full">
          <img
            src={vendorShopDetails?.shop_logo}
            className="object-cover rounded-full w-full h-full"
          />
        </div>
      </div>
      <div className="flex flex-col items-center lg:gap-2 gap-1 w-full">
        <div className="lg:text-3xl text-[32px] font-bold text-[#151827] pb-8 whitespace-nowrap">
          {vendorShopDetails?.shop_name}
        </div>
        <div
          style={{ opacity: 0.20000000298023224 }}
          className="w-full h-[1px] bg-[#B1B1B1] sm:mb-11"
        ></div>
        <div className="w-full font-Nova ml-[30%] hidden sm:block">
          {["Dashboard", "Shop", "Products"].map((item, index) => (
            <p
              key={index}
              onClick={() => {
                item === "Dashboard" && router.push("/vendor/dashboard");
                item === "Shop" &&
                  router.push(`/vendor/shopEdit/${vendorShopDetails?.id}`);
                item === "Products" &&
                  router.push(`/vendor/shop/${vendorShopDetails?.id}`);
              }}
              className={`font-semibold pb-10 text-lg ${
                selectedValue === item ? "text-[#29977E]" : "text-[#151827]"
              }  cursor-pointer uppercase`}
            >
              {item === "Dashboard" ? (
                <DashboardIcon className="mr-4" />
              ) : item === "Shop" ? (
                <StoreIcon className="mr-4" />
              ) : (
                <ProductionQuantityLimitsIcon className="mr-4" />
              )}

              {item}
            </p>
          ))}
        </div>
        {/* <div className="flex items-center">
          <span>
            <LocationOnOutlinedIcon
              className="text-gray-400"
              sx={{
                fontSize: 24,
                "@media (max-width: 768px)": {
                  fontSize: 12,
                },
                "@media (max-width: 648px)": {
                  fontSize: 24,
                },
              }}
            />
          </span>
          <span className="xl:text-2xl lg:text-lg sm:text-sm text-[22px] text-gray-400">
            {vendorShopDetails?.branch_info?.map((item) =>
              item?.branch_type === "main" ? item.branch_address : ""
            )}
          </span>
        </div> */}
        {/* <span className="flex items-center">
          <Rating
            sx={{
              fontSize: 16,
              "@media (max-width: 768px)": {
                fontSize: 10,
              },
              "@media (max-width: 648px)": {
                fontSize: 16,
              },
            }}
            precision={0.5}
            name="read-only"
            value={ratingValue}
            emptyIcon={
              <StarIcon
                sx={{
                  opacity: 0.55,
                  fontSize: 16,
                  "@media (max-width: 768px)": {
                    fontSize: 10,
                  },
                  "@media (max-width: 648px)": {
                    fontSize: 16,
                  },
                }}
              />
            }
            readOnly
          />
          {vendorShopDetails?.shop_rating !== null && (
            <Box
              sx={{
                ml: 1,
                fontSize: 18,
                "@media (max-width: 768px)": {
                  fontSize: 12,
                },
                "@media (max-width: 648px)": {
                  fontSize: 16,
                },
              }}
            >
              {ratingValue}
            </Box>
          )}
        </span> */}
      </div>
    </div>
  );
};
export default VendorSidebar;
