import { gql } from "@apollo/client";
import client from "../apollo-client";

const SubscriptionFragment = gql`
  fragment SubscriptionFields on Subscription {
    _id
    razorpay_plan_id
    razorpay_subscription_id
    period
    status
    start_date
    end_date
    next_charge_at
    ended_at
    shop_id
    createdAt
    updatedAt
    plan {
      id
      name
      price
      currency
      period
      is_free
      product_limit
      yearly_discount_percent
      razorpay_monthly_plan_id
      razorpay_yearly_plan_id
      description
      features
      createdAt
      updatedAt
    }
  }
`;

export const CreateSubscription = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation CreateSubscription($subscriptionInfo: subscriptionInput) {
        createSubscription(subscriptionInfo: $subscriptionInfo) {
          ...SubscriptionFields
        }
      }
      ${SubscriptionFragment}
    `,
    variables: {
      subscriptionInfo: payload.subscriptionInfo,
    },
  });
  return results;
};

export const UpgradeSubscription = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation UpgradeSubscription(
        $subscriptionId: ID!
        $targetPlanId: ID!
        $targetPeriod: String!
        $shopId: ID!
      ) {
        upgradeSubscription(
          subscription_id: $subscriptionId
          target_plan_id: $targetPlanId
          target_period: $targetPeriod
          shop_id: $shopId
        ) {
          ...SubscriptionFields
        }
      }
      ${SubscriptionFragment}
    `,
    variables: payload,
  });
  return results;
};

export const DowngradeSubscription = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation DowngradeSubscription(
        $subscriptionId: ID
        $targetPlanId: ID
        $targetPeriod: String
        $isFree: Boolean
        $shopId: ID
        $cancelAtCycleEnd: Boolean
      ) {
        downgradeSubscription(
          subscription_id: $subscriptionId
          target_plan_id: $targetPlanId
          target_period: $targetPeriod
          is_free: $isFree
          shop_id: $shopId
          cancelAtCycleEnd: $cancelAtCycleEnd
        )
      }
    `,
    variables: payload,
  });
  return results;
};

export const CancelSubscription = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation CancelSubscription($subscriptionId: ID!) {
        cancelSubscription(subscription_id: $subscriptionId)
      }
    `,
    variables: {
      subscriptionId: payload.subscriptionId,
    },
  });
  return results;
};

export const VerifySubscriptionPayment = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation VerifySubscriptionPayment(
        $input: VerifySubscriptionPaymentInput!
      ) {
        verifySubscriptionPayment(input: $input)
      }
    `,
    variables: {
      input: payload.input,
    },
  });
  return results;
};

export const ChangePaymentMethod = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation ChangePaymentMethod($changePaymentMethodId: ID!) {
        changePaymentMethod(id: $changePaymentMethodId)
      }
    `,
    variables: {
      changePaymentMethodId: payload.id,
    },
  });
  return results;
};
