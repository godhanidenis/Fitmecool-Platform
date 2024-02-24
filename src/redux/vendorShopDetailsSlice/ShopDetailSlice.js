import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getVendorShopDetails} from '../../graphql/queries/shopQueries';

export const loadVendorShopDetailsStart = createAsyncThunk(
  'shop/shopDetail',
  async shopId => {
    const response = await getVendorShopDetails({
      id: shopId,
      forDashboard: true,
    });
    return response;
  },
);

const shopDetailSlice = createSlice({
  name: 'shopDetail',
  initialState: {
    vendorShopDetails: {},
    shopDetailLoading: false,
    error: '',
  },
  reducers: {
    otherAction: (state, action) => {},
  },
  extraReducers: builder => {
    builder.addCase(loadVendorShopDetailsStart.pending, state => {
      return {
        ...state,
        shopDetailLoading: true,
      };
    });
    builder.addCase(loadVendorShopDetailsStart.fulfilled, (state, action) => {
      return {
        ...state,
        shopDetailLoading: false,
        vendorShopDetails: action?.payload?.data?.shop,
      };
    });
    builder.addCase(loadVendorShopDetailsStart.rejected, (state, action) => {
      return {
        ...state,
        shopDetailLoading: false,
        error: action.payload,
      };
    });
  },
});

export const {otherAction} = shopDetailSlice.actions;
export default shopDetailSlice.reducer;
