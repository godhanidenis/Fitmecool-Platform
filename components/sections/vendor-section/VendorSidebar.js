/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Avatar, Divider, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";

const VendorSidebar = ({ vendorShopDetails }) => {
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
  }, [router.pathname, vendorShopDetails?.id]);

  const vendorSidebarTabs = [
    {
      label: "Dashboard",
      icon: <DashboardIcon className="mr-4" />,
      path: "/vendor/dashboard",
    },
    {
      label: "Shop",
      icon: <StoreIcon className="mr-4" />,
      path: `/vendor/shopEdit/${vendorShopDetails?.id}`,
    },
    {
      label: "Products",
      icon: <ProductionQuantityLimitsIcon className="mr-4" />,
      path: `/vendor/shop/${vendorShopDetails?.id}`,
    },
  ];

  return (
    <div className="sm:bg-white sm:h-screen lg:p-6 p-5 sm:py-10 flex flex-col items-center">
      <div className="flex justify-center">
        <div className="w-[150px] h-[150px] mb-10 sm:mt-10 rounded-full">
          {vendorShopDetails?.shop_logo ? (
            <Avatar
              src={vendorShopDetails?.shop_logo}
              alt="Shop Logo"
              className="object-cover rounded-full !w-full !h-full"
            />
          ) : (
            <ImageLoadingSkeleton className="rounded-full" variant="circular" />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center lg:gap-2 gap-1 w-full">
        <div className="lg:text-3xl text-[32px] font-bold text-[#151827] pb-8 whitespace-nowrap w-full text-center">
          {vendorShopDetails?.shop_name ?? <Skeleton animation="wave" />}
        </div>
        <Divider className="w-full opacity-50 sm:mb-11" />
        <div className="w-full font-Nova ml-[30%] hidden sm:block">
          {vendorSidebarTabs.map((tab, index) => (
            <p
              key={index}
              onClick={() => router.push(tab.path)}
              className={`font-semibold pb-10 text-lg ${
                selectedValue === tab.label
                  ? "text-[#29977E]"
                  : "text-[#151827]"
              } cursor-pointer uppercase`}
            >
              {tab.icon}
              {tab.label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
export default VendorSidebar;
