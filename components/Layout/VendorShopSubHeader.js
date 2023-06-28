import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

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
    <div className="w-full font-Nova flex items-center py-4 bg-[#FAFCFC] sm:hidden">
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
          className={`px-4 font-semibold text-sm ${
            selectedValue === item ? "text-[#151827]" : "text-[#BCBDC8]"
          }  cursor-pointer uppercase`}
        >
          {item}
        </p>
      ))}
    </div>
  );
};

export default VendorShopSubHeader;
