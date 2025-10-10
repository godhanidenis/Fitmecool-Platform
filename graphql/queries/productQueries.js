import { gql } from "@apollo/client";
import client from "../apollo-client";

export const getProducts = async (payload) => {
  const result = await client.query({
    query: gql`
      query ProductList(
        $search: String
        $filter: productFilterInput
        $sort: String
        $shopId: [String]
        $city: String
        $forDashboard: Boolean
        $isActive: Boolean
        $pageData: paginationInput
      ) {
        productList(
          search: $search
          filter: $filter
          sort: $sort
          shop_id: $shopId
          city: $city
          forDashboard: $forDashboard
          is_active: $isActive
          pageData: $pageData
        ) {
          data {
            id
            product_name
            product_description
            product_color
            categoryInfo {
              id
              category_name
              category_type
              flag
            }
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
            product_video
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
            productLikes
            whatsapp_inquiry
            contact_inquiry
            product_listing_type
            product_price_visible
            product_price
            product_discount
            is_active
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
      city: payload.city,
      forDashboard: payload.forDashboard,
      isActive: payload.isActive,
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
            product_video
            product_color
            is_active
            categoryInfo {
              category_name
              category_type
            }
            branchInfo {
              shop_id
              shop_info {
                shop_name
                shop_logo {
                  extraSmall
                  small
                  medium
                  large
                }
                shop_rating
                createdAt
              }
              branch_address
              manager_name
              manager_contact
            }
            productLikes
            product_listing_type
            product_price_visible
            product_price
            product_discount
          }
          related {
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
    variables: {
      productId: payload.id,
    },
    fetchPolicy: "no-cache",
  });
  return result;
};
