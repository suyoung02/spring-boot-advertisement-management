import { API_URL } from "@/utils/env";
import { apiPost, apiPut } from "./api";

export type LoginRequest = {
  username: string;
  password: string;
};

export const loginApi = async (data: LoginRequest) => {
  const res = await apiPost(API_URL + "/auth/signin", data);
  return res.data;
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
  const res = await apiPost(API_URL + "/auth/signup", data);
  return res.data;
};

export const refreshTokenApi = async (token: string) => {
  const res = await apiPost(API_URL + "/auth/refresh-token", { token });
  return res.data;
};

export type ForgetPasswordRequest = {
  username: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

export const forgotPasswordApi = async (data: ForgetPasswordRequest) => {
  const res = await apiPost(API_URL + "/auth/forgot-password", data);
  return res.data;
};

export const sendOtpApi = async (username: string) => {
  try {
    const res = await apiPut(
      API_URL + `auth/regenerate-otp?username=${username}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
