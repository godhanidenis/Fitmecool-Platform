export const CHANGE_APPLIED_PRODUCTS_FILTERS =
  "CHANGE_APPLIED_PRODUCTS_FILTERS";

export const CHANGE_SORT_PRODUCTS_FILTERS = "CHANGE_SORT_PRODUCTS_FILTERS";

export const CHANGE_PRODUCTS_LAYOUT = "CHANGE_PRODUCTS_LAYOUT";

export const CHANGE_PRODUCTS_SEARCHBAR_DATA = "CHANGE_PRODUCTS_SEARCHBAR_DATA";

export const changeAppliedProductsFilters = (filter) => ({
  type: CHANGE_APPLIED_PRODUCTS_FILTERS,
  payload: filter,
});

export const changeSortProductsFilters = (sortFilter) => ({
  type: CHANGE_SORT_PRODUCTS_FILTERS,
  payload: sortFilter,
});

export const changeProductsLayout = (layout) => ({
  type: CHANGE_PRODUCTS_LAYOUT,
  payload: layout,
});

export const changeProductsSearchBarData = (searchData) => ({
  type: CHANGE_PRODUCTS_SEARCHBAR_DATA,
  payload: searchData,
});

const initialState = {
  appliedProductsFilters: {
    categoryId: {
      selectedValue: [],
    },
    productColor: {
      selectedValue: [],
    },
    shopId: {
      selectedValue: [],
    },
  },
  sortFilters: {
    sortType: { selectedValue: "new" },
  },
  productLayout: "grid",
  searchBarData: "",
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

    case CHANGE_PRODUCTS_LAYOUT:
      return {
        ...state,
        [`${action.payload.key}`]: `${action.payload.value}`,
      };

    case CHANGE_PRODUCTS_SEARCHBAR_DATA:
      return {
        ...state,
        [`${action.payload.key}`]: `${action.payload.value}`,
      };

    default:
      return state;
  }
};

export default productsFiltersReducer;
