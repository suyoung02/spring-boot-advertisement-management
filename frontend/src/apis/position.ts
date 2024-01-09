import { API_URL } from '@/utils/env';
import { apiDelete, apiGet, apiPost, apiPut } from './api';
import { Panel, Position } from '@/types/ads';
import { IS_ACTIVE } from '@/types/enum';

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

export const getDetailAdsPosition = async (id: number) => {
  try {
    const res = await apiGet<null, ApiDataResponse<Position>>(
      API_URL + `/ads/all/getDetailPosition/${id}`,
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
  photo: string;
  place_id: string;
  latitude: number;
  longitude: number;
  is_active: 'TRUE' | 'FALSE';
};

export const addAdsPosition = async (data: AddAdsPositionRequest) => {
  try {
    const res = await apiPost<
      AddAdsPositionRequest,
      ApiDataResponse<Position[]>
    >(API_URL + '/ads/vhtt/addNewPosition', data);
    return res.data;
  } catch {
    return null;
  }
};

export type UpdateAdsPositionRequest = {
  id: number;
  address: string;
  ward: string;
  district: string;
  province: string;
  location_type: string;
  ads_form: string;
  planning_status: string;
  photo: string;
  place_id: string;
  latitude: number;
  longitude: number;
  is_active: IS_ACTIVE;
};

export const updateAdsPosition = async ({
  id,
  ...data
}: UpdateAdsPositionRequest) => {
  try {
    const res = await apiPut<
      AddAdsPositionRequest,
      ApiDataResponse<Position[]>
    >(API_URL + `/ads/vhtt/updatePosition/${id}`, data);
    return res.data;
  } catch {
    return null;
  }
};

export const deleteAdsPosition = async (id: number) => {
  try {
    const res = await apiDelete<
      AddAdsPositionRequest,
      ApiDataResponse<Position[]>
    >(API_URL + `/ads/vhtt/deletePosition/${id}`);
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
