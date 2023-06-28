/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import VendorSidebar from "../sections/vendor-section/VendorSidebar";
import { useDispatch, useSelector } from "react-redux";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";
import { useRouter } from "next/router";
import { useState } from "react";

const VendorCommonLayout = ({ children }) => {
  const { userProfile } = useSelector((state) => state.userProfile);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const dispatch = useDispatch();

  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    const withoutLastChunk = router.pathname.slice(
      0,
      router.pathname.lastIndexOf("/")
    );
    if (withoutLastChunk === "/vendor/shopEdit") {
      setSelectedValue("Shop");
    } else if (withoutLastChunk === "/vendor/shop") {
      setSelectedValue("Products");
    } else {
      setSelectedValue("Dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      dispatch(loadVendorShopDetailsStart(userProfile?.userCreatedShopId));
    }
  }, [dispatch, userProfile?.userCreatedShopId]);

  return (
    <>
      <div className="w-full relative font-Nova">
        <div className="flex items-center py-4 bg-[#FAFCFC] sm:hidden">
          {["Dashboard", "Shop", "Products"].map((item, index) => (
            <p
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
        <img
          src={vendorShopDetails?.shop_cover_image}
          alt="shop cover image"
          className="h-[396px] w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen gap-10 p-5 sm:px-10 font-Nova">
        <div className="w-full  md:w-[30%] relative mb-[350px] sm:mb-0">
          <div className="absolute lg:-top-36 -top-32 left-0 right-0 bottom-0">
            <VendorSidebar vendorShopDetails={vendorShopDetails} />
          </div>
        </div>
        <div className="w-full md:w-[70%] mt-12 sm:mt-0">{children}</div>
      </div>
    </>
  );
};

export default VendorCommonLayout;
