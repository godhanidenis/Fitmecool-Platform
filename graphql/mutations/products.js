import { gql } from "@apollo/client";
import client from "../apollo-client";

export const productLike = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation ProductLike($productInfo: productLikeViewInput) {
        productLike(productInfo: $productInfo) {
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
          message
        }
      }
    `,
    variables: {
      productInfo: payload.productInfo,
    },
  });
  return results;
};

export const createProduct = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation CreateProduct($productInfo: createProductInput) {
        createProduct(productInfo: $productInfo) {
          message
        }
      }
    `,
    variables: {
      productInfo: payload.productInfo,
    },
  });
  return results;
};

export const updateProduct = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation UpdateProduct(
        $updateProductId: String
        $productInfo: updateProductInput
      ) {
        updateProduct(id: $updateProductId, productInfo: $productInfo) {
          message
        }
      }
    `,
    variables: {
      productInfo: payload.productInfo,
      updateProductId: payload.id,
    },
  });
  return results;
};

export const deleteProduct = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation DeleteProduct($deleteProductId: String) {
        deleteProduct(id: $deleteProductId)
      }
    `,
    variables: {
      deleteProductId: payload.id,
    },
  });
  return results;
};

export const productWhatsappInquiry = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation ProductWhatsappInquiry($productWhatsappInquiryId: String) {
        productWhatsappInquiry(id: $productWhatsappInquiryId)
      }
    `,
    variables: {
      productWhatsappInquiryId: payload.id,
    },
    fetchPolicy: "no-cache",
  });
  return results;
};

export const productContactInquiry = async (payload) => {
  const results = await client.mutate({
    mutation: gql`
      mutation ProductContactInquiry($productContactInquiryId: String) {
        productContactInquiry(id: $productContactInquiryId)
      }
    `,
    variables: {
      productContactInquiryId: payload.id,
    },
    fetchPolicy: "no-cache",
  });
  return results;
};
