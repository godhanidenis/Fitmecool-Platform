import {gql} from '@apollo/client';
import client from '../apollo-client';

export const getAllShopsList = async payload => {
  const results = await client.query({
    query: gql`
      query GetAllShops($city: String) {
        getAllShops(city: $city) {
          id
          shop_name
        }
      }
    `,
    variables: {
      city: payload.city,
    },
    fetchPolicy: 'no-cache',
  });

  return results;
};

export const getShops = async payload => {
  const results = await client.query({
    query: gql`
      query ShopList(
        $area: [String]
        $sort: String
        $pageData: paginationInput
        $stars: String
        $city: String
      ) {
        shopList(
          area: $area
          sort: $sort
          pageData: $pageData
          stars: $stars
          city: $city
        ) {
          count
          limit
          noOfPages
          data {
            id
            shop_name
            shop_logo {
              extraSmall
              small
              medium
              large
            }
            shop_cover_image {
              large
              medium
              small
            }
            shop_images {
              links {
                medium
                small
              }
            }
            shopFollowerCount
            shop_rating
            shopReviewCount
            branch_info {
              branch_address
              branch_type
            }
          }
        }
      }
    `,
    variables: {
      area: payload.area,
      sort: payload.sort,
      pageData: payload.pageData,
      stars: payload.stars,
      city: payload.city,
    },
    fetchPolicy: 'no-cache',
  });

  return results;
};

export const getShopDetails = async payload => {
  const result = await client.query({
    query: gql`
      query Shop($shopId: String) {
        shop(id: $shopId) {
          id
          shop_name
          shop_logo {
            extraSmall
            small
            medium
            large
          }
          shop_cover_image {
            large
            medium
            small
          }
          shop_video
          branch_info {
            id
            branch_address
            branch_pinCode
            branch_city
            branch_state
            manager_name
            manager_contact
            manager_email
            branch_type
          }
        }
      }
    `,
    variables: {
      shopId: payload.id,
    },
    fetchPolicy: 'no-cache',
  });
  return result;
};

export const getVendorShopDetails = async payload => {
  const result = await client.query({
    query: gql`
      query Shop($shopId: String, $forDashboard: Boolean) {
        shop(id: $shopId, forDashboard: $forDashboard) {
          id
          createdAt
          subscriptionDate
          user_id
          shop_name
          shop_time {
            close_time
            is_24Hours_open
            is_close
            open_time
            week
          }
          shop_email
          ownerInfo {
            id
            owner_firstName
            owner_lastName
            owner_email
            owner_contact
          }
          shop_logo {
            extraSmall
            small
            medium
            large
          }
          shop_cover_image {
            large
            medium
            small
          }
          shop_images {
            links {
              medium
              small
            }
          }
          shop_video
          shop_type
          shop_social_link {
            facebook
            instagram
            website
          }
          shopFollowerCount
          shopReviewCount
          productLimit
          balanceProduct
          branch_info {
            id
            shop_id
            same_as
            branch_address
            branch_pinCode
            branch_city
            branch_state
            manager_name
            manager_contact
            manager_email
            branch_type
          }
        }
      }
    `,
    variables: {
      shopId: payload.id,
      forDashboard: payload.forDashboard,
    },
    fetchPolicy: 'no-cache',
  });
  return result;
};

export const getShopReviews = async payload => {
  const results = await client.query({
    query: gql`
      query ShopReview($shopReviewId: String) {
        shopReview(id: $shopReviewId) {
          id
          shop_id
          user_id
          stars
          message
          flag
          user_name
          user_type
          createdAt
          updatedAt
        }
      }
    `,
    variables: {
      shopReviewId: payload.id,
    },
    fetchPolicy: 'no-cache',
  });

  return results;
};

export const getShopFollowers = async payload => {
  const results = await client.query({
    query: gql`
      query ShopFollower($shopFollowerId: String) {
        shopFollower(id: $shopFollowerId) {
          shop_id
          user_id
        }
      }
    `,
    variables: {
      shopFollowerId: payload.id,
    },
    fetchPolicy: 'no-cache',
  });

  return results;
};

export const getShopOwnerList = async () => {
  const results = await client.query({
    query: gql`
      query ShopOwnerList {
        shopOwnerList {
          id
          owner_contact
          owner_email
          owner_firstName
          owner_lastName
        }
      }
    `,
  });

  return results;
};

export const getShopOwnerDetail = async payload => {
  const result = await client.query({
    query: gql`
      query ShopOwner($shopOwnerId: String) {
        shopOwner(id: $shopOwnerId) {
          id
          owner_firstName
          owner_lastName
          owner_email
          owner_contact
        }
      }
    `,
    variables: {
      shopOwnerId: payload.id,
    },
    fetchPolicy: 'no-cache',
  });
  return result;
};
