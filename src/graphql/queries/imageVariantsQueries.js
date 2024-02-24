import {gql} from '@apollo/client';
import client from '../apollo-client';

export const getImagesVariants = async () => {
  const results = await client.query({
    query: gql`
      query ImageVariants {
        imageVariants {
          id
          product_image_variants {
            small
            medium
            large
          }
          shop_logo_variants {
            extraSmall
            small
            medium
            large
          }
          shop_cover_variants {
            small
            medium
            large
          }
          shop_image_variants {
            small
            medium
          }
        }
      }
    `,
  });

  return results;
};
