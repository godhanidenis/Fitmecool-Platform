export const CHANGE_APPLIED_SHOPS_FILTERS = "CHANGE_APPLIED_SHOPS_FILTERS";

export const CHANGE_SORT_SHOPS_FILTERS = "CHANGE_SORT_SHOPS_FILTERS";

export const CHANGE_BY_SHOP_FILTERS = "CHANGE_BY_SHOP_FILTERS";

export const changeAppliedShopsFilters = (filter) => ({
  type: CHANGE_APPLIED_SHOPS_FILTERS,
  payload: filter,
});

export const changeSortShopsFilters = (sortFilter) => ({
  type: CHANGE_SORT_SHOPS_FILTERS,
  payload: sortFilter,
});

export const changeByShopFilters = (byShop) => ({
  type: CHANGE_BY_SHOP_FILTERS,
  payload: byShop,
});

const initialState = {
  appliedShopsFilters: {
    locations: {
      selectedValue: [],
    },
    stars: {
      selectedValue: "",
    },
  },
  sortFilters: {
    sortType: { selectedValue: "new" },
  },
  byShop: false,
};

const shopsFiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_APPLIED_SHOPS_FILTERS:
      return {
        ...state,
        appliedShopsFilters: {
          ...state.appliedShopsFilters,
          [`${action.payload.key}`]: {
            ...action?.payload.value,
          },
        },
      };

    case CHANGE_SORT_SHOPS_FILTERS:
      return {
        ...state,
        sortFilters: {
          ...state.sortFilters,
          [`${action.payload.key}`]: action.payload.value,
        },
      };

    case CHANGE_BY_SHOP_FILTERS:
      return {
        ...state,
        byShop: action.payload,
      };

    default:
      return state;
  }
};

export default shopsFiltersReducer;
