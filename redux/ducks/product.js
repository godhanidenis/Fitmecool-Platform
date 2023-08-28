export const LOAD_PRODUCT_START = "LOAD_PRODUCT_START";
export const LOAD_PRODUCT_SUCCESS = "LOAD_PRODUCT_SUCCESS";
export const LOAD_PRODUCT_ERROR = "LOAD_PRODUCT_ERROR";

export const loadProductsStart = (product) => ({
  type: LOAD_PRODUCT_START,
  payload: product,
});

export const loadProductsSuccess = (products) => ({
  type: LOAD_PRODUCT_SUCCESS,
  payload: products,
});

export const loadProductsError = (error) => ({
  type: LOAD_PRODUCT_ERROR,
  payload: error,
});

const initialState = {
  productsLimit: 0,
  productsCount: 0,
  numOfPages: 0,
  productsData: [],
  loading: false,
  error: "",
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PRODUCT_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        productsLimit: action.payload.limit,
        productsCount: action.payload.count,
        numOfPages: action.payload.noOfPages,
        productsData: action.payload.data,
      };

    case LOAD_PRODUCT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default productsReducer;
