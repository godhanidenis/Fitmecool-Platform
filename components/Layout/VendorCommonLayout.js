/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import VendorSidebar from "../sections/vendor-section/VendorSidebar";
import { useDispatch, useSelector } from "react-redux";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";

const VendorCommonLayout = ({ children }) => {
  const { userProfile } = useSelector((state) => state.userProfile);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      dispatch(loadVendorShopDetailsStart(userProfile?.userCreatedShopId));
    }
  }, [dispatch, userProfile?.userCreatedShopId]);

  return (
    <>
      <div className="w-full relative">
        <img
          src={vendorShopDetails?.shop_cover_image}
          alt="shop cover image"
          className="h-[396px] w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen gap-10 p-5 sm:px-10">
        <div className="w-full  md:w-[30%] relative mb-[350px] sm:mb-0">
          <div className="absolute lg:-top-36 -top-32 left-0 right-0 bottom-0">
            <VendorSidebar vendorShopDetails={vendorShopDetails} />
          </div>
        </div>
        <div className="w-full md:w-[70%]">{children}</div>
      </div>
    </>
  );
};

export default VendorCommonLayout;
