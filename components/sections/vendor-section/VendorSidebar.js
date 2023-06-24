import React, { useEffect, useState } from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useRouter } from "next/router";
import { Avatar, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { TbShare3 } from "react-icons/tb";

const VendorSidebar = ({ vendorShopDetails, handleMobileSidebarClick }) => {
  const router = useRouter();

  const { themeLayout } = useSelector((state) => state.themeLayout);
  const [value, setValue] = useState(4);
  const labels = {
    1: "1.0",
    2: "2.0",
    3: "3.0",
    4: "4.0",
    5: "5.0",
  };
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }
  const setActiveLink = (path) => {
    const withoutLastChunk = router.pathname.slice(
      0,
      router.pathname.lastIndexOf("/")
    );
    return router.pathname === path || withoutLastChunk === path
      ? "!text-colorPrimary hover:!text-colorPrimary"
      : "text-[#544E5D] hover:opacity-50";
  };

  console.log("data", vendorShopDetails);
  return (
    <div className="bg-white rounded-3xl lg:p-10 p-5 py-10">
      <div className="flex justify-center">
        <div className="xl:w-[278px] xl:h-[278px] lg:h-[200px] sm:h-[150px] lg:w-[200px] sm:w-[150px] h-[200px] w-[200px] mb-10 rounded-full">
          <img
            src={vendorShopDetails?.shop_logo}
            className="object-cover rounded-full w-full h-full"
          />
        </div>
      </div>
      <div className="flex flex-col items-center lg:gap-2 gap-1">
        <div className="xl:text-4xl lg:text-xl sm:text-sm text-[32px] font-bold text-colorBlack">
          GJ5 Fashion
        </div>
        <div className="flex items-center">
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
            Yogi Chowk
          </span>
        </div>
        <span className="flex items-center">
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
            name="read-only"
            value={value}
            getLabelText={getLabelText}
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
          {value !== null && (
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
              {labels[value]}
            </Box>
          )}
        </span>
        <span className="text-2xl text-gray-400 m-10 border border-gray-200 rounded-full p-3">
          <TbShare3 className="lg:text-2xl xl:text-3xl sm:text-xl text-2xl" />
        </span>
      </div>
    </div>
  );
};
export default VendorSidebar;
