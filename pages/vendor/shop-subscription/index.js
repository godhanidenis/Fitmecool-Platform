import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSubscriptionPlans,
  getRazorPayApiKey,
  getSingleSubscriptionDetails,
} from "../../../graphql/queries/subscriptions";
import {
  buySubscription,
  paymentVerification,
  renewSubscription,
} from "../../../graphql/mutations/subscription";
import { loadUserProfileStart } from "../../../redux/ducks/userProfile";
import { toast } from "react-toastify";

const ShopSubscription = () => {
  const [checked, setChecked] = useState(false);

  //for deployed comment
  const [subscriptionAllPlans, setSubscriptionAllPlans] = useState({});

  const [currentPlan, setCurrentPlan] = useState();

  // const router = useRouter();
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.userProfile);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    getAllSubscriptionPlans().then((res) => {
      setSubscriptionAllPlans(res?.data?.getAllSubscriptionPlans);
    });
  }, []);

  useEffect(() => {
    if (userProfile?.subscriptionId) {
      getSingleSubscriptionDetails({ id: userProfile?.subscriptionId }).then(
        (res) => {
          console.log("res-->>>", res);
          res?.data?.singleSubscription?.status === "active" &&
            setCurrentPlan(res?.data?.singleSubscription);
        }
      );
    }
  }, [userProfile?.subscriptionId]);

  useEffect(() => {
    if (subscriptionAllPlans?.items && currentPlan?.id) {
      setCurrentPlan((prevPlan) => ({
        ...prevPlan,
        subscriptionPlan: subscriptionAllPlans?.items?.find(
          (itm) => itm?.id === currentPlan?.plan_id
        ),
      }));
    }
  }, [currentPlan?.id, currentPlan?.plan_id, subscriptionAllPlans?.items]);

  const isSubscriptionExpired = (subscriptionDueDate) => {
    const currentDate = new Date();
    const dueDate = new Date(subscriptionDueDate);

    return currentDate > dueDate;
  };

  const checkoutHandler = async (plan) => {
    await getRazorPayApiKey().then(async (keyRes) => {
      await buySubscription({ planId: plan?.id }).then((subscriptionRes) => {
        const options = {
          key: keyRes?.data?.getRazorPayApiKey,
          subscription_id: subscriptionRes?.data?.buySubscription.id,
          name: plan?.item?.name,
          description: plan?.item?.description,
          image:
            "https://media.licdn.com/dms/image/C4D0BAQGlDTkE0BPXvw/company-logo_200_200/0/1639393777775?e=2147483647&v=beta&t=pu-oXJMsAa8-EY62pFVvrRR6T4cHEWzbbmxB-xBSj8k",
          handler: async function (response) {
            await paymentVerification({
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              razorpay_plan_id: plan?.id,
              userId: userProfile?.id,
              shopId: userProfile?.userCreatedShopId,
            }).then(
              (response) => {
                dispatch(loadUserProfileStart({ id: userProfile?.id }));
                response?.data?.paymentVerification?.status === "success"
                  ? toast.success(
                      `Your Subscription Successfully!! Reference No. ${response?.data?.paymentVerification?.razorpay_payment_id}`
                    )
                  : toast.error(
                      `Your Subscription Failed!! Reference No. ${response?.data?.paymentVerification?.razorpay_payment_id}`
                    );
                // router.push(response?.data?.paymentVerification);
              },
              (err) => console.log("error: ", err)
            );
          },
          notes: {
            address: "FlyOnTech Solutions",
          },
          theme: {
            color: "#95539B",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      });
    });
  };

  const renewSubscriptionCheckoutHandler = async (plan) => {
    await getRazorPayApiKey().then(async (keyRes) => {
      await renewSubscription({
        subscriptionId: userProfile?.subscriptionId,
        newPlanId: plan?.id,
      }).then((subscriptionRes) => {
        console.log("subscriptionRes", subscriptionRes);
        const options = {
          key: keyRes?.data?.getRazorPayApiKey,
          subscription_id: subscriptionRes?.data?.renewSubscription.id,
          name: plan?.item?.name,
          description: plan?.item?.description,
          image:
            "https://media.licdn.com/dms/image/C4D0BAQGlDTkE0BPXvw/company-logo_200_200/0/1639393777775?e=2147483647&v=beta&t=pu-oXJMsAa8-EY62pFVvrRR6T4cHEWzbbmxB-xBSj8k",
          handler: async function (response) {
            await paymentVerification({
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              razorpay_plan_id: plan?.id,
              userId: userProfile?.id,
              shopId: userProfile?.userCreatedShopId,
            }).then(
              (response) => {
                dispatch(loadUserProfileStart({ id: userProfile?.id }));
                response?.data?.paymentVerification?.status === "success"
                  ? toast.success(
                      `Your Subscription Successfully!! Reference No. ${response?.data?.paymentVerification?.razorpay_payment_id}`
                    )
                  : toast.error(
                      `Your Subscription Failed!! Reference No. ${response?.data?.paymentVerification?.razorpay_payment_id}`
                    );
                // router.push(response?.data?.paymentVerification);
              },
              (err) => console.log("error: ", err)
            );
          },
          notes: {
            address: "FlyOnTech Solutions",
          },
          theme: {
            color: "#95539B",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      });
    });
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[95vh]">
        <div className="bg-white rounded p-10">
          <h1 className="text-colorBlack text-center font-semibold text-2xl shadow-2xl">
            Choose your plan
          </h1>
          <p className="text-center text-colorStone mt-3">
            You will be charged for the plan after the admin approves your
            vendor account
          </p>
          <div className="mt-5">
            <SubscriptionPlanActions switchHandler={switchHandler} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-10 gap-5">
            {(!checked
              ? subscriptionAllPlans?.items?.filter(
                  (itm) => itm.period === "weekly"
                )
              : subscriptionAllPlans?.items?.filter(
                  (itm) => itm.period === "monthly"
                )
            )?.map((plan, index) => (
              <div
                key={index}
                className="border rounded py-8 px-10 text-center cursor-pointer hover:scale-110"
              >
                <p className="text-xl font-medium text-colorBlack">
                  {plan?.item?.name}
                </p>
                <p className="mt-4 text-gray-500">
                  <span className="text-lg font-semibold text-colorBlack">
                    ₹{plan?.item?.amount / 100}
                  </span>{" "}
                  /{" "}
                  {(plan?.period === "weekly" && "week") ||
                    (plan?.period === "monthly" && "month")}
                </p>
                {userProfile?.subscriptionStatus &&
                currentPlan?.plan_id === plan?.id ? (
                  <div className="mt-4">
                    {isSubscriptionExpired(currentPlan?.current_end * 1000) ? (
                      <button
                        className="border border-colorPrimary text-colorPrimary py-2 px-3 mt-4 rounded-md"
                        onClick={() => renewSubscriptionCheckoutHandler(plan)}
                      >
                        Renew Plan
                      </button>
                    ) : (
                      <>
                        <b>Current Plan</b>
                        <p>
                          Renews{" "}
                          {new Date(
                            currentPlan?.current_end * 1000
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    className={`${
                      currentPlan?.subscriptionPlan?.item?.amount / 100 >
                        plan?.item?.amount / 100 &&
                      "border border-colorPrimary text-colorPrimary"
                    } ${
                      (currentPlan?.subscriptionPlan?.item?.amount / 100 <
                        plan?.item?.amount / 100 ||
                        !currentPlan) &&
                      "bg-colorPrimary text-white"
                    } py-2 px-3 mt-4 rounded-md`}
                    onClick={() => checkoutHandler(plan)}
                  >
                    {userProfile?.subscriptionStatus &&
                      currentPlan?.subscriptionPlan?.item?.amount / 100 >
                        plan?.item?.amount / 100 &&
                      "Downgrade"}
                    {userProfile?.subscriptionStatus &&
                      currentPlan?.subscriptionPlan?.item?.amount / 100 <
                        plan?.item?.amount / 100 &&
                      "Upgrade"}

                    {!userProfile?.subscriptionStatus &&
                      !currentPlan &&
                      "Choose"}
                  </button>
                )}
                <p className="mt-4">
                  <b>10</b> products
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSubscription;

const SubscriptionPlanActions = ({ switchHandler }) => {
  return (
    <>
      <div className="flex justify-end gap-1 p-2 items-center">
        <div className="flex items-center gap-2">
          <label className="inline-flex border cursor-pointer dark:bg-white-300 dark:text-white-800">
            <input
              id="Toggle4"
              type="checkbox"
              className="hidden peer"
              onChange={switchHandler}
            />
            <span className="px-4 py-1 bg-colorPrimary peer-checked:text-black peer-checked:bg-white text-white">
              Weekly
            </span>
            <span className="px-4 py-1 dark:bg-white-300 peer-checked:bg-colorPrimary peer-checked:text-white ">
              Monthly
            </span>
          </label>
        </div>
      </div>
    </>
  );
};
