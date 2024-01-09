import { API_URL } from '@/utils/env';
import { apiGet, apiPost, apiPut } from './api';
import { Panel, Position } from '@/types/ads';

export const getAllAdsPosition = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<Position[]>>(
      API_URL + '/ads/all/getAllPosition',
    );
    return res.data;
  } catch {
    return null;
  }
};

export type AddAdsPositionRequest = {
  address: string;
  ward: string;
  district: string;
  province: string;
  location_type: string;
  ads_form: string;
  planning_status: string;
};

export const addAdsPosition = async (data: AddAdsPositionRequest) => {
  try {
    const res = await apiPost<
      AddAdsPositionRequest,
      ApiDataResponse<Position[]>
    >(API_URL + '/ads/all/getAllPosition', data);
    return res.data;
  } catch {
    return null;
  }
};

export const updateAdsPosition = async ({ id, ...data }: Position) => {
  try {
    const res = await apiPut<
      AddAdsPositionRequest,
      ApiDataResponse<Position[]>
    >(API_URL + `/ads/all/getAllPosition/${id}`, data);
    return res.data;
  } catch {
    return null;
  }
};

export const getAllAdsPanel = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<Panel[]>>(
      API_URL + '/ads/all/getAllPanel',
    );
    return res.data;
  } catch {
    return null;
  }
};
