import { gql } from "@apollo/client";
import client from "../apollo-client";

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
          shop_review_list {
            id
            shop_id
            user_id
            stars
            message
            flag
          }
          product_like_list {
            id
            product_name
            product_description
            product_image {
              front
              back
              side
            }
            product_video
            product_color
            categoryInfo {
              id
              category_name
              category_type
              flag
            }
            branchInfo {
              id
              shop_id
              shop_info {
                id
                user_id
                shop_name
                shop_time {
                  close_time
                  is_24Hours_open
                  is_close
                  open_time
                  week
                }
                shop_logo
                shop_cover_image
                shop_images {
                  links
                }
                shop_video
                shop_type
                is_live
                flag
                form_steps
                shop_social_link {
                  facebook
                  instagram
                  website
                }
                shopFollowerCount
                shopReviewCount
                shop_review {
                  id
                  shop_id
                  user_id
                  stars
                  message
                  flag
                }
                shop_rating
              }
              branch_address
              branch_pinCode
              manager_name
              manager_contact
              manager_email
              branch_type
              flag
            }
            flag
            productLikes
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
  });
  return result;
};
