export const LOAD_SHOP_START = "LOAD_SHOP_START";
export const LOAD_SHOP_SUCCESS = "LOAD_SHOP_SUCCESS";
export const LOAD_SHOP_ERROR = "LOAD_SHOP_ERROR";

export const LOAD_ALL_SHOP_START = "LOAD_ALL_SHOP_START";
export const LOAD_All_SHOP_SUCCESS = "LOAD_All_SHOP_SUCCESS";
export const LOAD_ALL_SHOP_ERROR = "LOAD_ALL_SHOP_ERROR";

export const CHANGE_SHOP_PAGE = "CHANGE_SHOP_PAGE";

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

export const loadAllShopsListsStart = (filter) => ({
  type: LOAD_ALL_SHOP_START,
  payload: filter,
});

export const loadAllShopsListsSuccess = (shops) => ({
  type: LOAD_All_SHOP_SUCCESS,
  payload: shops,
});

export const loadAllShopsListsError = (error) => ({
  type: LOAD_ALL_SHOP_ERROR,
  payload: error,
});

export const changeShopPage = (pageSkip) => ({
  type: CHANGE_SHOP_PAGE,
  payload: pageSkip,
});

const initialState = {
  shopsLimit: 0,
  shopsCount: 0,
  numOfPages: 0,
  shopPageSkip: 0,
  shopsData: [],
  loading: false,
  error: "",

  allShopsLists: {
    data: [],
    loading: false,
    error: "",
  },
};

const shopsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SHOP_START:
      return {
        ...state,
        loading: true,
      };
    case LOAD_ALL_SHOP_START:
      return {
        ...state,
        allShopsLists: {
          ...state.allShopsLists,
          loading: true,
        },
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

    case LOAD_All_SHOP_SUCCESS:
      return {
        ...state,
        allShopsLists: {
          ...state.allShopsLists,
          loading: false,
          data: action.payload,
        },
      };

    case LOAD_SHOP_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case LOAD_ALL_SHOP_ERROR:
      return {
        ...state,
        allShopsLists: {
          ...state.allShopsLists,
          loading: false,
          error: action.payload,
        },
      };

    case CHANGE_SHOP_PAGE:
      return {
        ...state,
        shopPageSkip: action.payload,
      };

    default:
      return state;
  }
};

export default shopsReducer;
