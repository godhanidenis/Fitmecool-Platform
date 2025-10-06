import { gql } from "@apollo/client";
import client from "../apollo-client";

export const getAllPlans = async () => {
  const results = await client.query({
    query: gql`
      query GetAllPlans {
        getAllPlans {
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
    `,
    fetchPolicy: "no-cache",
  });

  return results;
};
