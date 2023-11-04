export const CHANGE_APPLIED_PRODUCTS_FILTERS =
  "CHANGE_APPLIED_PRODUCTS_FILTERS";

export const CHANGE_SORT_PRODUCTS_FILTERS = "CHANGE_SORT_PRODUCTS_FILTERS";

export const changeAppliedProductsFilters = (filter) => ({
  type: CHANGE_APPLIED_PRODUCTS_FILTERS,
  payload: filter,
});

export const changeSortProductsFilters = (sortFilter) => ({
  type: CHANGE_SORT_PRODUCTS_FILTERS,
  payload: sortFilter,
});

const initialState = {
  appliedProductsFilters: {
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
  sortFilters: {
    sortType: { selectedValue: "" },
  },
};

const productsFiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_APPLIED_PRODUCTS_FILTERS:
      return {
        ...state,
        appliedProductsFilters: {
          ...state.appliedProductsFilters,
          [`${action.payload.key}`]: {
            ...action?.payload.value,
          },
        },
      };

    case CHANGE_SORT_PRODUCTS_FILTERS:
      return {
        ...state,
        sortFilters: {
          ...state.sortFilters,
          [`${action.payload.key}`]: action.payload.value,
        },
      };

    default:
      return state;
  }
};

export default productsFiltersReducer;
