import React from "react";
import { useRouter } from "next/router";

const PaymentSuccess = () => {
  const router = useRouter();

  const { reference } = router.query;

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="bg-white rounded p-10">
        <h1 className="text-colorBlack text-center font-semibold text-2xl">
          Your Subscription Successfully!!
        </h1>
        <p className="text-colorBlack text-center mt-3">
          Reference No. <b>{reference}</b>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
