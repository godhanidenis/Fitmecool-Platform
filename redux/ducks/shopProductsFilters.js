export const CHANGE_APPLIED_SHOP_PRODUCTS_FILTERS =
  "CHANGE_APPLIED_SHOP_PRODUCTS_FILTERS";

export const CHANGE_SORT_SHOP_PRODUCTS_FILTERS =
  "CHANGE_SORT_SHOP_PRODUCTS_FILTERS";

export const changeAppliedShopProductsFilters = (filter) => ({
  type: CHANGE_APPLIED_SHOP_PRODUCTS_FILTERS,
  payload: filter,
});

export const changeSortShopProductsFilters = (sortFilter) => ({
  type: CHANGE_SORT_SHOP_PRODUCTS_FILTERS,
  payload: sortFilter,
});

const initialState = {
  appliedShopProductsFilters: {
    categoryId: {
      selectedValue: [],
    },
    productColor: {
      selectedValue: [],
    },
    productPrice: {
      selectedValue: {
        min: 0,
        max: 0,
      },
    },
    productListingType: {
      selectedValue: "",
    },
    shopId: {
      selectedValue: [],
    },
    searchBarData: {
      selectedValue: "",
    },
  },
  shopSortFilters: {
    sortType: { selectedValue: "" },
  },
};

const shopProductsFiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_APPLIED_SHOP_PRODUCTS_FILTERS:
      return {
        ...state,
        appliedShopProductsFilters: {
          ...state.appliedShopProductsFilters,
          [`${action.payload.key}`]: {
            ...action?.payload.value,
          },
        },
      };

    case CHANGE_SORT_SHOP_PRODUCTS_FILTERS:
      return {
        ...state,
        shopSortFilters: {
          ...state.shopSortFilters,
          [`${action.payload.key}`]: action.payload.value,
        },
      };

    default:
      return state;
  }
};

export default shopProductsFiltersReducer;
