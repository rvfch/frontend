import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';
import { TENANT_INIT_FAILURE } from '../store/features/auth.slice';
import { object, string } from 'zod';
import { parseTenantId } from '../helpers/auth.helpers';
import { refreshAccess } from './auth.api';

export const Calls = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 5000,
  withCredentials: true,
});

Calls.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    {
      const state = store.getState();
      const { accessToken, tenantId } = state.auth;

      const schema = object({
        'X-API-KEY': string(),
        Authorization: string().startsWith('Bearer'),
      }).required();

      let headers = {
        'X-API-KEY': tenantId ?? parseTenantId(),
        Authorization: `Bearer ${accessToken}`,
      };
      headers = schema.parse(headers);

      config.headers['X-API-KEY'] = headers['X-API-KEY'];
      config.headers['Authorization'] = headers['Authorization'];

      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

Calls.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (axios.isAxiosError(error)) {
      const { status } = (error.response as AxiosResponse) ?? {};

      switch (status) {
        case 401: {
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            store.dispatch(refreshAccess()).then((accessToken) => {
              console.log(accessToken);
              originalRequest.headers['Authorization'] = accessToken;
            });
            return Calls(originalRequest);
          }
          break;
        }
        case 429: {
          store.dispatch(TENANT_INIT_FAILURE(error.response?.data));
          break;
        }
        // case 404: {
        //   // "Invalid request"
        //   break;
        // }
        // case 500: {
        //   // "Server error"
        //   break;
        // }
        default: {
          // store.dispatch(SERVER_ERROR(error));
          break;
        }
      }
    } else {
      console.log(error.message);
    }

    return await Promise.reject(error);
  },
);

export default Calls;
