import {gql} from '@apollo/client';
import client from '../apollo-client';

export const shopFollow = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation ShopFollower($shopInfo: shopFollowerInput) {
        shopFollower(shopInfo: $shopInfo) {
          data {
            shop_id
            user_id
          }
          message
        }
      }
    `,
    variables: {
      shopInfo: payload.shopInfo,
    },
  });
  return results;
};

export const shopReview = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation CreateShopReview($shopInfo: ShopReviewInput) {
        createShopReview(shopInfo: $shopInfo) {
          id
          shop_id
          user_id
          stars
          message
          flag
          user_name
          user_type
        }
      }
    `,
    variables: {
      shopInfo: payload.shopInfo,
    },
  });
  return results;
};

export const shopRegistration = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation CreateShop(
        $ownerInfo: shopOwnerInput
        $shopInfo: createShopInput
        $branchInfo: [branchInput]
        $userId: String
      ) {
        createShop(
          ownerInfo: $ownerInfo
          shopInfo: $shopInfo
          branchInfo: $branchInfo
          user_id: $userId
        ) {
          message
          shopInfo {
            id
          }
        }
      }
    `,
    variables: {
      ownerInfo: payload.ownerInfo,
      shopInfo: payload.shopInfo,
      branchInfo: payload.branchInfo,
      userId: payload.userId,
    },
  });
  return results;
};

export const shopUpdate = async payload => {
  const results = await client.mutate({
    mutation: gql`
      mutation UpdateShop(
        $shopInfo: updateShopInput
        $branchInfo: [updateBranchInput]
        $ownerInfo: updateShopOwnerInput
        $shopLayout: updateShopLayout
      ) {
        updateShop(
          shopInfo: $shopInfo
          branchInfo: $branchInfo
          ownerInfo: $ownerInfo
          shopLayout: $shopLayout
        ) {
          message
        }
      }
    `,
    variables: {
      ownerInfo: payload.ownerInfo,
      shopInfo: payload.shopInfo,
      branchInfo: payload.branchInfo,
      shopLayout: payload.shopLayout,
    },
  });
  return results;
};
