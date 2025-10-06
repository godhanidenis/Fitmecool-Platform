export const LOAD_PLANS_START = "LOAD_PLANS_START";
export const LOAD_PLANS_SUCCESS = "LOAD_PLANS_SUCCESS";
export const LOAD_PLANS_ERROR = "LOAD_PLANS_ERROR";

export const loadPlansStart = () => ({
  type: LOAD_PLANS_START,
});

export const loadPlansSuccess = (plans) => ({
  type: LOAD_PLANS_SUCCESS,
  payload: plans,
});

export const loadPlansError = (error) => ({
  type: LOAD_PLANS_ERROR,
  payload: error,
});

const initialState = {
  plans: [],
  planLoading: false,
  error: "",
};

const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PLANS_START:
      return {
        ...state,
        planLoading: true,
      };

    case LOAD_PLANS_SUCCESS:
      return {
        ...state,
        planLoading: false,
        plans: action.payload,
      };

    case LOAD_PLANS_ERROR:
      return {
        ...state,
        planLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default plansReducer;
