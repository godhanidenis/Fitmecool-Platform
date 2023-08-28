export const CHANGE_APPLIED_SHOPS_FILTERS = "CHANGE_APPLIED_SHOPS_FILTERS";

export const CHANGE_SORT_SHOPS_FILTERS = "CHANGE_SORT_SHOPS_FILTERS";

export const changeAppliedShopsFilters = (filter) => ({
  type: CHANGE_APPLIED_SHOPS_FILTERS,
  payload: filter,
});

export const changeSortShopsFilters = (sortFilter) => ({
  type: CHANGE_SORT_SHOPS_FILTERS,
  payload: sortFilter,
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

    default:
      return state;
  }
};

export default shopsFiltersReducer;
