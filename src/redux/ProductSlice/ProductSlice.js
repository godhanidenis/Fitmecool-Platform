import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getProducts} from '../../graphql/queries/productQueries';

export const loadProductsStart = createAsyncThunk(
  'product/fetchProducts',
  async payload => {
    const response = await getProducts(payload);
    return response?.data?.productList;
  },
);
export const loadMoreProductsStart = createAsyncThunk(
  'productMore/loadMoreProducts',
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
const handleMoreProductFulfilled = (state, action) => {
  const {limit, count, noOfPages, data} = action.payload;
  const mergedData = [...state.productsData, ...data];
  return {
    ...state,
    productLoading: false,
    productsLimit: limit,
    productsCount: count,
    numOfPages: noOfPages,
    productsData: mergedData,
  };
};

const handleProductRejected = (state, action) => {
  return {
    ...state,
    productLoading: false,
    error: action.payload,
  };
};

const productSlice = createSlice({
  name: 'product',
  initialState: {
    productsLimit: 0,
    productsCount: 0,
    numOfPages: 0,
    productCurrentPage: 0,
    productDataLimit: 0,
    productPageSkip: 0,
    productsData: [],
    productLoading: false,
    PaginationProductLimit: 5,
    error: '',
  },
  reducers: {
    changeProductCurrentPage: (state, action) => {
      return {
        ...state,
        productCurrentPage: action.payload,
      };
    },
    changeProductDataLimit: (state, action) => {
      return {
        ...state,
        productDataLimit: action.payload,
      };
    },
    changeProductPageSkip: (state, action) => {
      return {
        ...state,
        productPageSkip: action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadProductsStart.pending, handleProductLoading)
      .addCase(loadProductsStart.fulfilled, handleProductFulfilled)
      .addCase(loadProductsStart.rejected, handleProductRejected)
      .addCase(loadMoreProductsStart.pending, handleProductLoading)
      .addCase(loadMoreProductsStart.fulfilled, handleMoreProductFulfilled)
      .addCase(loadMoreProductsStart.rejected, handleProductRejected);
  },
});

export const {
  changeProductCurrentPage,
  changeProductDataLimit,
  changeProductPageSkip,
} = productSlice.actions;
export default productSlice.reducer;
