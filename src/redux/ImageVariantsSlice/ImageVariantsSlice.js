import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getImagesVariants} from '../../graphql/queries/imageVariantsQueries';

export const loadImageVariantsStart = createAsyncThunk(
  'imagesVariants/fetchImagesVariants',
  async () => {
    const response = await getImagesVariants();
    return response?.data;
  },
);

const ImageVariantsSlice = createSlice({
  name: 'ImagesVariants',
  initialState: {
    imagesVariantData: {},
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadImageVariantsStart.pending, state => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(loadImageVariantsStart.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        imagesVariantData: action.payload,
      };
    });
    builder.addCase(loadImageVariantsStart.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    });
  },
});

export default ImageVariantsSlice.reducer;
