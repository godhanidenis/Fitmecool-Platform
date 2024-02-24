import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const appVersionSlice = createSlice({
  name: 'appVersion',
  initialState: {
    versionData: {},
    error: '',
  },
  reducers: {
    appVersionAction: (state, action) => {
      return {
        ...state,
        versionData: action.payload,
        error: '',
      };
    },
  },
  extraReducers: builder => {},
});

export const {appVersionAction} = appVersionSlice.actions;
export default appVersionSlice.reducer;
