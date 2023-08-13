import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IResponse } from '../../api/interface/response.interface';

export interface IFileState {
  error: IResponse | null;
  isLoading: boolean;
  url: string | null;
}

const initialState: IFileState = {
  error: null,
  isLoading: false,
  url: null,
};

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    FILE_UPLOAD_REQUEST: (state) => {
      state.isLoading = true;
      state.url = null;
      state.error = null;
    },
    FILE_UPLOAD_SUCCESS: (state, action: PayloadAction<{ url: string }>) => {
      state.isLoading = false;
      state.url = action.payload.url;
      state.error = null;
    },
    FILE_UPLOAD_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.isLoading = false;
      state.url = null;
      state.error = action.payload;
    },
    FILE_CLEAR: (state) => {
      state.url = null;
    },
  },
});

export const { FILE_UPLOAD_REQUEST, FILE_UPLOAD_SUCCESS, FILE_UPLOAD_FAILURE, FILE_CLEAR } =
  filesSlice.actions;

export default filesSlice.reducer;
