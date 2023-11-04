export const LOAD_SHOP_CONFIGURATION_START = "LOAD_SHOP_CONFIGURATION_START";
export const LOAD_SHOP_CONFIGURATION_SUCCESS =
  "LOAD_SHOP_CONFIGURATION_SUCCESS";
export const LOAD_SHOP_CONFIGURATION_ERROR = "LOAD_SHOP_CONFIGURATION_ERROR";

export const loadShopConfigurationsStart = () => ({
  type: LOAD_SHOP_CONFIGURATION_START,
});

export const loadShopConfigurationsSuccess = (data) => ({
  type: LOAD_SHOP_CONFIGURATION_SUCCESS,
  payload: data,
});

export const loadShopConfigurationsError = (error) => ({
  type: LOAD_SHOP_CONFIGURATION_ERROR,
  payload: error,
});

const initialState = {
  shopConfigurationsData: [],
  loading: false,
  error: "",
};

const shopConfigurationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SHOP_CONFIGURATION_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_SHOP_CONFIGURATION_SUCCESS:
      return {
        ...state,
        loading: false,
        shopConfigurationsData: action.payload,
      };

    case LOAD_SHOP_CONFIGURATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default shopConfigurationsReducer;
