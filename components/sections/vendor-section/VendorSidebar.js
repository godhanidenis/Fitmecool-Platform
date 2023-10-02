import React, { useEffect, useState } from "react";
import { Avatar, Divider, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import ImageLoadingSkeleton from "../../Modal/ImageLoadingSkeleton";
import { useSelector } from "react-redux";
import { vendorSidebarTabs } from "../../../constants";

const VendorSidebar = ({ forHeader, handleMobileSidebarClick }) => {
  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState("");

  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  useEffect(() => {
    const withoutLastChunk = router.pathname.slice(
      0,
      router.pathname.lastIndexOf("/")
    );

    if (router.pathname === "/vendor/dashboard") {
      setSelectedValue("Dashboard");
    } else if (router.pathname === "/vendor/shop-subscription") {
      setSelectedValue("Subscription");
    } else if (withoutLastChunk === "/vendor/shopEdit") {
      setSelectedValue("Shop");
    } else if (
      withoutLastChunk === "/vendor/shop" ||
      `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/`
    ) {
      setSelectedValue("Products");
    }
  }, [router.pathname, vendorShopDetails?.id]);

  return (
    <div
      className={`lg:p-6 p-5 sm:py-10 ${
        forHeader ? "flex" : "hidden"
      } lg:flex flex-col items-center`}
    >
      <div className="flex justify-center">
        <div className="w-[120px] h-[120px] mb-4 rounded-full">
          {vendorShopDetails?.shop_logo ? (
            <Avatar
              src={vendorShopDetails?.shop_logo}
              alt="Shop Logo"
              className="!object-cover !w-full !h-full"
            />
          ) : (
            <ImageLoadingSkeleton className="rounded-full" variant="circular" />
          )}
        </div>
      </div>
      <div className="flex flex-col items-center lg:gap-2 gap-1 w-full">
        <div className="lg:text-3xl text-[32px] font-bold text-[#151827] pb-2 whitespace-nowrap w-full text-center">
          {vendorShopDetails?.shop_name ?? <Skeleton animation="wave" />}
        </div>
        <Divider className="w-full opacity-50 " />
        <div className="w-full font-Nova pl-[15%] mt-5">
          {vendorSidebarTabs.map((tab, index) => (
            <p
              key={index}
              onClick={() => {
                forHeader && handleMobileSidebarClick();
                router.push(
                  tab.label === "Shop" || tab.label === "Products"
                    ? `${tab.path}/${vendorShopDetails?.id}`
                    : tab.path
                );
              }}
              className={`font-semibold pb-8 text-lg ${
                selectedValue === tab.label
                  ? "text-[#29977E]"
                  : "text-[#151827]"
              } cursor-pointer uppercase flex items-center gap-4`}
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
