import React, { useState, useEffect, useCallback, useMemo } from "react";
import { vendorPrivateGaurd } from "../../../components/core/VendorAuthGaurd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import moment from "moment/moment";

const ShopSubscription = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="">
        <h1 className="text-colorBlack text-center font-semibold text-2xl">
          Choose the right plan for your business
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-10">
          <FreePlanCard />
          <CustomPlanCard />
        </div>
      </div>
    </div>
  );
};

export default vendorPrivateGaurd(ShopSubscription);

const FreePlanCard = () => {
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [productLimit, setProductLimit] = useState(0);
  const [expiredDate, setExpiredDate] = useState("");

  const { shopConfigurationsData } = useSelector(
    (state) => state.shopConfigurations
  );

  const FreeTrailProduct =
    vendorShopDetails && vendorShopDetails?.shop_type === "individual"
      ? shopConfigurationsData[0]?.individual_product_limit
      : shopConfigurationsData[0]?.shop_product_limit;

  const FreeTrailDay =
    vendorShopDetails && vendorShopDetails?.shop_type === "individual"
      ? shopConfigurationsData[0]?.individual_days_limit
      : shopConfigurationsData[0]?.shop_days_limit;

  const shopCreatedDate = useMemo(
    () => new Date(Number(vendorShopDetails?.createdAt)),
    [vendorShopDetails?.createdAt]
  );

  const futureDate = new Date(shopCreatedDate);
  futureDate.setDate(shopCreatedDate.getDate() + FreeTrailDay);
  const formattedFutureDate = moment(futureDate).format("DD-MM-YYYY");

  const FreeTrialHandler = useCallback(() => {
    const currentDate = new Date();

    let threshold = new Date();
    threshold.setDate(threshold.getDate() - FreeTrailDay);

    if (vendorShopDetails?.subscriptionDate) {
      setExpiredDate(false);
    } else {
      vendorShopDetails?.createdAt &&
        setExpiredDate(
          shopCreatedDate >= threshold && shopCreatedDate <= currentDate
        );
    }
  }, [vendorShopDetails, shopCreatedDate, setExpiredDate, FreeTrailDay]);

  useEffect(() => {
    FreeTrialHandler();
  }, [vendorShopDetails, FreeTrialHandler]);

  useEffect(() => {
    FreeTrailProduct && setProductLimit(FreeTrailProduct);
  }, [FreeTrailProduct]);

  return (
    <div className="border rounded py-4 px-10 text-center cursor-pointer shadow-lg">
      <p className="text-3xl font-semibold text-colorBlack">Free</p>

      <p className="mt-4 text-lg font-semibold text-colorBlack">₹0 / Year</p>
      <p className="text-colorStone mt-2">
        Free access to upload products limits may apply
      </p>

      <div className="flex flex-col gap-0 mt-4">
        {expiredDate === true ? (
          <span className="text-[#29977E] font-semibold py-2 px-3">
            Free Trail is expired on {formattedFutureDate}
          </span>
        ) : expiredDate === false ? (
          <span className="text-red-600 font-semibold py-2 px-3">
            Free trail has been expired.
          </span>
        ) : (
          expiredDate === "" && (
            <span className="text-black font-medium py-2 px-3">loading...</span>
          )
        )}
      </div>

      <div className="text-start">
        <br />
        <span className="text-colorBlack">Free access to:</span>
        <div className="flex items-center gap-2 mt-2">
          <CheckCircleIcon color="secondary" />
          <span className="text-colorBlack">
            <span className="text-colorGreen font-extrabold">
              {productLimit}
            </span>{" "}
            Products Upload
          </span>
        </div>
        {[
          "Limited Product Analysis",
          "Max 3 updates allowed per product",
          "AI based Auto Product title, description not supported",
          "24/7 Support",
        ].map((item, index) => (
          <div className="flex items-center gap-2 mt-2" key={index}>
            <CheckCircleIcon color="secondary" />
            <span className="text-colorBlack">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomPlanCard = () => {
  const router = useRouter();
  return (
    <div className="border rounded py-4 px-10 text-center cursor-pointer shadow-lg">
      <p className="text-3xl font-semibold text-colorBlack">Enterprise</p>

      <p className="mt-4 text-lg font-semibold text-colorBlack">Custom</p>
      <p className="text-colorStone mt-2">
        Custom contract & additional features Volume-based discounting available
      </p>

      <button
        className="bg-colorGreen text-white py-2 px-3 mt-4 w-full rounded-md"
        onClick={() => router.push("/vendor/contact")}
      >
        Contact Sales
      </button>

      <div className="mt-4 text-start">
        <span className="text-colorBlack">Custom access to:</span>
        {[
          "More Advanced Product Upload",
          "More Advanced Product Analysis",
          "Unlimited updates allowed per product",
          "AI based Auto Product title, description supported",
          "24/7 Support",
        ].map((item, index) => (
          <div className="flex items-center gap-2 mt-2" key={index}>
            <CheckCircleIcon color="secondary" />
            <span className="text-colorBlack">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
