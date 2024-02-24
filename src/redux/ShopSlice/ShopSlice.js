import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllShopsList, getShops} from '../../graphql/queries/shopQueries';

export const loadShopsStart = createAsyncThunk(
  'shop/fetchShops',
  async payload => {
    const response = await getShops(payload);
    return response?.data?.shopList;
  },
);
export const loadMoreShopStart = createAsyncThunk(
  'shopMore/loadMoreShops',
  async payload => {
    const response = await getShops(payload);
    return response?.data?.shopList;
  },
);

export const loadAllShopsListsStart = createAsyncThunk(
  'getAllShop/loadGetAllShops',
  async filterData => {
    const response = await getAllShopsList(filterData);
    return response?.data?.getAllShops;
  },
);

const handleShopLoading = (state, action) => {
  return {
    ...state,
    loading: true,
  };
};

const handleShopFulfilled = (state, action) => {
  const {limit, count, noOfPages, data} = action.payload;

  return {
    ...state,
    loading: false,
    shopsLimit: limit,
    shopsCount: count,
    numOfPages: noOfPages,
    shopsData: data,
  };
};
const handleMoreShopFulfilled = (state, action) => {
  const {limit, count, noOfPages, data} = action.payload;
  const mergedData = [...state.shopsData, ...data];
  return {
    ...state,
    loading: false,
    shopsLimit: limit,
    shopsCount: count,
    numOfPages: noOfPages,
    shopsData: mergedData,
  };
};

const handleShopRejected = (state, action) => {
  return {
    ...state,
    loading: false,
    error: action.payload,
  };
};

const loadGetAllShopsListsStart = (state, action) => {
  return {
    ...state,
    allShopsLists: {
      ...state.allShopsLists,
      loading: true,
    },
  };
};

const handleGetAllShopFulfilled = (state, action) => {
  return {
    ...state,
    allShopsLists: {
      ...state.allShopsLists,
      loading: false,
      data: action.payload,
    },
  };
};

const handleGetAllShopRejected = (state, action) => {
  return {
    ...state,
    allShopsLists: {
      ...state.allShopsLists,
      loading: false,
      error: action.payload,
    },
  };
};

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shopsLimit: 0,
    shopsCount: 0,
    numOfPages: 0,
    shopCurrentPage: 0,
    shopDataLimit: 0,
    shopsData: [],
    loading: false,
    error: '',

    allShopsLists: {
      data: [],
      loading: false,
      error: '',
    },
  },
  reducers: {
    changeShopCurrentPage: (state, action) => {
      return {
        ...state,
        shopCurrentPage: action.payload,
      };
    },
    changeShopDataLimit: (state, action) => {
      return {
        ...state,
        shopDataLimit: action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadShopsStart.pending, handleShopLoading)
      .addCase(loadShopsStart.fulfilled, handleShopFulfilled)
      .addCase(loadShopsStart.rejected, handleShopRejected)
      .addCase(loadMoreShopStart.pending, handleShopLoading)
      .addCase(loadMoreShopStart.fulfilled, handleMoreShopFulfilled)
      .addCase(loadMoreShopStart.rejected, handleShopRejected)
      .addCase(loadAllShopsListsStart.pending, loadGetAllShopsListsStart)
      .addCase(loadAllShopsListsStart.fulfilled, handleGetAllShopFulfilled)
      .addCase(loadAllShopsListsStart.rejected, handleGetAllShopRejected);
  },
});

export const {changeShopCurrentPage, changeShopDataLimit} = shopSlice.actions;
export default shopSlice.reducer;
