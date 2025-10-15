"use client";
import { IconButton, Button, CircularProgress, Alert } from "@mui/material";
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
import AddIcon from "@mui/icons-material/Add";
import {
  ChangePaymentMethod,
  VerifySubscriptionPayment,
} from "../../../graphql/mutations/subscription";
import { toast } from "react-toastify";
import PaymentSuccessModal from "../../../components/Modal/PaymentSuccessModal";
import ScrollContainer from "react-indiana-drag-scroll";
import CommonConfirmationModal from "../../../components/Modal/CommonConfirmationModal";

const successModalContent = {
  change: {
    title: "Payment Method Updated",
    message:
      "Your payment method has been successfully updated for future transactions.",
  },
  repayment: {
    title: "Payment Successful",
    message: "Your pending payment has been processed successfully.",
    note: "Your current plan will remain active until it expires, after which the free plan will be activated.",
  },
};

const PaymentCardSkeleton = () => {
  return (
    <div className="col-span-1 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-200 animate-pulse" />
          {/* Icon skeleton */}
          <div className="h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
        </div>

        {/* Text skeletons */}
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const PaymentCard = ({
  method,
  getOption,
  selectedPaymentCard,
  setSelectedPaymentCard,
  paymentMethodChangeLoading,
  setPaymentMethodChangeLoading,
}) => {
  const dispatch = useDispatch();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const { subscriptions } = useSelector((state) => state.subscriptions);

  const isCard = method?.type === "card";
  const isUPI = method?.type === "upi";

  const handleChange = (id) => {
    setSelectedPaymentCard(id);
    setPaymentMethodChangeLoading(id);
    if (subscriptions?.length > 0) {
      const options = getOption(
        "Update Subscription Payment Method",
        setPaymentMethodChangeLoading,
        "change"
      );

      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      ChangePaymentMethod({ id }).then(
        (res) => {
          toast.success(res?.data?.changePaymentMethod, { theme: "colored" });
          setPaymentMethodChangeLoading(null);
          dispatch(
            loadPaymentMethodsStart({
              customerId: vendorShopDetails.razorpay_customer_id,
            })
          );
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
      className={`snap-start col-span-1 flex items-center justify-between rounded-2xl border p-4 shadow-sm transition relative ${
        selectedPaymentCard === method?._id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:shadow-md"
      } 
    `}
    >
      {/* Left side: Icon + details */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`${
              !method.is_primary && "cursor-pointer"
            } p-1 rounded-full border-2 ${
              selectedPaymentCard === method?._id
                ? "border-blue-500"
                : "border-gray-300"
            }  flex items-center justify-center`}
            onClick={() =>
              (!method.is_primary || !paymentMethodChangeLoading) &&
              handleChange(method?._id)
            }
          >
            <span
              className={`block w-2.5 h-2.5 ${
                selectedPaymentCard === method?._id ? "bg-blue-500" : "bg-white"
              } rounded-full`}
            ></span>
          </div>
          <div
            className={`${
              selectedPaymentCard === method?._id
                ? "bg-blue-100"
                : "bg-gray-100"
            } rounded-xl p-3`}
          >
            {isCard ? (
              <CreditCard
                className={`${
                  selectedPaymentCard === method?._id
                    ? "text-blue-500"
                    : "text-gray-700"
                } h-6 w-6`}
              />
            ) : (
              <Smartphone
                className={`${
                  selectedPaymentCard === method?._id
                    ? "text-blue-500"
                    : "text-gray-700"
                } h-6 w-6`}
              />
            )}
          </div>
        </div>

        <div>
          {isCard && (
            <>
              <p
                className={`${
                  selectedPaymentCard === method?._id
                    ? "font-semibold"
                    : "font-medium"
                } text-sm text-gray-900`}
              >
                {method.card?.network || "Card"} **** {method.card?.last4}
              </p>
              <p
                className={`${
                  selectedPaymentCard === method?._id
                    ? "font-semibold"
                    : "font-medium"
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
                  selectedPaymentCard === method?._id
                    ? "font-semibold"
                    : "font-medium"
                } text-sm text-gray-900`}
              >
                UPI
              </p>
              <p
                className={`${
                  selectedPaymentCard === method?._id
                    ? "font-semibold"
                    : "font-medium"
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

const ScrollSection = ({ children }) => {
  return (
    <ScrollContainer
      className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] sm:auto-cols-[minmax(320px,350px)] gap-4 overflow-x-auto light-scroll pb-2"
      vertical={false}
      hideScrollbars={false}
    >
      {children}
    </ScrollContainer>
  );
};

const PaymentBilling = () => {
  const dispatch = useDispatch();
  const { vendorShopDetails } = useSelector((state) => state.vendorShopDetails);
  const { invoices, invoiceLoading, paymentMethods, paymentMethodLoading } =
    useSelector((state) => state.invoices);
  const [openSuccessModalType, setOpenSuccessModalType] = useState(null);
  const { subscriptions, subscriptionLoading } = useSelector(
    (state) => state.subscriptions
  );
  const [changePaymentMethod, setChangePaymentMethod] = useState(false);
  const [repaymentLoader, setRepaymentLoader] = useState(null);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [selectedPaymentCard, setSelectedPaymentCard] = useState(null);
  const [paymentMethodChangeLoading, setPaymentMethodChangeLoading] =
    useState(null);
  const [addPaymentMethod, setAddPaymentMethod] = useState(false);
  const [addingNewPaymentMethods, setAddingNewPaymentMethods] = useState(null);

  const primaryPaymentMethod = useMemo(
    () => paymentMethods?.find((method) => method?.is_primary),
    [paymentMethods]
  );

  const runningSubscription = useMemo(
    () =>
      subscriptions?.find(
        (p) => p?.status === PlanType.ACTIVE || p?.status === PlanType.CANCEL
      ),
    [subscriptions]
  );

  const getOption = (description, setLoader, type) => ({
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
          setOpenSuccessModalType(type);
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
        type === "change" && setSelectedPaymentCard(primaryPaymentMethod?._id);
      },
    },
  });

  const handleRePayment = (data) => {
    setRepaymentLoader(data?.id);
    const options = getOption("Re-Payment", setRepaymentLoader, "repayment");
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

  const sortByPrimaryRange = (list, range = 5) => {
    // Find index of primary
    const primaryIndex = list.findIndex((item) => item.is_primary);

    if (primaryIndex === -1) return list; // No primary found

    // Calculate range start and end (keeping inside bounds)
    const halfRange = Math.floor(range / 2);
    const start = Math.max(0, primaryIndex - halfRange);
    const end = Math.min(list.length, primaryIndex + halfRange + 1);

    // Extract focused range and remaining items
    const focusedItems = list.slice(start, end);
    const remainingItems = [...list.slice(0, start), ...list.slice(end)];

    // Return sorted list — focused items first
    return [...focusedItems, ...remainingItems];
  };

  const sortedPaymentMethods = useMemo(
    () => sortByPrimaryRange(paymentMethods, 5),
    [paymentMethods]
  );

  const handleChangePaymentMethod = () => {
    if (subscriptions?.length > 0) {
      setAddingNewPaymentMethods(true);
      const options = getOption(
        "Update Subscription Payment Method",
        setAddingNewPaymentMethods,
        "change"
      );
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      setAddPaymentMethod(true);
    }
  };

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

  useEffect(() => {
    if (!invoices || !runningSubscription) return;

    const hasFailedPayment = invoices.some(
      (row) =>
        row.status === "failed" &&
        row?.raw?.subscription_id ===
          runningSubscription?.razorpay_subscription_id
    );

    setShowPaymentAlert(hasFailedPayment);
  }, [invoices, runningSubscription]);

  useEffect(() => {
    if (primaryPaymentMethod) {
      setSelectedPaymentCard(primaryPaymentMethod?._id);
    } else {
      setSelectedPaymentCard(null);
    }
  }, [primaryPaymentMethod, paymentMethods]);

  return (
    <>
      {showPaymentAlert && (
        <Alert severity={"error"} className="mb-4">
          Your subscription payment{" "}
          <span className="font-semibold">Failed.</span> Please change your{" "}
          <span className="font-semibold">Payment method</span> or use the{" "}
          <span className="font-semibold">Pay</span> button below to complete
          the payment and continue your plan.
        </Alert>
      )}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-between items-center">
            <h1 className="text-colorBlack text-left font-semibold text-2xl">
              Manage Payment Options
            </h1>
            <button
              disabled={addingNewPaymentMethods || paymentMethodLoading}
              className={`${
                (addingNewPaymentMethods || paymentMethodLoading) &&
                "opacity-50"
              } flex justify-center items-center gap-1 p-2 w-[100px] rounded-lg bg-colorGreen text-white font-semibold`}
              onClick={handleChangePaymentMethod}
            >
              {addingNewPaymentMethods ? (
                <CircularProgress
                  style={{
                    color: "#fff",
                  }}
                  size={20}
                />
              ) : (
                <AddIcon sx={{ fontSize: "22px" }} />
              )}
              Add
            </button>
          </div>
          {/* <div className="flex snap-x snap-mandatory overflow-x-auto gap-2"> */}

          {paymentMethodLoading ? (
            <ScrollSection>
              {Array.from({ length: 4 }).map((_, idx) => (
                <PaymentCardSkeleton key={idx} />
              ))}
            </ScrollSection>
          ) : sortedPaymentMethods?.length > 0 ? (
            <ScrollSection>
              {sortedPaymentMethods.map((m) => (
                <PaymentCard
                  key={m?._id + m?.type + (m?.card?.last4 || m?.upi?.vpa)}
                  method={m}
                  getOption={getOption}
                  selectedPaymentCard={selectedPaymentCard}
                  setSelectedPaymentCard={setSelectedPaymentCard}
                  paymentMethodChangeLoading={paymentMethodChangeLoading}
                  setPaymentMethodChangeLoading={setPaymentMethodChangeLoading}
                />
              ))}
            </ScrollSection>
          ) : (
            <div className="flex justify-center items-center font-semibold text-lg w-full">
              No cards found
            </div>
          )}
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
      {openSuccessModalType && (
        <PaymentSuccessModal
          open={!!openSuccessModalType}
          onClose={() => setOpenSuccessModalType(null)}
          {...successModalContent[openSuccessModalType]}
        />
      )}
      {addPaymentMethod && (
        <CommonConfirmationModal
          open={addPaymentMethod}
          onConfirm={() => setAddPaymentMethod(false)}
          confirmText="Okay"
          isCancelable={false}
          title="Can’t Change Now"
          message="You are currently on a free plan. You can change your payment method only after upgrading to a paid plan."
          iconColor="#f08a0a"
        />
      )}
    </>
  );
};

export default vendorPrivateGaurd(PaymentBilling);
