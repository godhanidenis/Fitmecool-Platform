import React from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useRouter } from "next/router";
import { Avatar, Divider } from "@mui/material";
import { useSelector } from "react-redux";

const VendorSidebar = ({ vendorShopDetails, handleMobileSidebarClick }) => {
  const router = useRouter();

  const { themeLayout } = useSelector((state) => state.themeLayout);

  const setActiveLink = (path) => {
    const withoutLastChunk = router.pathname.slice(
      0,
      router.pathname.lastIndexOf("/")
    );
    return router.pathname === path || withoutLastChunk === path
      ? "!text-colorPrimary hover:!text-colorPrimary"
      : "text-[#544E5D] hover:opacity-50";
  };

  return (
    <div className="lg:bg-white flex flex-col lg:h-full">
      <div className="flex flex-col items-center justify-center gap-3 my-10">
        <Avatar
          src={vendorShopDetails?.shop_logo}
          alt="Shop Logo"
          sx={{ width: 100, height: 100 }}
        />

        <p className="text-colorBlack font-semibold text-lg">
          {vendorShopDetails?.shop_name}
        </p>
      </div>
      <Divider className="w-full lg:w-[75%] mx-auto" />
      <div className="flex justify-center flex-col w-[90%] lg:w-[75%] mx-auto my-5">
        <div
          className={`${setActiveLink(
            "/vendor/dashboard"
          )} text-[#0000007e] font-semibold p-4 hover:text-colorPrimary`}
          style={{ transition: "all 0.5s" }}
          onClick={() => {
            router.push("/vendor/dashboard");
            themeLayout === "mobileScreen" && handleMobileSidebarClick();
          }}
        >
          <p className="flex items-center cursor-pointer">
            <DashboardIcon className="!mr-3" /> Dashboard
          </p>
        </div>

        <div
          className={`${setActiveLink(
            "/vendor/shopEdit"
          )} text-[#0000007e] font-semibold p-4 hover:text-colorPrimary`}
          onClick={() => {
            router.push(`/vendor/shopEdit/${vendorShopDetails?.id}`);
            themeLayout === "mobileScreen" && handleMobileSidebarClick();
          }}
        >
          <p className="flex items-center cursor-pointer">
            <Inventory2Icon className="!mr-3" />
            Shop
          </p>
        </div>

        <div
          className={`${setActiveLink(
            "/vendor/shop"
          )}  text-[#0000007e] font-semibold p-4 hover:text-colorPrimary`}
          onClick={() => {
            router.push(`/vendor/shop/${vendorShopDetails?.id}`);
            themeLayout === "mobileScreen" && handleMobileSidebarClick();
          }}
        >
          <p className="flex items-center cursor-pointer">
            <ListAltIcon className="!mr-3" />
            Products
          </p>
        </div>
      </div>
    </div>
  );
};
export default VendorSidebar;
