import {gql} from '@apollo/client';
import client from '../apollo-client';

export const getUserProfile = async () => {
  const result = await client.mutate({
    mutation: gql`
      mutation User {
        user {
          id
          first_name
          last_name
          user_email
          user_contact
          user_password
          user_type
          flag
          userHaveAnyShop
          userCreatedShopId
          shop_follower_list {
            shop_id
            user_id
          }
          product_like_list {
            id
            product_name
            product_image {
              back {
                large
                medium
                small
              }
              front {
                small
                medium
                large
              }
              side {
                small
                medium
                large
              }
            }
            branchInfo {
              id
              shop_id
              shop_info {
                shop_logo {
                  extraSmall
                  small
                  medium
                  large
                }
                shop_name
              }
            }
            product_listing_type
            product_price_visible
            product_price
            product_discount
          }
        }
      }
    `,
    fetchPolicy: 'no-cache',
  });
  return result;
};
