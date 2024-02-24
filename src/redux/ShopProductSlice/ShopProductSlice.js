import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getProducts} from '../../graphql/queries/productQueries';

export const loadShopProductsStart = createAsyncThunk(
  'shopProduct/fetchShopProducts',
  async payload => {
    const response = await getProducts(payload);
    return response?.data?.productList;
  },
);

const handleProductLoading = (state, action) => {
  return {
    ...state,
    productLoading: true,
  };
};

const handleProductFulfilled = (state, action) => {
  const {limit, count, noOfPages, data} = action.payload;

  return {
    ...state,
    productLoading: false,
    productsLimit: limit,
    productsCount: count,
    numOfPages: noOfPages,
    productsData: data,
  };
};

const handleProductRejected = (state, action) => {
  return {
    ...state,
    productLoading: false,
    error: action.payload,
  };
};

const ShopProductSlice = createSlice({
  name: 'shopProduct',
  initialState: {
    productsLimit: 0,
    productsCount: 0,
    numOfPages: 0,
    // productCurrentPage: 0,
    // productDataLimit: 0,
    productPageSkip: 0,
    productsData: [],
    productLoading: false,
    PaginationProductLimit: 5,
    error: '',
  },
  reducers: {
    changeShopProductPageSkip: (state, action) => {
      return {
        ...state,
        productPageSkip: action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadShopProductsStart.pending, handleProductLoading)
      .addCase(loadShopProductsStart.fulfilled, handleProductFulfilled)
      .addCase(loadShopProductsStart.rejected, handleProductRejected);
  },
});

export const {changeShopProductPageSkip} = ShopProductSlice.actions;
export default ShopProductSlice.reducer;
