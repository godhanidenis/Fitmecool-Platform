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
  }, [router.pathname]);

  return (
    <div className="w-full font-Nova flex items-center py-4 pl-4 bg-[#FAFCFC] sm:hidden">
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
          className={`font-semibold sm:pb-10 text-base mr-4 ${
            selectedValue === item ? "text-[#29977E]" : "text-[#151827]"
          }  cursor-pointer uppercase`}
        >
          {item === "Dashboard" ? (
            <DashboardIcon fontSize="small" className="mr-2" />
          ) : item === "Shop" ? (
            <StoreIcon fontSize="small" className="mr-2" />
          ) : (
            <ProductionQuantityLimitsIcon fontSize="small" className="mr-2" />
          )}

          {item}
        </p>
      ))}
    </div>
  );
};

export default VendorShopSubHeader;
