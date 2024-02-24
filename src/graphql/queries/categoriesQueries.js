import { gql } from "@apollo/client";
import client from "../apollo-client";

export const getCategories = async () => {
  const results = await client.query({
    query: gql`
      query CategoryList {
        categoryList {
          id
          category_name
          category_type
          flag
        }
      }
    `,
  });

  return results;
};
