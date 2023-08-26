import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

const VendorShopSubHeader = () => {
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

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

  const vendorSubHeaderTabs = [
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
    <div className="w-full font-Nova flex items-center py-4 pl-4 bg-[#FAFCFC] sm:hidden">
      {vendorSubHeaderTabs.map((tab, index) => (
        <p
          key={index}
          onClick={() => router.push(tab.path)}
          className={`font-semibold sm:pb-10 text-base mr-4 ${
            selectedValue === tab.label ? "text-[#29977E]" : "text-[#151827]"
          }  cursor-pointer uppercase`}
        >
          {tab.icon}
          {tab.label}
        </p>
      ))}
    </div>
  );
};

export default VendorShopSubHeader;
