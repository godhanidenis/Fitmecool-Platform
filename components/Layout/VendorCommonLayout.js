/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import VendorSidebar from "../sections/vendor-section/VendorSidebar";
import { useDispatch, useSelector } from "react-redux";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";
import { useRouter } from "next/router";

const VendorCommonLayout = ({ children }) => {
  const { userProfile } = useSelector((state) => state.userProfile);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      dispatch(loadVendorShopDetailsStart(userProfile?.userCreatedShopId));
    }
  }, [dispatch, userProfile?.userCreatedShopId]);

  return (
    <div className="grid grid-cols-12">
      <div className="hidden lg:block lg:col-span-2">
        <VendorSidebar vendorShopDetails={vendorShopDetails} />
      </div>

      <div className="col-span-12 lg:col-span-10">
        {router.pathname !== "/vendor/shop-subscription" && (
          <div className="w-full">
            <img
              src={vendorShopDetails?.shop_cover_image}
              alt="shop cover image"
              className="h-[222px] w-full"
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default VendorCommonLayout;
