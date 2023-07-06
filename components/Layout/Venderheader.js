import React, { useState } from "react";
import { Tab } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CustomTab, a11yProps } from "../core/CustomMUIComponents";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Venderheader = () => {
  const router = useRouter();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const [value, setValue] = useState(0);

  useEffect(() => {
    const withoutLastChunk = router.pathname.slice(
      0,
      router.pathname.lastIndexOf("/")
    );

    if (router.pathname === "/vendor/dashboard") {
      setValue(0);
    } else if (withoutLastChunk === "/vendor/shopEdit") {
      setValue(1);
    } else if (
      withoutLastChunk === "/vendor/shop" ||
      `/vendor/shop/${vendorShopDetails?.id}/addEditProduct/`
    ) {
      setValue(2);
    }
  }, [router.pathname]);

  console.log("value", value);
  return (
    <div className="sm:flex hidden items-center">
      <div className="">
        <CustomTab
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          {["Dashboard", "Shop", "Products"].map((item, index) => (
            <Tab
              key={index}
              data-key={index}
              label={item.toUpperCase()}
              onClick={() => {
                item === "Dashboard" && router.push("/vendor/dashboard");
                item === "Shop" &&
                  router.push(`/vendor/shopEdit/${vendorShopDetails?.id}`);
                item === "Products" &&
                  router.push(`/vendor/shop/${vendorShopDetails?.id}`);
              }}
              {...a11yProps(value)}
            />
          ))}
        </CustomTab>
      </div>
    </div>
  );
};

export default Venderheader;
