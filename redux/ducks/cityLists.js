export const LOAD_CITY_LIST_START = "LOAD_CITY_LIST_START";
export const LOAD_CITY_LIST_SUCCESS = "LOAD_CITY_LIST_SUCCESS";
export const LOAD_CITY_LIST_ERROR = "LOAD_CITY_LIST_ERROR";

export const loadCityListsStart = () => ({
  type: LOAD_CITY_LIST_START,
});

export const loadCityListsSuccess = (cities) => ({
  type: LOAD_CITY_LIST_SUCCESS,
  payload: cities,
});

export const loadCityListsError = (error) => ({
  type: LOAD_CITY_LIST_ERROR,
  payload: error,
});

const initialState = {
  cityLists: [],
  loading: false,
  error: "",
};

const cityListsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CITY_LIST_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_CITY_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        cityLists: action.payload,
      };

    case LOAD_CITY_LIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default cityListsReducer;
