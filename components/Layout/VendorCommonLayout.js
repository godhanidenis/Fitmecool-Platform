import React, { useEffect } from "react";
import VendorSidebar from "../sections/vendor-section/VendorSidebar";
import { useDispatch, useSelector } from "react-redux";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";
import VendorShopSubHeader from "./VendorShopSubHeader";

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
      <div className="w-full relative font-Nova">
        <VendorShopSubHeader />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen sm:gap-10  font-Nova">
        <div className="sm:w-[360px] w-full relative">
          <div className="">
            <VendorSidebar vendorShopDetails={vendorShopDetails} />
          </div>
        </div>
        <div className="w-full lg:w-[71%] sm:w-[60%] sm:mt-6 sm:mr-5">
          {children}
        </div>
      </div>
    </>
  );
};

export default VendorCommonLayout;
