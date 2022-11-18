export const LOAD_SHOP_START = "LOAD_SHOP_START";
export const LOAD_SHOP_SUCCESS = "LOAD_SHOP_SUCCESS";
export const LOAD_SHOP_ERROR = "LOAD_SHOP_ERROR";

export const LOAD_MORE_SHOP_START = "LOAD_MORE_SHOP_START";
export const LOAD_MORE_SHOP_SUCCESS = "LOAD_MORE_SHOP_SUCCESS";
export const LOAD_MORE_SHOP_ERROR = "LOAD_MORE_SHOP_ERROR";

export const loadShopsStart = (shop) => ({
  type: LOAD_SHOP_START,
  payload: shop,
});

export const loadShopsSuccess = (shops) => ({
  type: LOAD_SHOP_SUCCESS,
  payload: shops,
});

export const loadShopsError = (error) => ({
  type: LOAD_SHOP_ERROR,
  payload: error,
});

export const loadMoreShopsStart = (shop) => ({
  type: LOAD_MORE_SHOP_START,
  payload: shop,
});

export const loadMoreShopsSuccess = (shops) => ({
  type: LOAD_MORE_SHOP_SUCCESS,
  payload: shops,
});

export const loadMoreShopsError = (error) => ({
  type: LOAD_MORE_SHOP_ERROR,
  payload: error,
});

const initialState = {
  shopsLimit: 0,
  shopsCount: 0,
  numOfPages: 0,
  shopsData: [],
  loading: false,
  error: "",
};

const shopsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SHOP_START:
    case LOAD_MORE_SHOP_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_SHOP_SUCCESS:
      return {
        ...state,
        loading: false,
        shopsLimit: action.payload.limit,
        shopsCount: action.payload.count,
        numOfPages: action.payload.noOfPages,
        shopsData: action.payload.data,
      };

    case LOAD_MORE_SHOP_SUCCESS:
      const tempShop = [...state.shopsData, ...action.payload.data];

      return {
        ...state,
        loading: false,
        shopsLimit: action.payload.limit,
        shopsCount: action.payload.count,
        numOfPages: action.payload.noOfPages,
        shopsData: tempShop,
      };

    case LOAD_SHOP_ERROR:
    case LOAD_MORE_SHOP_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default shopsReducer;
