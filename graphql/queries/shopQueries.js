import { gql } from "@apollo/client";
import client from "../apollo-client";

export const getAllShopsList = async () => {
  const results = await client.query({
    query: gql`
      query GetAllShops {
        getAllShops {
          id
          shop_name
        }
      }
    `,
  });

  return results;
};

export const getShops = async (payload) => {
  const results = await client.query({
    query: gql`
      query ShopList(
        $area: [String]
        $sort: String
        $pageData: paginationInput
        $stars: String
      ) {
        shopList(area: $area, sort: $sort, pageData: $pageData, stars: $stars) {
          count
          limit
          noOfPages
          data {
            id
            user_id
            owner_id
            shop_name
            shop_time {
              close_time
              is_24Hours_open
              is_close
              open_time
              week
            }
            shop_email
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
            branch_info {
              id
              shop_id
              branch_address
              branch_pinCode
              manager_name
              manager_contact
              manager_email
              branch_type
              flag
              shop_info {
                shop_name
                shop_time {
                  close_time
                  is_24Hours_open
                  is_close
                  open_time
                  week
                }
              }
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
    },
    fetchPolicy: "no-cache",
  });

  return results;
};

export const getShopDetails = async (payload) => {
  const result = await client.query({
    query: gql`
      query Shop($shopId: String) {
        shop(id: $shopId) {
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
          shop_email
          owner_id
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
            user_name
            user_type
          }
          shop_rating
          branch_info {
            id
            shop_id

            branch_address
            branch_pinCode
            branch_city
            manager_name
            manager_contact
            manager_email
            branch_type
            flag
            product_info {
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

              flag
              productLikes
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
                    user_name
                    user_type
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
            }
          }
        }
      }
    `,
    variables: {
      shopId: payload.id,
    },
    fetchPolicy: "no-cache",
  });
  return result;
};

export const getShopReviews = async (payload) => {
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
    fetchPolicy: "no-cache",
  });

  return results;
};

export const getShopFollowers = async (payload) => {
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
    fetchPolicy: "no-cache",
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

export const getShopOwnerDetail = async (payload) => {
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
    fetchPolicy: "no-cache",
  });
  return result;
};
