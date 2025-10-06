import { gql } from "@apollo/client";
import client from "../apollo-client";

export const getAllInvoice = async (payload) => {
  const results = await client.query({
    query: gql`
      query GetAllInvoice($customerId: String!) {
        getAllInvoice(customer_id: $customerId) {
          id
          razorpay_invoice_id
          amount
          currency
          status
          invoice_date
          createdAt
          updatedAt
          raw
        }
      }
    `,
    variables: {
      customerId: payload.customerId,
    },
    fetchPolicy: "no-cache",
  });

  return results;
};

export const getPaymentMethods = async (payload) => {
  const results = await client.query({
    query: gql`
      query GetPaymentMethods($customerId: ID!) {
        getPaymentMethods(customer_id: $customerId) {
          _id
          razorpay_customer_id
          razorpay_method_id
          type
          card
          upi
          is_primary
          createdAt
          updatedAt
        }
      }
    `,
    variables: {
      customerId: payload.customerId,
    },
    fetchPolicy: "no-cache",
  });

  return results;
};
