export const LOAD_AREA_LIST_START = "LOAD_AREA_LIST_START";
export const LOAD_AREA_LIST_SUCCESS = "LOAD_AREA_LIST_SUCCESS";
export const LOAD_AREA_LIST_ERROR = "LOAD_AREA_LIST_ERROR";

export const loadAreaListsStart = (filter) => ({
  type: LOAD_AREA_LIST_START,
  payload: filter,
});

export const loadAreaListsSuccess = (areas) => ({
  type: LOAD_AREA_LIST_SUCCESS,
  payload: areas,
});

export const loadAreaListsError = (error) => ({
  type: LOAD_AREA_LIST_ERROR,
  payload: error,
});

const initialState = {
  areaLists: [],
  loading: false,
  error: "",
};

const areaListsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_AREA_LIST_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_AREA_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        areaLists: action.payload,
      };

    case LOAD_AREA_LIST_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default areaListsReducer;
