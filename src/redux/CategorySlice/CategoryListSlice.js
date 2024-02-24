import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getCategories} from '../../graphql/queries/categoriesQueries';

export const loadCategoriesStart = createAsyncThunk(
  'category/fetchCategory',
  async () => {
    const response = await getCategories();
    return response?.data.categoryList;
  },
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadCategoriesStart.pending, state => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(loadCategoriesStart.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        categories: action.payload,
      };
    });
    builder.addCase(loadCategoriesStart.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
  },
});

export default categorySlice.reducer;
