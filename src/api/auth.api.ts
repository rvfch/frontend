import axios from 'axios';
import Calls from '.';
import { AppDispatch } from '../store';
import { ILoginRequest } from './interface/login-request.interface';
import { ISignupRequest } from './interface/signup-request.interface';
import {
  CHECK_IF_AUTHENTICATED,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REFRESH_TOKEN_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  TENANT_INIT_FAILURE,
  TENANT_INIT_REQUEST,
  TENANT_INIT_SUCCESS,
} from '../store/features/auth.slice';
import { ITenantRequest } from './interface/tenant-request.interface';

const PREFIX = 'auth';

export const login = (dtoIn: ILoginRequest) => async (dispatch: AppDispatch) => {
  // LOGIN_REQUEST
  dispatch(LOGIN_REQUEST());
  try {
    const response = await Calls.post(PREFIX + '/login', dtoIn);
    // LOGIN_SUCCESS
    dispatch(LOGIN_SUCCESS(response.data));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // LOGIN_FAILURE
      dispatch(LOGIN_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const initTenant = (dtoIn: ITenantRequest) => async (dispatch: AppDispatch) => {
  dispatch(TENANT_INIT_REQUEST());
  try {
    const response = await Calls.post(PREFIX + '/initTenant', dtoIn);

    dispatch(TENANT_INIT_SUCCESS(response.data));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch(TENANT_INIT_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const getUser = () => async (dispatch: AppDispatch) => {
  try {
    const response = await Calls.get(PREFIX + '/me');
    dispatch(CHECK_IF_AUTHENTICATED(response.data));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // LOGIN_FAILURE
      dispatch(LOGIN_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const signup = (dtoIn: ISignupRequest) => async (dispatch: AppDispatch) => {
  // SIGNUP_REQUEST
  dispatch(SIGNUP_REQUEST());
  try {
    const response = await Calls.post(PREFIX + '/signup', dtoIn);
    // SIGNUP_SUCCESS
    dispatch(SIGNUP_SUCCESS(response.data));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // SIGNUP_FAILURE
      dispatch(SIGNUP_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const logout = () => async (dispatch: AppDispatch) => {
  // LOGOUT_REQUEST
  dispatch(LOGOUT_REQUEST());
  try {
    const response = await Calls.post(PREFIX + '/logout');
    // LOGOUT_SUCCESS
    dispatch(LOGOUT_SUCCESS(response.data));

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // LOGOUT_FAILURE
      dispatch(LOGOUT_FAILURE(error.response?.data));
      throw error;
    }
  }
};

export const refreshAccess =
  () =>
  async (dispatch: AppDispatch): Promise<string | undefined> => {
    try {
      const response = await Calls.post(PREFIX + '/refresh-access');

      // REFRESH_TOKEN_SUCCESS
      dispatch(REFRESH_TOKEN_SUCCESS(response.data));

      return `Bearer ${response.data.accessToken}`;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        // LOGOUT
        dispatch(logout());
      }
    }
    return undefined;
  };
