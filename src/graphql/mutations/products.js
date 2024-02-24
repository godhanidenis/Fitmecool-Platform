import {gql} from '@apollo/client';
import client from '../apollo-client';

export const productLike = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation ProductLike($productInfo: productLikeViewInput) {
        productLike(productInfo: $productInfo) {
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

export const createProduct = async payload => {
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

export const updateProduct = async payload => {
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

export const deleteProduct = async payload => {
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

export const productWhatsappInquiry = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation ProductWhatsappInquiry($productWhatsappInquiryId: String) {
        productWhatsappInquiry(id: $productWhatsappInquiryId)
      }
    `,
    variables: {
      productWhatsappInquiryId: payload.id,
    },
    fetchPolicy: 'no-cache',
  });
  return results;
};

export const productContactInquiry = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation ProductContactInquiry($productContactInquiryId: String) {
        productContactInquiry(id: $productContactInquiryId)
      }
    `,
    variables: {
      productContactInquiryId: payload.id,
    },
    fetchPolicy: 'no-cache',
  });
  return results;
};
