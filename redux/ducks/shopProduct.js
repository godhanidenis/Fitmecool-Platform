export const LOAD_SHOP_PRODUCT_START = "LOAD_SHOP_PRODUCT_START";
export const LOAD_SHOP_PRODUCT_SUCCESS = "LOAD_SHOP_PRODUCT_SUCCESS";
export const LOAD_SHOP_PRODUCT_ERROR = "LOAD_SHOP_PRODUCT_ERROR";

export const CHANGE_SHOP_PRODUCT_PAGE = "CHANGE_SHOP_PRODUCT_PAGE";

export const loadShopProductsStart = (product) => ({
  type: LOAD_SHOP_PRODUCT_START,
  payload: product,
});

export const loadShopProductsSuccess = (products) => ({
  type: LOAD_SHOP_PRODUCT_SUCCESS,
  payload: products,
});

export const loadShopProductsError = (error) => ({
  type: LOAD_SHOP_PRODUCT_ERROR,
  payload: error,
});

export const changeShopProductPage = (pageSkip) => ({
  type: CHANGE_SHOP_PRODUCT_PAGE,
  payload: pageSkip,
});

const initialState = {
  productsLimit: 0,
  productsCount: 0,
  numOfPages: 0,
  productPageSkip: 0,
  productsData: [],
  loading: false,
  error: "",
};

const shopProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SHOP_PRODUCT_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_SHOP_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        productsLimit: action.payload.limit,
        productsCount: action.payload.count,
        numOfPages: action.payload.noOfPages,
        productsData: action.payload.data,
      };

    case LOAD_SHOP_PRODUCT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CHANGE_SHOP_PRODUCT_PAGE:
      return {
        ...state,
        productPageSkip: action.payload,
      };

    default:
      return state;
  }
};

export default shopProductsReducer;
