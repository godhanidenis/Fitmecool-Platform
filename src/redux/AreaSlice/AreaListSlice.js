import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  getAreaByCityLists,
  getAreaLists,
} from '../../graphql/queries/areaListsQueries';

export const loadAreaListsStart = createAsyncThunk(
  'area/fetchArea',
  async city => {
    const response = city
      ? await getAreaByCityLists(city)
      : await getAreaLists();
    return city ? response?.data?.areaByCity : response?.data.areaList;
  },
);

const AreaSlice = createSlice({
  name: 'area',
  initialState: {
    areaLists: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadAreaListsStart.pending, state => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(loadAreaListsStart.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        areaLists: action.payload,
      };
    });
    builder.addCase(loadAreaListsStart.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
  },
});

export default AreaSlice.reducer;
