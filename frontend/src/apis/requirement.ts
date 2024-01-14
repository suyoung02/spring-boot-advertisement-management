import { Report } from '@/types/report';
import { RequirementPanel, RequirementPosition } from '@/types/requirement';
import { API_URL } from '@/utils/env';
import { apiDelete, apiGet, apiPost, apiPut } from './api';

export type CreateRequirementPanelRequest = {
  new_info: string;
  reason: string;
  staff: number;
  ads_panel: number;
};

export const createRequirementPanel = async (
  data: CreateRequirementPanelRequest,
) => {
  try {
    const res = await apiPost<
      CreateRequirementPanelRequest,
      ApiDataResponse<Report>
    >(API_URL + '/editing_requirement', data);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type CreateRequirementPositionRequest = {
  new_info: string;
  reason: string;
  staff: number;
  ads_position: number;
};

export const createRequirementPosition = async (
  data: CreateRequirementPositionRequest,
) => {
  try {
    const res = await apiPost<
      CreateRequirementPositionRequest,
      ApiDataResponse<RequirementPosition>
    >(API_URL + '/position_requirement', data);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getAllRequirementPosition = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<RequirementPosition[]>>(
      API_URL + '/position_requirement',
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdateRequirementPositionRequest = Omit<
  RequirementPosition,
  'id' | 'status'
>;

export const updateRequirementPosition = async (
  id: number,
  data: UpdateRequirementPositionRequest,
) => {
  try {
    const res = await apiPut<
      UpdateRequirementPositionRequest,
      ApiDataResponse<RequirementPosition[]>
    >(API_URL + `/position_requirement/${id}`, data);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const approveRequirementPosition = async (id: number) => {
  try {
    const res = await apiPost(API_URL + `/position_requirement/approve/${id}`);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const rejectRequirementPosition = async (id: number) => {
  try {
    const res = await apiPost(API_URL + `/position_requirement/reject/${id}`);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deleteRequirementPosition = async (id: number) => {
  try {
    const res = await apiDelete(API_URL + `/position_requirement/${id}`);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getAllRequirementPanel = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<RequirementPanel[]>>(
      API_URL + '/editing_requirement',
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdateRequirementPanelRequest = Omit<
  RequirementPanel,
  'id' | 'status' | 'ads_position'
>;

export const updateRequirementPanel = async (
  id: number,
  data: UpdateRequirementPanelRequest,
) => {
  try {
    const res = await apiPut<
      UpdateRequirementPanelRequest,
      ApiDataResponse<RequirementPanel[]>
    >(API_URL + `/editing_requirement/${id}`, data);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const approveRequirementPanel = async (id: number) => {
  try {
    const res = await apiPost(API_URL + `/editing_requirement/approve/${id}`);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const rejectRequirementPanel = async (id: number) => {
  try {
    const res = await apiPost(API_URL + `/editing_requirement/reject/${id}`);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deleteRequirementPanel = async (id: number) => {
  try {
    const res = await apiDelete(API_URL + `/editing_requirement/${id}`);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
