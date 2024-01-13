import { API_URL } from '@/utils/env';
import { apiDelete, apiPatch, apiPost } from './api';

export type AddContractRequest = {
  enterprise_info: string;
  enterprise_email: string;
  enterprise_phone_number: string;
  contract_begin: Date;
  contract_expiration: Date;
  ads_type: string;
  size: string;
  ads_position: number;
  ads_img: string;
};

export const addContract = async (data: AddContractRequest) => {
  try {
    const res = await apiPost<AddContractRequest, ApiDataResponse<boolean>>(
      API_URL + '/contract',
      data,
    );
    return res.data;
  } catch {
    return null;
  }
};

export const approveContract = async (id: number) => {
  const res = await apiPost(API_URL + `/contract/${id}`);
  return res.data;
};

export const rejectContract = async (id: number) => {
  const res = await apiPatch(API_URL + `/contract/${id}`);
  return res.data;
};

export const deleteContract = async (id: number) => {
  const res = await apiDelete(API_URL + `/contract/${id}`);
  return res.data;
};
