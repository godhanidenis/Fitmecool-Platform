export const CHANGE_THEME_LAYOUT = "CHANGE_THEME_LAYOUT";

export const changeThemeLayout = (layout) => ({
  type: CHANGE_THEME_LAYOUT,
  payload: layout,
});

const initialState = {
  themeLayout: "webScreen",
};

const themeLayoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME_LAYOUT:
      return {
        ...state,
        themeLayout: action.payload,
      };
    default:
      return state;
  }
};

export default themeLayoutReducer;
