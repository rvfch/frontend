import axios from 'axios';
import Calls from '.';
import { AppDispatch } from '../store';
import {
  FILE_UPLOAD_FAILURE,
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
} from '../store/features/files.slice';

const PREFIX = 'files';

export const upload = (dtoIn: FormData) => async (dispatch: AppDispatch) => {
  // FILE_UPLOAD_REQUEST
  dispatch(FILE_UPLOAD_REQUEST());
  try {
    const response = await Calls.post(PREFIX + '/upload', dtoIn, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // FILE_UPLAOD_SUCCESS
    dispatch(FILE_UPLOAD_SUCCESS(response.data));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // FILE_UPLOAD_FAILURE
      dispatch(FILE_UPLOAD_FAILURE(error.response?.data));
    }
  }
};
