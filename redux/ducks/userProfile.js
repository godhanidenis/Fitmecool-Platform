export const LOAD_USER_PROFILE_START = "LOAD_USER_PROFILE_START";
export const LOAD_USER_PROFILE_SUCCESS = "LOAD_USER_PROFILE_SUCCESS";
export const LOAD_USER_PROFILE_ERROR = "LOAD_USER_PROFILE_ERROR";

export const USER_LOGOUT = "USER_LOGOUT";

export const SHOP_FOLLOW_TOGGLE = "SHOP_FOLLOW_TOGGLE";

export const PRODUCT_LIKE_TOGGLE = "PRODUCT_LIKE_TOGGLE";

export const LOGIN_USER_ID = "LOGIN_USER_ID";

export const REGISTER_SHOP_ID = "REGISTER_SHOP_ID";

export const loginUserId = (userId) => ({
  type: LOGIN_USER_ID,
  payload: userId,
});

export const loadUserProfileStart = () => ({
  type: LOAD_USER_PROFILE_START,
});

export const loadUserProfileSuccess = (userId) => ({
  type: LOAD_USER_PROFILE_SUCCESS,
  payload: userId,
});

export const loadUserProfileError = (error) => ({
  type: LOAD_USER_PROFILE_ERROR,
  payload: error,
});

export const userLogout = () => ({
  type: USER_LOGOUT,
});

export const shopFollowToggle = (shopInfo) => ({
  type: SHOP_FOLLOW_TOGGLE,
  payload: shopInfo,
});

export const productLikeToggle = (productInfo) => ({
  type: PRODUCT_LIKE_TOGGLE,
  payload: productInfo,
});

export const setShopRegisterId = (id) => ({
  type: REGISTER_SHOP_ID,
  payload: id,
});

const initialState = {
  userProfile: {},
  loggedInUserId: "",
  isAuthenticate: false,
  loading: false,
  error: "",
};

const userProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USER_PROFILE_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userProfile: action.payload,
        loggedInUserId: action.payload.id,
        isAuthenticate: true,
      };

    case LOGIN_USER_ID:
      return {
        ...state,
        loggedInUserId: action.payload,
      };

    case SHOP_FOLLOW_TOGGLE:
      return {
        ...state,

        userProfile: {
          ...state.userProfile,
          ["shop_follower_list"]:
            action.payload.shopInfo.key === "follow"
              ? [
                  ...state.userProfile.shop_follower_list.concat(
                    action.payload.shopInfo.value
                  ),
                ]
              : state.userProfile.shop_follower_list.filter(
                  (shop) => shop.shop_id !== action.payload.shopInfo.value
                ),
        },
      };

    case PRODUCT_LIKE_TOGGLE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ["product_like_list"]:
            action.payload.productInfo.key === "like"
              ? [
                  ...state.userProfile.product_like_list.concat(
                    action.payload.productInfo.value
                  ),
                ]
              : state.userProfile.product_like_list.filter(
                  (product) => product.id !== action.payload.productInfo.value
                ),
        },
      };

    case REGISTER_SHOP_ID:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          ["userCreatedShopId"]: action.payload,
        },
      };

    case USER_LOGOUT:
      return {
        ...state,
        userProfile: {},
        loggedInUserId: "",
        isAuthenticate: false,
        loading: false,
        error: "",
      };

    case LOAD_USER_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userProfileReducer;
