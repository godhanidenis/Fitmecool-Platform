export const LOAD_IMAGE_VARIANTS_START = "LOAD_IMAGE_VARIANTS_START";
export const LOAD_IMAGE_VARIANTS_SUCCESS = "LOAD_IMAGE_VARIANTS_SUCCESS";
export const LOAD_IMAGE_VARIANTS_ERROR = "LOAD_IMAGE_VARIANTS_ERROR";

export const loadImageVariantsStart = () => ({
  type: LOAD_IMAGE_VARIANTS_START,
});

export const loadImageVariantsSuccess = (data) => ({
  type: LOAD_IMAGE_VARIANTS_SUCCESS,
  payload: data,
});

export const loadImageVariantsError = (error) => ({
  type: LOAD_IMAGE_VARIANTS_ERROR,
  payload: error,
});

const initialState = {
  imageVariantsData: [],
  loading: false,
  error: "",
};

const shopConfigurationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_IMAGE_VARIANTS_START:
      return {
        ...state,
        loading: true,
      };

    case LOAD_IMAGE_VARIANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        imageVariantsData: action.payload,
      };

    case LOAD_IMAGE_VARIANTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default shopConfigurationsReducer;
