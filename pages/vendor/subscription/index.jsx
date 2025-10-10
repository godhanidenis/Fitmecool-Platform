import { useState, useEffect, useMemo, useCallback } from "react";
import { vendorPrivateGaurd } from "../../../components/core/VendorAuthGaurd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getPricing } from "../../../utils/common";
import { useDispatch, useSelector } from "react-redux";
import { loadPlansStart } from "../../../redux/ducks/plans";
import { loadSubscriptionStart } from "../../../redux/ducks/subscriptions";
import {
  CancelSubscription,
  CreateSubscription,
  DowngradeSubscription,
  UpgradeSubscription,
  VerifySubscriptionPayment,
} from "../../../graphql/mutations/subscription";
import { toast } from "react-toastify";
import PaymentSuccessModal from "../../../components/Modal/PaymentSuccessModal";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CommonPlanConfirmationModal from "../../../components/Modal/CommonPlanConfirmationModal";
import { getVendorShopDetails } from "../../../graphql/queries/shopQueries";
import { updateVendorShopDetails } from "../../../redux/ducks/vendorShopDetails";

// 🧠 Enums for plan & button types
export const PlanType = {
  ACTIVE: "active",
  CREATE: "created",
  CANCEL: "cancel_at_cycle_end",
};

export const SubscriptionButtonType = {
  Downgrade: "downgrade",
  Upgrade: "upgrade",
  Cancel: "cancel",
  Create: "create",
};

const modalContent = {
  [SubscriptionButtonType?.Upgrade]: {
    title: "Upgrade Plan",
    message:
      "Are you sure you want to upgrade your plan from the current plan?",
    confirmText: "Upgrade",
    icon: ArrowUpwardIcon,
    iconColor: "#29977E",
  },
  [SubscriptionButtonType?.Cancel]: {
    title: "Cancel Plan",
    message: "Are you sure you want to cancel your current plan?",
    confirmText: "Cancel Plan",
    icon: ClearIcon,
    iconColor: "#EF4444",
  },
  [SubscriptionButtonType?.Downgrade]: {
    title: "Downgrade Plan",
    message: "Are you sure you want to downgrade your plan?",
    confirmText: "Downgrade",
    icon: ArrowDownwardIcon,
    iconColor: "#3b82f6",
  },
};

const successModalContent = {
  [SubscriptionButtonType?.Create]: {
    title: "Payment Successful",
    message: "Your payment has been processed successfully.",
  },
  [SubscriptionButtonType?.Cancel]: {
    title: "Plan Cancelled",
    message: "Your current plan has been successfully cancelled.",
    note: "Your current plan will remain active until it expires, after which the free plan will be activated.",
  },
  [SubscriptionButtonType?.Downgrade]: {
    title: "Plan Downgraded",
    message: "Your plan has been successfully downgraded to the selected plan.",
  },
  [SubscriptionButtonType?.Upgrade]: {
    title: "Plan Upgraded",
    message: "Your plan has been successfully upgraded to the new plan.",
    note: "Your current plan will remain active until it expires, after which the new selected plan will be activated.",
  },
};

// ✅ Reusable toggle component for interval selection
const IntervalToggle = ({ isMonthly, onChange, runningSubscription }) => (
  <div className="flex justify-center items-center">
    <div className="flex gap-1 items-center p-2 bg-colorGrey rounded-3xl">
      {["Monthly", "Yearly"].map((label, index) => {
        const active = isMonthly === (index === 0);
        const isRunningPeriod =
          runningSubscription?.period?.toLowerCase() === label.toLowerCase();

        return (
          <span
            key={label}
            className={`w-20 py-1 flex items-center justify-center cursor-pointer rounded-2xl font-semibold text-base border relative transition-all duration-300 ${
              active
                ? "bg-colorGreen text-white border-transparent"
                : "text-black border-[#bdbcbc]"
            }`}
            onClick={() => onChange(index === 0)}
          >
            {label}
            {/* 🔴 Red dot indicator for existing running subscription */}
            {isRunningPeriod && !active && (
              <span className="absolute -top-1 right-1 p-1.5 rounded-full bg-red-500" />
            )}
          </span>
        );
      })}
    </div>
  </div>
);

// ✅ Subscription Button - optimized logic and reduced nesting
const SubscriptionButton = ({ planDetail, isMonthly, subscriptionPlans }) => {
  // 🧠 UseMemo to avoid recalculations
  const dispatch = useDispatch();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [openSuccessModalType, setOpenSuccessModalType] = useState(null);
  const { planLoading } = useSelector((state) => state.plans);
  const { subscriptionLoading, subscriptions } = useSelector(
    (state) => state.subscriptions
  );
  const [subscriptionTypeModal, setSubscriptionTypeModal] = useState(null);
  const [successModalCloseProcess, setSuccessModalCloseProcess] =
    useState(false);

  const {
    runningSubscription,
    upcomingSubscription,
    isCancelSubscription,
    isChangeSubscription,
  } = useMemo(() => {
    const running = subscriptionPlans?.find(
      (p) => p?.status === PlanType.ACTIVE || p?.status === PlanType.CANCEL
    );
    const upcoming = subscriptionPlans?.find(
      (p) => p?.status === PlanType.CREATE
    );

    return {
      runningSubscription: running,
      upcomingSubscription: upcoming,
      isCancelSubscription:
        !!running &&
        subscriptionPlans?.length === 1 &&
        running?.status === PlanType.CANCEL,
      isChangeSubscription:
        !!running &&
        subscriptionPlans?.length > 1 &&
        running?.status === PlanType.CANCEL,
    };
  }, [subscriptionPlans]);

  const planPrice = getPricing(planDetail, isMonthly)?.[
    isMonthly ? "monthlyPrice" : "yearlyPrice"
  ];
  const subscriptionPrice = getPricing(
    runningSubscription?.plan,
    runningSubscription?.period === "monthly"
  )?.[isMonthly ? "monthlyPrice" : "yearlyPrice"];

  // 📌 Handle button click
  const handleSubscription = useCallback(
    (type) => {
      setPaymentLoading({ id: planDetail?.id, isMonthly });
      const options = (subscription_id) => ({
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        subscription_id: subscription_id,
        name: "FitMeCool",
        description: `${planDetail?.name} ${
          isMonthly ? "monthly" : "yearly"
        } plan`,
        image: "/favicon.ico",
        prefill: {
          name: `${vendorShopDetails?.ownerInfo?.owner_firstName} ${vendorShopDetails?.ownerInfo?.owner_lastName}`,
          email: vendorShopDetails?.ownerInfo?.owner_email,
          contact: vendorShopDetails?.ownerInfo?.owner_contact,
        },
        recurring: 1,
        redirect: false,
        handler: function (response) {
          VerifySubscriptionPayment({
            input: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              razorpay_subscription_id: response.razorpay_subscription_id,
              shop_id: vendorShopDetails?.id,
            },
          }).then(
            (res) => {
              setOpenSuccessModalType(SubscriptionButtonType.Create);
              setPaymentLoading(null);
            },
            (error) => {
              toast.error(error.message, { theme: "colored" });
            }
          );
        },
        notes: {
          note_key_1: "Tea. Earl Grey. Hot",
          note_key_2: "Make it so.",
        },
        theme: {
          color: "#29977E",
        },
        modal: {
          ondismiss: function () {
            // when modal is closed manually
            setPaymentLoading(null);
          },
        },
      });
      if (type === SubscriptionButtonType.Create) {
        CreateSubscription({
          subscriptionInfo: {
            customer_contact: vendorShopDetails?.ownerInfo?.owner_contact,
            customer_email: vendorShopDetails?.ownerInfo?.owner_email,
            customer_name: `${vendorShopDetails?.ownerInfo?.owner_firstName} ${vendorShopDetails?.ownerInfo?.owner_lastName}`,
            period: isMonthly ? "monthly" : "yearly",
            plan_id: planDetail?.id,
            shop_id: vendorShopDetails.id,
          },
        }).then(
          (res) => {
            var rzp1 = new window.Razorpay(
              options(res?.data?.createSubscription?.razorpay_subscription_id)
            );
            rzp1.open();
          },
          (error) => {
            toast.error(error.message, { theme: "colored" });
            setPaymentLoading(null);
          }
        );
      } else if (type === SubscriptionButtonType.Upgrade) {
        UpgradeSubscription({
          subscriptionId: runningSubscription?._id,
          targetPlanId: planDetail?.id,
          targetPeriod: isMonthly ? "monthly" : "yearly",
          shopId: vendorShopDetails.id,
        }).then(
          (res) => {
            setOpenSuccessModalType(SubscriptionButtonType.Upgrade);
            setPaymentLoading(null);
          },
          (error) => {
            toast.error(error.message, { theme: "colored" });
            setPaymentLoading(null);
          }
        );
      } else if (type === SubscriptionButtonType.Cancel) {
        CancelSubscription({
          subscriptionId: runningSubscription?._id,
        }).then(
          (res) => {
            setOpenSuccessModalType(SubscriptionButtonType.Cancel);
            setPaymentLoading(null);
          },
          (error) => {
            toast.error(error.message, { theme: "colored" });
            setPaymentLoading(null);
          }
        );
      } else {
        let payload;
        const commonPayload = {
          targetPlanId: planDetail?.id,
          targetPeriod: isMonthly ? "monthly" : "yearly",
          shopId: vendorShopDetails.id,
        };
        if (isChangeSubscription && upcomingSubscription) {
          if (planDetail?.is_free) {
            payload = {
              ...commonPayload,
              subscriptionId: upcomingSubscription?._id,
              isFree: true,
              cancelAtCycleEnd: false,
            };
          } else {
            payload = {
              ...commonPayload,
              subscriptionId: upcomingSubscription?._id,
              cancelAtCycleEnd: false,
            };
          }
        } else {
          if (planDetail?.is_free) {
            payload = {
              ...commonPayload,
              subscriptionId: runningSubscription?._id,
              isFree: true,
            };
          } else {
            payload = {
              ...commonPayload,
              subscriptionId: runningSubscription?._id,
            };
          }
        }

        DowngradeSubscription(payload).then(
          (res) => {
            setOpenSuccessModalType(SubscriptionButtonType.Downgrade);
            setPaymentLoading(null);
          },
          (error) => {
            toast.error(error.message, { theme: "colored" });
            setPaymentLoading(null);
          }
        );
      }
    },
    [
      planDetail,
      isMonthly,
      vendorShopDetails,
      runningSubscription,
      upcomingSubscription,
      isChangeSubscription,
    ]
  );

  const handleChangePlanSuccessModalClose = async () => {
    setSuccessModalCloseProcess(true);
    await getVendorShopDetails({
      id: vendorShopDetails.id,
      forDashboard: true,
    }).then(
      async (res) => {
        dispatch(updateVendorShopDetails(res?.data?.shop));
      },
      (error) => {
        console.log(
          "get error from get shop detail after subscription :>> ",
          error
        );
      }
    );
    dispatch(loadSubscriptionStart({ shopId: vendorShopDetails.id }));
    setOpenSuccessModalType(null);
    setSuccessModalCloseProcess(false);
  };

  const getButtonDetail = () => {
    // 🧠 Pre-calculate conditions once
    const isSamePlan = runningSubscription?.plan?.id === planDetail?.id;
    const isFreePlan = planDetail?.is_free;
    const isPriceHigher = subscriptionPrice > planPrice;
    const isPriceEqual = subscriptionPrice === planPrice;
    const isUpcomingSamePlan =
      upcomingSubscription?.plan?.id === planDetail?.id &&
      upcomingSubscription?.period === (isMonthly ? "monthly" : "yearly");

    // 1️⃣ FREE PLAN LOGIC
    if (isFreePlan) {
      if (isSamePlan && isPriceEqual) {
        return {
          isText: true,
          text: "Free Plan Active",
          className: "text-colorGreen",
        };
      }

      if (isPriceHigher) {
        if (isCancelSubscription && !upcomingSubscription) {
          return {
            isText: true,
            text: "Upcoming Free Plan",
            className: "text-colorGreen",
          };
        }
        return {
          buttonText: `Downgrade to ${planDetail?.name}`,
          className: "bg-[#29977d21] text-colorGreen",
          onClick: () =>
            setSubscriptionTypeModal(SubscriptionButtonType.Downgrade),
        };
      }
      return null;
    }

    // 2️⃣ CURRENT PLAN LOGIC
    if (isSamePlan) {
      if (isPriceEqual) {
        if (runningSubscription?.status === PlanType.CANCEL) {
          return {
            isText: true,
            text: "This plan will expire soon",
            className: "text-red-500",
          };
        }
        return {
          buttonText: "Cancel Subscription",
          className: "bg-[#9729290e] text-red-500",
          onClick: () =>
            setSubscriptionTypeModal(SubscriptionButtonType.Cancel),
        };
      }

      if (isPriceHigher) {
        if (isChangeSubscription && isUpcomingSamePlan) {
          return {
            isText: true,
            text: `Upcoming ${upcomingSubscription?.plan?.name} Plan`,
            className: "text-colorGreen",
          };
        }
        return {
          buttonText: `Downgrade to ${planDetail?.name}`,
          className: "bg-[#29977d21] text-colorGreen",
          onClick: () =>
            setSubscriptionTypeModal(SubscriptionButtonType.Downgrade),
        };
      }

      if (isChangeSubscription && isUpcomingSamePlan) {
        return {
          isText: true,
          text: `Upcoming ${upcomingSubscription?.plan?.name} Plan`,
          className: "text-colorGreen",
        };
      }

      // ✅ CREATE BUTTON LOGIC (Re-pick same plan if none scheduled)
      if (
        !isCancelSubscription &&
        !isChangeSubscription &&
        runningSubscription?.plan?.is_free
      ) {
        return {
          buttonText: `Choose ${planDetail?.name}`,
          className: "bg-colorGreen text-white",
          onClick: () => handleSubscription(SubscriptionButtonType.Create),
        };
      }

      return {
        buttonText: `Upgrade to ${planDetail?.name}`,
        className: "bg-colorGreen text-white",
        onClick: () => setSubscriptionTypeModal(SubscriptionButtonType.Upgrade),
      };
    }

    // Not same plan
    // 3️⃣ DIFFERENT PLAN LOGIC
    if (isPriceHigher) {
      if (isChangeSubscription && isUpcomingSamePlan) {
        return {
          isText: true,
          text: `Upcoming ${upcomingSubscription?.plan?.name} Plan`,
          className: "text-colorGreen",
        };
      }
      return {
        buttonText: `Downgrade to ${planDetail?.name}`,
        className: "bg-[#29977d21] text-colorGreen",
        onClick: () =>
          setSubscriptionTypeModal(SubscriptionButtonType.Downgrade),
      };
    }

    // ✅ CREATE BUTTON LOGIC (New plan scenario)
    if (
      !isCancelSubscription &&
      !isChangeSubscription &&
      runningSubscription?.plan?.is_free
    ) {
      return {
        buttonText: `Choose ${planDetail?.name}`,
        className: "bg-colorGreen text-white",
        onClick: () => handleSubscription(SubscriptionButtonType.Create),
      };
    }

    return {
      buttonText: `Upgrade to ${planDetail?.name}`,
      className: "bg-colorGreen text-white",
      onClick: () => setSubscriptionTypeModal(SubscriptionButtonType.Upgrade),
    };
  };

  const buttonDetail = getButtonDetail();

  return buttonDetail?.isText ? (
    <p
      className={`${
        paymentLoading?.id === planDetail?.id &&
        isMonthly === paymentLoading?.isMonthly &&
        "opacity-50"
      } ${
        buttonDetail?.className
      } flex items-center justify-center text-lg font-semibold mt-4 h-[40px]`}
    >
      {paymentLoading?.id === planDetail?.id &&
      isMonthly === paymentLoading?.isMonthly
        ? "Processing..."
        : subscriptionLoading || planLoading
        ? "Loading..."
        : buttonDetail?.text}
    </p>
  ) : (
    <>
      <button
        className={`${
          paymentLoading?.id === planDetail?.id &&
          isMonthly === paymentLoading?.isMonthly &&
          "opacity-50"
        } ${
          buttonDetail?.className
        } py-2 px-3 mt-4 w-full font-semibold rounded-md border border-transparent`}
        onClick={buttonDetail?.onClick}
      >
        {paymentLoading?.id === planDetail?.id &&
        isMonthly === paymentLoading?.isMonthly
          ? "Processing..."
          : subscriptionLoading || planLoading
          ? "Loading..."
          : buttonDetail?.buttonText}
      </button>
      {openSuccessModalType && (
        <PaymentSuccessModal
          open={!!openSuccessModalType}
          onClose={handleChangePlanSuccessModalClose}
          {...successModalContent[openSuccessModalType]}
          successModalCloseProcess={successModalCloseProcess}
        />
      )}
      {subscriptionTypeModal && (
        <CommonPlanConfirmationModal
          open={!!subscriptionTypeModal}
          onClose={() => {
            setSubscriptionTypeModal(null);
          }}
          onConfirm={() => {
            handleSubscription(subscriptionTypeModal);
            setSubscriptionTypeModal(null);
          }}
          {...modalContent[subscriptionTypeModal]}
        />
      )}
    </>
  );
};

// ✅ Cleaned Plan Card Component
const PlanCard = ({ planDetail, isMonthly, subscriptionPlans }) => {
  const runningSubscription = useMemo(
    () =>
      subscriptionPlans?.find(
        (p) => p?.status === PlanType.ACTIVE || p?.status === PlanType.CANCEL
      ),
    [subscriptionPlans]
  );

  const pricing = getPricing(planDetail, isMonthly);

  return (
    <div className="border rounded pt-6 pb-5 px-10 text-center shadow-lg relative">
      {runningSubscription?.plan?.id === planDetail?.id &&
        (runningSubscription?.plan?.is_free ||
          runningSubscription?.period ===
            (isMonthly ? "monthly" : "yearly")) && (
          <div className="absolute -top-4 left-0 w-full flex justify-center">
            <p className="px-4 py-1 rounded-3xl font-semibold text-sm text-white bg-red-500">
              Current
            </p>
          </div>
        )}

      <p className="text-3xl font-semibold text-colorBlack">
        {planDetail?.name}
      </p>

      <p
        className={`${isMonthly ? "text-lg" : "text-base"} ${
          planDetail?.is_free &&
          !isMonthly &&
          "flex items-center justify-center h-[52px] !text-xl text-colorGreen"
        } mt-4 font-semibold text-colorBlack`}
      >
        ₹{pricing?.monthlyPrice} / month
      </p>
      {!planDetail?.is_free && !isMonthly && (
        <div className="flex justify-center items-center gap-1">
          <p className="text-lg font-semibold text-colorGreen">
            ₹{pricing?.yearlyPrice} / year
          </p>
          <p className="text-xs font-semibold text-red-500 mt-0.5">
            (₹{pricing?.saving} saving)
          </p>
        </div>
      )}

      <p className="text-colorStone mt-2">{planDetail?.description}</p>

      <SubscriptionButton
        planDetail={planDetail}
        isMonthly={isMonthly}
        subscriptionPlans={subscriptionPlans}
      />

      <div className="mt-4 text-start">
        <span className="text-colorBlack">{planDetail?.name} access to:</span>
        {planDetail?.features?.map((item, index) => (
          <div className="flex items-start gap-2 mt-2" key={index}>
            <CheckCircleIcon color="secondary" />
            <span
              className="text-colorBlack"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ Main Subscription Page
const Subscription = () => {
  const dispatch = useDispatch();
  const [isMonthly, setIsMonthly] = useState(true);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  const { plans, planLoading } = useSelector((state) => state.plans);
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const { subscriptions } = useSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(loadPlansStart());
  }, [dispatch]);

  useEffect(() => {
    if (vendorShopDetails?.id) {
      dispatch(loadSubscriptionStart({ shopId: vendorShopDetails.id }));
    }
  }, [dispatch, vendorShopDetails?.id]);

  useEffect(() => {
    if (subscriptions?.length === 0) {
      const freePlans = plans
        ?.filter((plan) => plan?.is_free)
        ?.map((plan) => ({
          status: PlanType.ACTIVE,
          plan,
        }));
      setSubscriptionPlans(freePlans);
    } else {
      setSubscriptionPlans(subscriptions);
    }
  }, [subscriptions, plans]);

  const runningSubscription = useMemo(
    () =>
      subscriptionPlans?.find(
        (p) => p?.status === PlanType.ACTIVE || p?.status === PlanType.CANCEL
      ),
    [subscriptionPlans]
  );

  return (
    <div className="flex justify-center h-full">
      <div className="flex flex-col gap-5 mt-20">
        <h1 className="text-colorBlack text-center font-semibold text-2xl">
          Choose the right plan for your business
        </h1>

        <IntervalToggle
          isMonthly={isMonthly}
          onChange={setIsMonthly}
          runningSubscription={runningSubscription}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-10 mt-5">
          {plans?.map((plan) => (
            <PlanCard
              key={plan?.id}
              planDetail={plan}
              isMonthly={isMonthly}
              subscriptionPlans={subscriptionPlans}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default vendorPrivateGaurd(Subscription);
