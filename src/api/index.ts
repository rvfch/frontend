import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { store } from '../store';
import { TENANT_INIT_FAILURE } from '../store/features/auth.slice';
import { object, string } from 'zod';
import { parseTenantId } from '../helpers/auth.helpers';
import { refreshAccess } from './auth.api';
import { IResponse } from './interface/response.interface';

// TODO: parse from env
const BASE_URL = 'http://localhost:8080/api/';

if (!BASE_URL) {
  throw new Error('API_URL environment variable is not set');
}

export const Calls = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true,
});

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const prepareHeaders = (): Record<string, string> => {
  const { accessToken, tenantId } = store.getState().auth;

  const schema = object({
    'X-API-KEY': string(),
    Authorization: string().startsWith('Bearer'),
  }).required();

  const headers = {
    'X-API-KEY': tenantId ?? parseTenantId(),
    Authorization: `Bearer ${accessToken}`,
  };

  return schema.parse(headers);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isIResponse(data: any): data is IResponse {
  return data && typeof data.message === 'string' && typeof data.code === 'number';
}

Calls.interceptors.request.use(
  (config) => {
    const headers = prepareHeaders();
    config.headers['X-API-KEY'] = headers['X-API-KEY'];
    config.headers['Authorization'] = headers['Authorization'];
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const handleErrorResponse = async (error: AxiosError) => {
  if (error.response) {
    const { status, data } = error.response;

    const config = error.config as ExtendedAxiosRequestConfig;

    switch (status) {
      case 401:
        if (!config._retry) {
          config._retry = true;
          const accessToken = await store.dispatch(refreshAccess());
          if (config.headers) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            return Calls.request(config);
          }
        }
        break;
      case 429:
        if (isIResponse(data)) {
          store.dispatch(TENANT_INIT_FAILURE(data));
        } else {
          console.error('Unexpected data format', data);
        }
        break;
    }
  } else {
    console.log(error.message);
  }

  return Promise.reject(error);
};

Calls.interceptors.response.use((response: AxiosResponse) => response, handleErrorResponse);

export default Calls;
