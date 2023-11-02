// import React, { useState, useEffect } from "react";
// // import { useRouter } from "next/router";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllSubscriptionPlans,
//   getRazorPayApiKey,
//   getSingleSubscriptionDetails,
// } from "../../../graphql/queries/subscriptions";
// import {
//   buySubscription,
//   paymentVerification,
//   renewSubscription,
// } from "../../../graphql/mutations/subscription";
// import { loadUserProfileStart } from "../../../redux/ducks/userProfile";
// import { toast } from "react-toastify";
// import { withAuth } from "../../../components/core/PrivateRouteForVendor";
// import { assets } from "../../../constants";
// import { CircularProgress } from "@mui/material";

// const ShopSubscription = () => {
//   const [checked, setChecked] = useState(false);
//   const [isHydrated, setIsHydrated] = useState(false);

//   const [subscriptionAllPlans, setSubscriptionAllPlans] = useState({});
//   const [loading, setLoading] = useState(false);

//   const [currentPlan, setCurrentPlan] = useState();

//   // const router = useRouter();
//   const dispatch = useDispatch();

//   const { userProfile } = useSelector((state) => state.userProfile);

//   const switchHandler = (event) => {
//     setChecked(event.target.checked);
//   };

//   useEffect(() => {
//     setLoading(true);
//     getAllSubscriptionPlans().then(
//       (res) => {
//         setLoading(false);
//         setSubscriptionAllPlans(res?.data?.getAllSubscriptionPlans);
//       },
//       (error) => setLoading(false)
//     );
//   }, []);

//   useEffect(() => {
//     if (userProfile?.subscriptionId) {
//       getSingleSubscriptionDetails({ id: userProfile?.subscriptionId }).then(
//         (res) => {
//           console.log("res-->>>", res);
//           res?.data?.singleSubscription?.status === "active" &&
//             setCurrentPlan(res?.data?.singleSubscription);
//         }
//       );
//     }
//   }, [userProfile?.subscriptionId]);

//   useEffect(() => {
//     if (subscriptionAllPlans?.items && currentPlan?.id) {
//       setCurrentPlan((prevPlan) => ({
//         ...prevPlan,
//         subscriptionPlan: subscriptionAllPlans?.items?.find(
//           (itm) => itm?.id === currentPlan?.plan_id
//         ),
//       }));
//     }
//   }, [currentPlan?.id, currentPlan?.plan_id, subscriptionAllPlans?.items]);

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   const isSubscriptionExpired = (subscriptionDueDate) => {
//     const currentDate = new Date();
//     const dueDate = new Date(subscriptionDueDate);

//     return currentDate > dueDate;
//   };

//   const checkoutHandler = async (plan) => {
//     await getRazorPayApiKey().then(async (keyRes) => {
//       await buySubscription({ planId: plan?.id }).then((subscriptionRes) => {
//         const options = {
//           key: keyRes?.data?.getRazorPayApiKey,
//           subscription_id: subscriptionRes?.data?.buySubscription.id,
//           name: plan?.item?.name,
//           description: plan?.item?.description,
//           image: assets.appBlackLogo,
//           handler: async function (response) {
//             await paymentVerification({
//               razorpaySubscriptionId: response.razorpay_subscription_id,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature,
//               razorpay_plan_id: plan?.id,
//               userId: userProfile?.id,
//               shopId: userProfile?.userCreatedShopId,
//             }).then(
//               (response) => {
//                 dispatch(loadUserProfileStart({ id: userProfile?.id }));
//                 response?.data?.paymentVerification?.status === "success"
//                   ? toast.success(
//                       `Your Subscription Successfully!! Reference No. ${response?.data?.paymentVerification?.razorpay_payment_id}`
//                     )
//                   : toast.error(
//                       `Your Subscription Failed!! Reference No. ${response?.data?.paymentVerification?.razorpay_payment_id}`
//                     );
//                 // router.push(response?.data?.paymentVerification);
//               },
//               (err) => console.log("error: ", err)
//             );
//           },
//           notes: {
//             address: "Rentbless",
//           },
//           theme: {
//             color: "#151827",
//           },
//         };

//         const razor = new window.Razorpay(options);
//         razor.open();
//       });
//     });
//   };

//   const renewSubscriptionCheckoutHandler = async (plan) => {
//     await getRazorPayApiKey().then(async (keyRes) => {
//       await renewSubscription({
//         subscriptionId: userProfile?.subscriptionId,
//         newPlanId: plan?.id,
//       }).then((subscriptionRes) => {
//         console.log("subscriptionRes", subscriptionRes);
//         const options = {
//           key: keyRes?.data?.getRazorPayApiKey,
//           subscription_id: subscriptionRes?.data?.renewSubscription.id,
//           name: plan?.item?.name,
//           description: plan?.item?.description,
//           image:
//             "https://media.licdn.com/dms/image/C4D0BAQGlDTkE0BPXvw/company-logo_200_200/0/1639393777775?e=2147483647&v=beta&t=pu-oXJMsAa8-EY62pFVvrRR6T4cHEWzbbmxB-xBSj8k",
//           handler: async function (response) {
//             await paymentVerification({
//               razorpaySubscriptionId: response.razorpay_subscription_id,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature,
//               razorpay_plan_id: plan?.id,
//               userId: userProfile?.id,
//               shopId: userProfile?.userCreatedShopId,
//             }).then(
//               (response) => {
//                 dispatch(loadUserProfileStart({ id: userProfile?.id }));
//                 response?.data?.paymentVerification?.status === "success"
//                   ? toast.success(
//                       `Your Subscription Successfully!! Reference No. ${response?.data?.paymentVerification?.razorpay_payment_id}`
//                     )
//                   : toast.error(
//                       `Your Subscription Failed!! Reference No. ${response?.data?.paymentVerification?.razorpay_payment_id}`
//                     );
//                 // router.push(response?.data?.paymentVerification);
//               },
//               (err) => console.log("error: ", err)
//             );
//           },
//           notes: {
//             address: "FlyOnTech Solutions",
//           },
//           theme: {
//             color: "#95539B",
//           },
//         };

//         const razor = new window.Razorpay(options);
//         razor.open();
//       });
//     });
//   };

//   if (!isHydrated) {
//     return null;
//   }

//   return (
//     <>
//       <div className="flex items-center justify-center min-h-[95vh]">
//         <div className="bg-white rounded p-10">
//           <h1 className="text-colorBlack text-center font-semibold text-2xl">
//             Choose your plan
//           </h1>
//           <p className="text-center text-colorStone mt-3">
//             You will be charged for the plan after the admin approves your
//             vendor account
//           </p>

//           <SubscriptionPlanActions switchHandler={switchHandler} />

//           {loading ? (
//             <div className="flex items-center justify-center pt-10 pb-5">
//               <CircularProgress color="secondary" />
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 mt-10 gap-5">
//               {subscriptionAllPlans?.items
//                 ?.filter(
//                   (itm) => itm.period === (checked ? "monthly" : "weekly")
//                 )
//                 ?.map((plan, index) => (
//                   <div
//                     key={index}
//                     className="border rounded py-8 px-10 text-center cursor-pointer shadow-lg"
//                   >
//                     <p className="text-xl font-medium text-colorBlack">
//                       {plan?.item?.name}
//                     </p>
//                     <p className="mt-4 text-gray-500">
//                       <span className="text-lg font-semibold text-colorBlack">
//                         ₹{plan?.item?.amount / 100}
//                       </span>{" "}
//                       /{" "}
//                       {(plan?.period === "weekly" && "week") ||
//                         (plan?.period === "monthly" && "month")}
//                     </p>
//                     {userProfile?.subscriptionStatus &&
//                     currentPlan?.plan_id === plan?.id ? (
//                       <div className="mt-4">
//                         {isSubscriptionExpired(
//                           currentPlan?.current_end * 1000
//                         ) ? (
//                           <button
//                             className="border border-colorPrimary text-colorPrimary py-2 px-3 mt-4 rounded-md"
//                             onClick={() =>
//                               renewSubscriptionCheckoutHandler(plan)
//                             }
//                           >
//                             Renew Plan
//                           </button>
//                         ) : (
//                           <>
//                             <b>Current Plan</b>
//                             <p>
//                               Renews{" "}
//                               {new Date(
//                                 currentPlan?.current_end * 1000
//                               ).toLocaleDateString("en-US", {
//                                 month: "short",
//                                 day: "numeric",
//                                 year: "numeric",
//                               })}
//                             </p>
//                           </>
//                         )}
//                       </div>
//                     ) : (
//                       <button
//                         className={`${
//                           currentPlan?.subscriptionPlan?.item?.amount / 100 >
//                             plan?.item?.amount / 100 &&
//                           "border border-colorPrimary text-colorPrimary"
//                         } ${
//                           (currentPlan?.subscriptionPlan?.item?.amount / 100 <
//                             plan?.item?.amount / 100 ||
//                             !currentPlan) &&
//                           "bg-colorPrimary text-white"
//                         } py-2 px-3 mt-4 rounded-md`}
//                         onClick={() => checkoutHandler(plan)}
//                       >
//                         {userProfile?.subscriptionStatus &&
//                           currentPlan?.subscriptionPlan?.item?.amount / 100 >
//                             plan?.item?.amount / 100 &&
//                           "Downgrade"}
//                         {userProfile?.subscriptionStatus &&
//                           currentPlan?.subscriptionPlan?.item?.amount / 100 <
//                             plan?.item?.amount / 100 &&
//                           "Upgrade"}

//                         {!userProfile?.subscriptionStatus &&
//                           !currentPlan &&
//                           "Choose"}
//                       </button>
//                     )}
//                     <p className="mt-4">
//                       <b>10</b> products
//                     </p>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default withAuth(ShopSubscription);

// const SubscriptionPlanActions = ({ switchHandler }) => {
//   return (
//     <>
//       <div className="flex justify-end items-center mt-5">
//         <div className="flex items-center">
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               className="hidden peer"
//               onChange={switchHandler}
//             />
//             <span className="px-4 py-1 bg-colorPrimary peer-checked:text-black peer-checked:bg-colorGrey text-white duration-700">
//               Weekly
//             </span>
//             <span className="px-4 py-1 peer-checked:bg-colorPrimary bg-colorGrey peer-checked:text-white text-black duration-700">
//               Monthly
//             </span>
//           </label>
//         </div>
//       </div>
//     </>
//   );
// };

import React, { useState, useEffect } from "react";
import { withAuth } from "../../../components/core/PrivateRouteForVendor";
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
    <div className="flex items-center justify-center min-h-[90vh]">
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

export default withAuth(ShopSubscription);

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

  const shopCreatedDate = new Date(Number(vendorShopDetails?.createdAt));

  const futureDate = new Date(shopCreatedDate);
  futureDate.setDate(shopCreatedDate.getDate() + FreeTrailDay);
  const formattedFutureDate = moment(futureDate).format("DD-MM-YYYY");

  const FreeTrialHandler = () => {
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
  };

  useEffect(() => {
    FreeTrialHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorShopDetails]);

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
