import { User } from '@/types/user';
import { apiDelete, apiGet, apiPatch } from './api';
import { API_URL } from '@/utils/env';
import { Role } from '@/types/enum';

export const getAllStaff = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<User[]>>(
      API_URL + '/staff/vhtt/get-all',
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getOneStaff = async (id: number) => {
  try {
    const res = await apiGet<{ id: number }, ApiDataResponse<User>>(
      API_URL + '/staff/vhtt/get-one',
      { id },
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdateStaffRequest = {
  fullname: string;
  dob: Date;
  email: string;
  phoneNumber: string;
  username: string;
  role: Role;
  ward: string;
  district: string;
};

export const updateOneStaff = async (id: number, data: UpdateStaffRequest) => {
  try {
    const res = await apiPatch<UpdateStaffRequest, ApiDataResponse<User>>(
      API_URL + `/staff/vhtt/update-one?id=${id}`,
      data,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deleteStaff = async (id: number) => {
  try {
    const res = await apiDelete<null, ApiDataResponse<boolean>>(
      API_URL + `/staff/vhtt/remove-one?id=${id}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdateAccountRequest = {
  fullname: string;
  dob: Date;
  email: string;
  phoneNumber: string;
};

export const updateAccount = async (data: UpdateAccountRequest) => {
  try {
    const res = await apiPatch<UpdateAccountRequest, ApiDataResponse<User>>(
      API_URL + `/staff/all/update-individual`,
      data,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const changePassword = async (data: ChangePasswordRequest) => {
  try {
    const res = await apiPatch<ChangePasswordRequest, ApiDataResponse<string>>(
      API_URL + `/auth/all/change-password`,
      data,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
