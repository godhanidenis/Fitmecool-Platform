import { gql } from "@apollo/client";
import client from "../apollo-client";

export const getSubscriptions = async (payload) => {
  const results = await client.query({
    query: gql`
      query GetSubscriptions($shopId: ID) {
        getSubscriptions(shop_id: $shopId) {
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
      }
    `,
    variables: {
      shopId: payload.shopId,
    },
    fetchPolicy: "no-cache",
  });

  return results;
};
