import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import { expiredToken, getAccessToken, logout, setToken } from '@/stores/user';
import { refreshTokenApi } from './user';

type AxiosRetry = AxiosError['config'] & { _retry: boolean };

const instance = axios.create();
let requestingRefreshToken: ReturnType<typeof refreshAccessToken> | null = null;

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error('[API] - Call api fail', error);
    const originalRequest = error.config as AxiosRetry;
    if (!originalRequest) return Promise.reject(error);

    const isUnauthorized = error.response?.status === 403 && expiredToken();
    const isNotRetry = !originalRequest._retry;

    console.log({ isUnauthorized, isNotRetry, requestingRefreshToken });
    if (isUnauthorized && isNotRetry) {
      originalRequest._retry = true;
      if (!requestingRefreshToken) {
        requestingRefreshToken = refreshAccessToken();
      }

      const rs = await requestingRefreshToken;

      requestingRefreshToken = null;
      if (rs.error) {
        const err = (rs as any).error as AxiosError;
        const refreshStatus = err.response?.status;
        console.log({ refreshStatus });
        if (refreshStatus === 403) {
          logout();
          return;
        }
        return Promise.reject(error);
      }

      return instance(originalRequest);
    }

    return Promise.reject(error);
  },
);

const refreshAccessToken = async () => {
  const response = {
    user: null,
    error: null as never,
  };

  try {
    const user = await refreshTokenApi(
      localStorage.getItem('refreshToken') || '',
    );

    setToken(user.accessToken, user.refreshToken, user.expired_time);

    return {
      error: null,
    };
  } catch (error) {
    console.error('Refresh token fail', error);
    response.error = error as never;
    return response;
  }
};

export const apiRequest = async <
  Data = unknown,
  Response = AxiosResponse<Data>,
>(
  config: AxiosRequestConfig,
): Promise<Response> => {
  const token = getAccessToken();

  return instance.request({
    ...config,
    headers: {
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config.headers,
    },
  });
};

export const apiGet = async <Data = unknown, Response = AxiosResponse<Data>>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<Response> => {
  const query = params
    ? `?${Object.keys(params)
        .map((key) =>
          params[key] !== undefined ? `${key}=${params[key]}` : '',
        )
        .filter(Boolean)
        .join('&')}`
    : '';

  return apiRequest<Data, Response>({
    url: `${url}${query}`,
    method: 'GET',
    ...config,
  });
};

export const apiPost = async <Data = unknown, Response = AxiosResponse<Data>>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig,
) => {
  return apiRequest<Data, Response>({
    url,
    data: data ?? null,
    method: 'POST',
    ...config,
  });
};

export const apiPut = async <Data = unknown, Response = AxiosResponse<Data>>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig,
) => {
  return apiRequest<Data, Response>({
    url,
    data: data ?? null,
    method: 'PUT',
    ...config,
  });
};

export const apiPatch = async <Data = unknown, Response = AxiosResponse<Data>>(
  url: string,
  data?: Data,
  config?: AxiosRequestConfig,
) => {
  return apiRequest<Data, Response>({
    url,
    data: data ?? null,
    method: 'PATCH',
    ...config,
  });
};

export const apiDelete = async <Data = unknown, Response = AxiosResponse<Data>>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  return apiRequest<Data, Response>({
    url,
    method: 'DELETE',
    ...config,
  });
};
