import { gql } from "@apollo/client";
import client from "../apollo-client";

export const getSingleSubscriptionDetails = async (payload) => {
  const result = await client.query({
    query: gql`
      query SingleSubscription($singleSubscriptionId: String) {
        singleSubscription(id: $singleSubscriptionId) {
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
    variables: {
      singleSubscriptionId: payload.id,
    },
    fetchPolicy: "no-cache",
  });
  return result;
};

export const getAllSubscriptionPlans = async () => {
  const result = await client.query({
    query: gql`
      query GetAllSubscriptionPlans {
        getAllSubscriptionPlans {
          entity
          count
          items {
            entity
            id
            interval
            item {
              id
              active
              name
              description
              amount
              unit_amount
              currency
              type
              unit
              tax_inclusive
              hsn_code
              sac_code
              tax_rate
              tax_id
              tax_group_id
              created_at
              updated_at
            }
            period
            created_at
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
  });
  return result;
};

export const getRazorPayApiKey = async () => {
  const result = await client.query({
    query: gql`
      query Query {
        getRazorPayApiKey
      }
    `,
  });
  return result;
};

export const getSubscriptionLists = async () => {
  const results = await client.query({
    query: gql`
      query GetAllSubscriptionLists {
        getAllSubscriptionLists {
          id
          razorpay_subscription_id
          razorpay_payment_id
          razorpay_signature
          razorpay_plan_id
          userId
          shopId
        }
      }
    `,
  });

  return results;
};
