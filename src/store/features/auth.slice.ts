import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../api/interface/user.interface';
import { IResponse } from '../../api/interface/response.interface';

export interface IAuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser | null;
  tenantId: string | null;
  tenantInitialized: boolean;
  error: IResponse | null;
}

const initialState: IAuthState = {
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  user: null,
  tenantId: null,
  tenantInitialized: false,
  error: null,
  // _persist: {
  //   version: -1,
  //   rehydrated: false,
  // },
};

export const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    TENANT_INIT_REQUEST: (state) => {
      state.isLoading = true;
    },
    TENANT_INIT_SUCCESS: (state, action: PayloadAction<{ apiKey: string }>) => {
      state.tenantId = action.payload.apiKey;
      state.tenantInitialized = true;
      state.isLoading = false;
      state.error = null;
    },
    TENANT_INIT_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.isAuthenticated = false;
      state.tenantInitialized = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    CHECK_IF_AUTHENTICATED: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    LOGIN_REQUEST: (state) => {
      state.isAuthenticated = false;
      state.isLoading = true;
    },
    LOGIN_SUCCESS: (state, action: PayloadAction<{ accessToken: string; user: IUser }>) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
    },
    LOGIN_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    SIGNUP_REQUEST: (state) => {
      state.isAuthenticated = false;
      state.isLoading = true;
    },
    SIGNUP_SUCCESS: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    SIGNUP_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    LOGOUT_REQUEST: (state) => {
      state.isLoading = true;
    },
    LOGOUT_SUCCESS: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
    LOGOUT_FAILURE: (state, action: PayloadAction<IResponse>) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      state.isLoading = false;
    },
    REFRESH_TOKEN_SUCCESS: (state, action: PayloadAction<{ accessToken: string; user: IUser }>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
  },
});

export default authSlice.reducer;

export const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  REFRESH_TOKEN_SUCCESS,
  CHECK_IF_AUTHENTICATED,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  TENANT_INIT_REQUEST,
  TENANT_INIT_SUCCESS,
  TENANT_INIT_FAILURE,
} = authSlice.actions;
