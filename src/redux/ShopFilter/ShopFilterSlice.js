import {createSlice} from '@reduxjs/toolkit';

const ShopFilterSlice = createSlice({
  name: 'shopFilter',
  initialState: {
    appliedShopsFilters: {
      locations: {
        selectedValue: [],
      },
      stars: {
        selectedValue: '',
      },
    },
    sortFilters: {
      sortType: {selectedValue: ''},
    },
    byShop: false,
  },
  reducers: {
    changeAppliedShopsFilters: (state, action) => {
      return {
        ...state,
        appliedShopsFilters: {
          ...state.appliedShopsFilters,
          [`${action.payload.key}`]: {
            ...action?.payload.value,
          },
        },
      };
    },
    changeSortShopsFilters: (state, action) => {
      return {
        ...state,
        sortFilters: {
          ...state.sortFilters,
          [`${action.payload.key}`]: action.payload.value,
        },
      };
    },
    shopProductButtonChange: (state, action) => {
      return {
        ...state,
        byShop: action.payload,
      };
    },
  },
  extraReducers: builder => {},
});

export const {
  changeAppliedShopsFilters,
  changeSortShopsFilters,
  shopProductButtonChange,
} = ShopFilterSlice.actions;
export default ShopFilterSlice.reducer;
