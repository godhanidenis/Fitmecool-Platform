import {createSlice} from '@reduxjs/toolkit';

const shopProductFilterSlice = createSlice({
  name: 'ShopProductFilter',
  initialState: {
    appliedShopProductsFilters: {
      categoryId: {
        selectedValue: [],
      },
      productColor: {
        selectedValue: [],
      },
      productPrice: {
        selectedValue: {
          min: 0,
          max: 0,
        },
      },
      productListingType: {
        selectedValue: '',
      },
      shopId: {
        selectedValue: [],
      },
      searchBarData: {
        selectedValue: '',
      },
    },
    shopSortFilters: {
      sortType: {selectedValue: ''},
    },
  },
  reducers: {
    changeAppliedShopProductsFilters: (state, action) => {
      return {
        ...state,
        appliedShopProductsFilters: {
          ...state.appliedShopProductsFilters,
          [`${action.payload.key}`]: {
            ...action?.payload.value,
          },
        },
      };
    },
    changeSortShopProductsFilters: (state, action) => {
      return {
        ...state,
        shopSortFilters: {
          ...state.shopSortFilters,
          [`${action.payload.key}`]: action.payload.value,
        },
      };
    },
    emptyShopProductFilter: (state, action) => {
      return {
        appliedShopProductsFilters: {
          categoryId: {
            selectedValue: [],
          },
          productColor: {
            selectedValue: [],
          },
          productPrice: {
            selectedValue: {
              min: 0,
              max: 0,
            },
          },
          productListingType: {
            selectedValue: '',
          },
          shopId: {
            selectedValue: [],
          },
          searchBarData: {
            selectedValue: '',
          },
        },
        shopSortFilters: {
          sortType: {selectedValue: ''},
        },
      };
    },
  },
  extraReducers: builder => {},
});

export const {
  changeAppliedShopProductsFilters,
  changeSortShopProductsFilters,
  emptyShopProductFilter,
} = shopProductFilterSlice.actions;
export default shopProductFilterSlice.reducer;
