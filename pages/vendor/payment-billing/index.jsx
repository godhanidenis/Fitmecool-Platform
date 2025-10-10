"use client";
import { IconButton, Button, CircularProgress } from "@mui/material";
import { vendorPrivateGaurd } from "../../../components/core/VendorAuthGaurd";
import CustomTable from "../../../components/core/CustomTable";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadInvoiceStart,
  loadPaymentMethodsStart,
} from "../../../redux/ducks/invoices";
import { CreditCard, Smartphone } from "@mui/icons-material";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { loadSubscriptionStart } from "../../../redux/ducks/subscriptions";
import moment from "moment/moment";
import { PlanType } from "../subscription";
import {
  ChangePaymentMethod,
  VerifySubscriptionPayment,
} from "../../../graphql/mutations/subscription";
import { toast } from "react-toastify";

const PaymentCardSkeleton = () => {
  return (
    <div className="col-span-1 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4 w-full">
        {/* Icon skeleton */}
        <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse"></div>

        {/* Text skeletons */}
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

const PaymentCard = ({ method, getOption }) => {
  const dispatch = useDispatch();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const { subscriptions } = useSelector((state) => state.subscriptions);
  const [paymentMethodChangeLoading, setPaymentMethodChangeLoading] =
    useState(null);

  const isCard = method?.type === "card";
  const isUPI = method?.type === "upi";

  const handleChange = (id) => {
    setPaymentMethodChangeLoading(id);
    if (subscriptions?.length > 0) {
      const options = getOption(
        "Update Subscription Payment Method",
        setPaymentMethodChangeLoading
      );

      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      ChangePaymentMethod({ id }).then(
        (res) => {
          toast.success(res?.data?.changePaymentMethod, { theme: "colored" });
          dispatch(
            loadPaymentMethodsStart({
              customerId: vendorShopDetails.razorpay_customer_id,
            })
          );
          setPaymentMethodChangeLoading(null);
        },
        (error) => {
          toast.error(error.message, { theme: "colored" });
          setPaymentMethodChangeLoading(null);
        }
      );
    }
  };

  return (
    <div
      className={`${
        !method.is_primary && "cursor-pointer"
      } col-span-1 flex items-center justify-between rounded-2xl border p-4 shadow-sm transition relative ${
        method.is_primary
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:shadow-md"
      } 
    `}
      onClick={() => !method.is_primary && handleChange(method?._id)}
    >
      {/* Left side: Icon + details */}
      <div className="flex items-center gap-4">
        <div
          className={`${
            method.is_primary ? "bg-blue-100" : "bg-gray-100"
          } rounded-xl p-3`}
        >
          {isCard ? (
            <CreditCard
              className={`${
                method.is_primary ? "text-blue-500" : "text-gray-700"
              } h-6 w-6`}
            />
          ) : (
            <Smartphone
              className={`${
                method.is_primary ? "text-blue-500" : "text-gray-700"
              } h-6 w-6`}
            />
          )}
        </div>

        <div>
          {isCard && (
            <>
              <p
                className={`${
                  method.is_primary ? "font-semibold" : "font-medium"
                } text-sm text-gray-900`}
              >
                {method.card?.network || "Card"} **** {method.card?.last4}
              </p>
              <p
                className={`${
                  method.is_primary ? "font-semibold" : "font-medium"
                } text-xs text-gray-500`}
              >
                {method?.card?.issuer}
              </p>
            </>
          )}

          {isUPI && (
            <>
              <p
                className={`${
                  method.is_primary ? "font-semibold" : "font-medium"
                } text-sm text-gray-900`}
              >
                UPI
              </p>
              <p
                className={`${
                  method.is_primary ? "font-semibold" : "font-medium"
                } text-xs text-gray-500`}
              >
                {method?.upi?.vpa}
              </p>
            </>
          )}
        </div>
      </div>
      {paymentMethodChangeLoading === method?._id && (
        <div className="absolute top-0 left-0 h-full w-full rounded-2xl bg-[#ffffffc0] flex items-center justify-center">
          <CircularProgress style={{ color: "#29977E" }} />
        </div>
      )}
    </div>
  );
};

const PaymentBilling = () => {
  const dispatch = useDispatch();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const { invoices, invoiceLoading, paymentMethods, paymentMethodLoading } =
    useSelector((state) => state.invoices);
  const { subscriptions, subscriptionLoading } = useSelector(
    (state) => state.subscriptions
  );
  const [changePaymentMethod, setChangePaymentMethod] = useState(false);
  const [repaymentLoader, setRepaymentLoader] = useState(null);

  const runningSubscription = useMemo(
    () =>
      subscriptions?.find(
        (p) => p?.status === PlanType.ACTIVE || p?.status === PlanType.CANCEL
      ),
    [subscriptions]
  );

  const getOption = (description, setLoader) => ({
    key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
    subscription_id: runningSubscription?.razorpay_subscription_id,
    name: "FitMeCool",
    description: description,
    image: "/favicon.ico",
    subscription_card_change: 1,
    recurring: 1,
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
          setChangePaymentMethod((prev) => !prev);
          setLoader(null);
        },
        (error) => {
          toast.error(error.message, { theme: "colored" });
        }
      );
    },
    prefill: {
      name: `${vendorShopDetails?.ownerInfo?.owner_firstName} ${vendorShopDetails?.ownerInfo?.owner_lastName}`,
      email: vendorShopDetails?.ownerInfo?.owner_email,
      contact: vendorShopDetails?.ownerInfo?.owner_contact,
    },
    notes: {
      purpose: "payment_method_update",
    },
    theme: {
      color: "#29977E",
    },
    modal: {
      ondismiss: function () {
        // when modal is closed manually
        setLoader(null);
      },
    },
  });

  const handleRePayment = (data) => {
    setRepaymentLoader(data?.id);
    const options = getOption("Re-Payment", setRepaymentLoader);
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const columns = [
    {
      header: "Plan Name",
      field: "raw",
      render: (value, row) => (
        <span
          className={`font-semibold ${
            row.status === "failed" ? "text-red-500" : "text-colorGreen"
          }`}
        >
          {value?.line_items[0]?.name}
        </span>
      ),
    },
    {
      header: "Date",
      field: "invoice_date",
      render: (value, row) => (
        <span className="text-black">
          {moment(value).local().format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      header: "Status",
      field: "status",
      render: (value, row) => (
        <span
          className={`font-semibold ${
            value === "failed" ? "text-red-500" : "text-colorGreen"
          }`}
        >
          {runningSubscription?.razorpay_subscription_id !==
            row?.raw?.subscription_id && row.status === "failed"
            ? "Past Due"
            : value}
        </span>
      ),
    },
    {
      header: "Amount",
      field: "amount",
      render: (value, row) => (
        <span className="text-black">
          {value}
          {row?.raw?.currency_symbol}
        </span>
      ),
    },
    {
      header: "",
      field: "action",
      width: "70px",
      render: (_, row) => (
        <IconButton
          onClick={() => {
            window.open(row?.raw?.short_url, "_blank");
          }}
        >
          <ArrowCircleDownIcon className="text-blue-600" />
        </IconButton>
      ),
    },
    {
      header: "",
      field: "payAction",
      width: "100px",
      render: (_, row) => {
        const enable =
          row.status === "failed" &&
          runningSubscription?.razorpay_subscription_id ===
            row?.raw?.subscription_id;
        const isLoading = repaymentLoader === row?.id;
        return (
          enable && (
            <Button
              className={`${
                isLoading && "opacity-50"
              } !bg-red-500 !text-white !font-semibold !text-sm !capitalize`}
              size="small"
              onClick={() => handleRePayment(row)}
            >
              {isLoading ? "Paying." : "Pay"}
            </Button>
          )
        );
      },
    },
  ];

  useEffect(() => {
    if (vendorShopDetails?.razorpay_customer_id) {
      dispatch(
        loadInvoiceStart({
          customerId: vendorShopDetails.razorpay_customer_id,
        })
      );
      dispatch(
        loadPaymentMethodsStart({
          customerId: vendorShopDetails.razorpay_customer_id,
        })
      );
    }
  }, [dispatch, vendorShopDetails?.razorpay_customer_id, changePaymentMethod]);

  useEffect(() => {
    if (vendorShopDetails?.id) {
      dispatch(loadSubscriptionStart({ shopId: vendorShopDetails.id }));
    }
  }, [dispatch, vendorShopDetails?.id]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-colorBlack text-left font-semibold text-2xl">
          Manage Payment Options
        </h1>
        <div className="grid grid-cols-3 xl:grid-cols-5 gap-2">
          {paymentMethodLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <PaymentCardSkeleton key={idx} />
            ))
          ) : paymentMethods?.length > 0 ? (
            [...paymentMethods]
              .sort((a, b) =>
                a?.is_primary === b?.is_primary ? 0 : a?.is_primary ? -1 : 1
              )
              .map((m) => (
                <PaymentCard
                  key={m?._id + m?.type + (m?.card?.last4 || m?.upi?.vpa)}
                  method={m}
                  getOption={getOption}
                />
              ))
          ) : (
            <div className="col-span-3 xl:col-span-5 flex justify-center items-center font-semibold text-lg">
              No cards found
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-colorBlack text-left font-semibold text-2xl">
          My Billing
        </h1>
        <CustomTable
          columns={columns}
          rows={invoices}
          loading={invoiceLoading}
        />
      </div>
    </div>
  );
};

export default vendorPrivateGaurd(PaymentBilling);
