import { gql } from "@apollo/client";
import client from "../apollo-client";

export const buySubscription = async (payload) => {
  const result = await client.mutate({
    mutation: gql`
      mutation BuySubscription($planId: String) {
        buySubscription(plan_id: $planId) {
          id
          entity
          plan_id
          customer_id
          status
          current_start
          current_end
          ended_at
          quantity
          charge_at
          start_at
          end_at
          auth_attempts
          total_count
          paid_count
          customer_notify
          created_at
          expire_by
          short_url
          has_scheduled_changes
          change_scheduled_at
          source
          payment_method
          offer_id
          remaining_count
        }
      }
    `,
    fetchPolicy: "no-cache",
    variables: {
      planId: payload.planId,
    },
  });
  return result;
};

export const paymentVerification = async (payload) => {
  const result = await client.mutate({
    mutation: gql`
      mutation PaymentVerification(
        $razorpaySubscriptionId: String
        $razorpayPaymentId: String
        $razorpaySignature: String
        $razorpayPlanId: String
        $userId: String
        $shopId: String
      ) {
        paymentVerification(
          razorpay_subscription_id: $razorpaySubscriptionId
          razorpay_payment_id: $razorpayPaymentId
          razorpay_signature: $razorpaySignature
          razorpay_plan_id: $razorpayPlanId
          userId: $userId
          shopId: $shopId
        ) {
          status
          razorpay_payment_id
        }
      }
    `,

    fetchPolicy: "no-cache",
    variables: {
      razorpaySubscriptionId: payload.razorpaySubscriptionId,
      razorpayPaymentId: payload.razorpayPaymentId,
      razorpaySignature: payload.razorpaySignature,
      razorpayPlanId: payload.razorpay_plan_id,
      userId: payload.userId,
      shopId: payload.shopId,
    },
  });

  return result;
};
