export const CHANGE_APPLIED_CITY_FILTERS = "CHANGE_APPLIED_CITY_FILTERS";

export const changeAppliedCityFilters = (filter) => ({
  type: CHANGE_APPLIED_CITY_FILTERS,
  payload: filter,
});

const initialState = {
  appliedCityFilter: {
    city: {
      selectedValue: "",
    },
  },
};

const cityFiltersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_APPLIED_CITY_FILTERS:
      return {
        ...state,
        appliedCityFilter: {
          ...state.appliedCityFilter,
          [`${action.payload.key}`]: {
            ...action?.payload.value,
          },
        },
      };

    default:
      return state;
  }
};

export default cityFiltersReducer;
