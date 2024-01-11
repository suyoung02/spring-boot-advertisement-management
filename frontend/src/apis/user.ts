import { API_URL } from '@/utils/env';
import { apiGet, apiPatch, apiPost, apiPut } from './api';
import { User } from '@/types/user';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: 'string';
  refreshToken: 'string';
};

export const loginApi = async (data: LoginRequest) => {
  try {
    const res = await apiPost<LoginRequest, ApiDataResponse<LoginResponse>>(
      API_URL + '/auth/normal/signin',
      data,
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const logoutApi = async () => {
  const res = await apiPost(API_URL + '/auth/all/logout');
  return res.data;
};

export const getMe = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<User>>(
      API_URL + '/staff/all/get-individual',
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e);
  }
};

export type RegisterRequest = {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  ward: string;
  district: string;
  fullname: string;
  dob: Date;
  email: string;
  phoneNumber: string;
};

export const registerApi = async (data: RegisterRequest) => {
  try {
    const res = await apiPost(API_URL + '/auth/vhtt/signup', data);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const refreshTokenApi = async (token: string) => {
  const res = await apiPost(API_URL + '/auth/normal/refresh-token', { token });
  return res.data;
};

export type ForgetPasswordRequest = {
  username: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export const forgotPasswordApi = async (data: ForgetPasswordRequest) => {
  try {
    const res = await apiPatch(API_URL + '/auth/normal/forgot-password', data);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const sendOtpApi = async (username: string) => {
  try {
    const res = await apiPut(
      API_URL + `/auth/normal/regenerate-otp?username=${username}`,
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
