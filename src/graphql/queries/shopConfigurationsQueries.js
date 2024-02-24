import {gql} from '@apollo/client';
import client from '../apollo-client';

export const getShopConfigurations = async () => {
  const results = await client.query({
    query: gql`
      query ShopConfigurations {
        shopConfigurations {
          id
          individual_days_limit
          individual_product_limit
          shop_days_limit
          shop_product_limit
        }
      }
    `,
  });

  return results;
};
