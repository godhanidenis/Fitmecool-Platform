import React, { useEffect } from "react";
import VendorSidebar from "../sections/vendor-section/VendorSidebar";
import { useDispatch, useSelector } from "react-redux";
import { loadVendorShopDetailsStart } from "../../redux/ducks/vendorShopDetails";
import { getSingleSubscriptionDetails } from "../../graphql/queries/subscriptions";
import { setSubscriptionStatus } from "../../redux/ducks/userProfile";

const VendorCommonLayout = ({ children }) => {
  const { userProfile } = useSelector((state) => state.userProfile);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userProfile?.userCreatedShopId) {
      dispatch(loadVendorShopDetailsStart(userProfile?.userCreatedShopId));
    }
  }, [dispatch, userProfile?.userCreatedShopId]);

  useEffect(() => {
    if (userProfile?.subscriptionId) {
      getSingleSubscriptionDetails({ id: userProfile?.subscriptionId }).then(
        (res) =>
          dispatch(
            setSubscriptionStatus(
              res?.data?.singleSubscription?.status === "active" ? true : false
            )
          )
      );
    } else {
      dispatch(setSubscriptionStatus(false));
    }
  }, [dispatch, userProfile?.subscriptionId]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen sm:gap-10  font-Nova">
      <div className="lg:w-[300px] relative">
        <VendorSidebar />
      </div>
      <div className="w-full lg:w-[73%] sm:mt-6 px-4 py-4 sm:mr-5 sm:px-0 sm:py-0">
        {children}
      </div>
    </div>
  );
};

export default VendorCommonLayout;
