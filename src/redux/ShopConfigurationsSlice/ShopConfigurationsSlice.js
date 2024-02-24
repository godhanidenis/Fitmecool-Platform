import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getShopConfigurations} from '../../graphql/queries/shopConfigurationsQueries';

export const loadShopConfigurationsStart = createAsyncThunk(
  'shopConfigurations/fetchShopConfigurations',
  async () => {
    const response = await getShopConfigurations();
    return response?.data;
  },
);

const shopConfigurationsSlice = createSlice({
  name: 'shopConfigurations',
  initialState: {
    shopConfigurationsData: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadShopConfigurationsStart.pending, state => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(loadShopConfigurationsStart.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        shopConfigurationsData: action.payload.shopConfigurations,
      };
    });
    builder.addCase(loadShopConfigurationsStart.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
  },
});

export default shopConfigurationsSlice.reducer;
