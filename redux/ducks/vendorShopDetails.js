export const LOAD_VENDOR_SHOP_DETAILS_START = "LOAD_VENDOR_SHOP_DETAILS_START";
export const LOAD_VENDOR_SHOP_DETAILS_SUCCESS =
  "LOAD_VENDOR_SHOP_DETAILS_SUCCESS";
export const LOAD_VENDOR_SHOP_DETAILS_ERROR = "LOAD_VENDOR_SHOP_DETAILS_ERROR";

export const loadVendorShopDetailsStart = (shopId) => ({
  type: LOAD_VENDOR_SHOP_DETAILS_START,
  payload: shopId,
});

export const loadVendorShopDetailsSuccess = (shopDetails) => ({
  type: LOAD_VENDOR_SHOP_DETAILS_SUCCESS,
  payload: shopDetails,
});

export const loadVendorShopDetailsError = (error) => ({
  type: LOAD_VENDOR_SHOP_DETAILS_ERROR,
  payload: error,
});

const initialState = {
  vendorShopDetails: {},
  loading: false,
  error: "",
};

const vendorShopDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_VENDOR_SHOP_DETAILS_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_VENDOR_SHOP_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        vendorShopDetails: action.payload,
      };

    case LOAD_VENDOR_SHOP_DETAILS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default vendorShopDetailsReducer;
