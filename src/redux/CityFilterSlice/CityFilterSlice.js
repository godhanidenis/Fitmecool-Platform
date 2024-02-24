import {createSlice} from '@reduxjs/toolkit';

const CityFilterSlice = createSlice({
  name: 'cityListFilter',
  initialState: {
    appliedCityFilter: {
      city: {
        selectedValue: '',
      },
    },
  },
  reducers: {
    changeAppliedCityFilters: (state, action) => {
      return {
        ...state,
        appliedCityFilter: {
          ...state.appliedCityFilter,
          [`${action.payload.key}`]: {
            ...action?.payload.value,
          },
        },
      };
    },
  },
  extraReducers: builder => {},
});

export const {changeAppliedCityFilters} = CityFilterSlice.actions;
export default CityFilterSlice.reducer;
