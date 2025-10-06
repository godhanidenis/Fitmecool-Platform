export const LOAD_SUBSCRIPTION_START = "LOAD_SUBSCRIPTION_START";
export const LOAD_SUBSCRIPTION_SUCCESS = "LOAD_SUBSCRIPTION_SUCCESS";
export const LOAD_SUBSCRIPTION_ERROR = "LOAD_SUBSCRIPTION_ERROR";

export const loadSubscriptionStart = (subscriptions) => ({
  type: LOAD_SUBSCRIPTION_START,
  payload: subscriptions,
});

export const loadSubscriptionSuccess = (subscriptions) => ({
  type: LOAD_SUBSCRIPTION_SUCCESS,
  payload: subscriptions,
});

export const loadSubscriptionError = (error) => ({
  type: LOAD_SUBSCRIPTION_ERROR,
  payload: error,
});

const initialState = {
  subscriptions: [],
  subscriptionLoading: false,
  error: "",
};

const subscriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SUBSCRIPTION_START:
      return {
        ...state,
        subscriptionLoading: true,
      };

    case LOAD_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        subscriptionLoading: false,
        subscriptions: action.payload,
      };

    case LOAD_SUBSCRIPTION_ERROR:
      return {
        ...state,
        subscriptionLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default subscriptionsReducer;
