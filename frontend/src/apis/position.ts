import { API_URL } from '@/utils/env';
import { apiDelete, apiGet, apiPost, apiPut } from './api';
import { Panel, Position, PresentingPanel } from '@/types/ads';
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

export const getAllPresentingPanel = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<PresentingPanel[]>>(
      API_URL + '/ads/all/presenting-panel',
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
  name: string;
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
    const res = await apiPost<AddAdsPositionRequest, ApiDataResponse<Position>>(
      API_URL + '/ads/vhtt/addNewPosition',
      data,
    );
    return res.data;
  } catch {
    return null;
  }
};

export type UpdateAdsPositionRequest = {
  id: number;
  name: string;
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
    const res = await apiPut<AddAdsPositionRequest, ApiDataResponse<boolean>>(
      API_URL + `/ads/vhtt/updatePosition/${id}`,
      data,
    );
    return res.data;
  } catch {
    return null;
  }
};

export const deleteAdsPosition = async (id: number) => {
  try {
    const res = await apiDelete<
      AddAdsPositionRequest,
      ApiDataResponse<boolean>
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

export type AddPanelRequest = {
  ads_type: string;
  size: string;
  contract_expiration: Date;
  ads_position: number;
};

export const addAdsPanel = async (data: AddPanelRequest) => {
  try {
    const res = await apiPost<AddPanelRequest, ApiDataResponse<Panel>>(
      API_URL + '/ads/vhtt/addNewPanel',
      data,
    );
    return res.data;
  } catch {
    return null;
  }
};

export type UpdateAdsPanelRequest = {
  id: number;
  ads_type: string;
  size: string;
  contract_expiration: Date;
  ads_position: number;
};

export const updateAdsPanel = async (data: UpdateAdsPanelRequest) => {
  try {
    const res = await apiPut<UpdateAdsPanelRequest, ApiDataResponse<Panel>>(
      API_URL + `/ads/vhtt/updatePanel/${data.id}`,
      data,
    );
    return res.data;
  } catch {
    return null;
  }
};

export const deleteAdsPanel = async (id: number) => {
  try {
    const res = await apiDelete<
      AddAdsPositionRequest,
      ApiDataResponse<boolean>
    >(API_URL + `/ads/vhtt/deletePanel/${id}`);
    return res.data;
  } catch {
    return null;
  }
};

export const getDetailAdsPanel = async (id: number) => {
  try {
    const res = await apiGet<null, ApiDataResponse<Panel>>(
      API_URL + `/ads/all/getDetailPanel/${id}`,
    );
    return res.data;
  } catch {
    return null;
  }
};
