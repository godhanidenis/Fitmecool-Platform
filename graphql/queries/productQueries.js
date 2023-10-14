import { gql } from "@apollo/client";
import client from "../apollo-client";

export const getProducts = async (payload) => {
  const result = await client.query({
    query: gql`
      query ProductList(
        $pageData: paginationInput!
        $search: String
        $filter: productFilterInput
        $sort: String
        $shopId: [String]
      ) {
        productList(
          pageData: $pageData
          search: $search
          filter: $filter
          sort: $sort
          shop_id: $shopId
        ) {
          data {
            id
            product_name
            product_description
            product_image {
              front
              back
              side
            }
            product_video
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
                shop_logo
                shop_cover_image
                shop_images {
                  links
                }
                shop_video
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
                shop_name
                shop_time {
                  close_time
                  is_24Hours_open
                  is_close
                  open_time
                  week
                }
                shop_rating
                shop_review {
                  id
                  shop_id
                  user_id
                  stars
                  message
                  flag
                }
                shop_type
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
            product_color
            whatsapp_inquiry
            contact_inquiry
            product_listing_type
            product_price_visible
            product_price
            product_discount
          }
          count
          limit
          noOfPages
        }
      }
    `,
    variables: {
      search: payload.search,
      pageData: payload.pageData,
      filter: payload.filter,
      shopId: payload.shopId,
      sort: payload.sort,
      search: payload.search,
    },
    fetchPolicy: "no-cache",
  });

  return result;
};

export const getProductDetails = async (payload) => {
  const result = await client.query({
    query: gql`
      query Product($productId: String) {
        product(id: $productId) {
          data {
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
            product_type
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
            whatsapp_inquiry
            contact_inquiry
            product_listing_type
            product_price_visible
            product_price
            product_discount
          }
          related {
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
            whatsapp_inquiry
            contact_inquiry
            product_listing_type
            product_price_visible
            product_price
            product_discount
          }
        }
      }
    `,
    variables: {
      productId: payload.id,
    },
    fetchPolicy: "no-cache",
  });
  return result;
};
