import type {
  AdsForm,
  AdsType,
  LocationType,
  PlanningStatus,
} from '@/types/ads';
import { API_URL } from '@/utils/env';
import { apiDelete, apiGet, apiPost, apiPut } from './api';

export const getAllAdsType = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<AdsType[]>>(
      API_URL + '/adsType/getAll',
    );
    return res.data;
  } catch {
    return null;
  }
};

export const addAdsType = async (data: AdsType) => {
  try {
    const res = await apiPost<AdsType, ApiDataResponse<AdsType[]>>(
      API_URL + '/adsType/addNew',
      data,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdateAdsTypeRequest = {
  title: string;
  adsType: AdsType;
};

export const updateAdsType = async ({
  title,
  adsType,
}: UpdateAdsTypeRequest) => {
  try {
    const res = await apiPut<AdsType, ApiDataResponse<AdsType[]>>(
      API_URL + `/adsType/update/${title}`,
      adsType,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deleteAdsType = async (title: string) => {
  try {
    const res = await apiDelete<null, ApiDataResponse<AdsType[]>>(
      API_URL + `/adsType/delete/${title}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getAllAdsForm = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<AdsForm[]>>(
      API_URL + '/adsForm/getAll',
    );
    return res.data;
  } catch {
    return null;
  }
};

export const addAdsForm = async (data: AdsForm) => {
  try {
    const res = await apiPost<AdsForm, ApiDataResponse<AdsForm[]>>(
      API_URL + '/adsForm/addNew',
      data,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdateAdsFormRequest = {
  title: string;
  adsForm: AdsForm;
};

export const updateAdsForm = async ({
  title,
  adsForm,
}: UpdateAdsFormRequest) => {
  try {
    const res = await apiPut<AdsForm, ApiDataResponse<AdsForm[]>>(
      API_URL + `/adsForm/update/${title}`,
      adsForm,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deleteAdsForm = async (title: string) => {
  try {
    const res = await apiDelete<null, ApiDataResponse<AdsForm[]>>(
      API_URL + `/adsForm/delete/${title}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getAllLocationType = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<LocationType[]>>(
      API_URL + '/locationType/getAll',
    );
    return res.data;
  } catch {
    return null;
  }
};

export const addLocationType = async (data: LocationType) => {
  try {
    const res = await apiPost<LocationType, ApiDataResponse<LocationType[]>>(
      API_URL + '/locationType/addNew',
      data,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdateLocationTypeRequest = {
  title: string;
  locationType: LocationType;
};

export const updateLocationType = async ({
  title,
  locationType,
}: UpdateLocationTypeRequest) => {
  try {
    const res = await apiPut<LocationType, ApiDataResponse<LocationType[]>>(
      API_URL + `/locationType/update/${title}`,
      locationType,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deleteLocationType = async (title: string) => {
  try {
    const res = await apiDelete<null, ApiDataResponse<PlanningStatus[]>>(
      API_URL + `/locationType/delete/${title}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getAllPlanningStatus = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<PlanningStatus[]>>(
      API_URL + '/planningStatus/getAll',
    );
    return res.data;
  } catch {
    return null;
  }
};

export const addPlanningStatus = async (data: PlanningStatus) => {
  try {
    const res = await apiPost<
      PlanningStatus,
      ApiDataResponse<PlanningStatus[]>
    >(API_URL + '/planningStatus/addNew', data);
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdatePlanningStatusRequest = {
  title: string;
  planningStatus: PlanningStatus;
};

export const updatePlanningStatus = async ({
  title,
  planningStatus,
}: UpdatePlanningStatusRequest) => {
  try {
    const res = await apiPut<PlanningStatus, ApiDataResponse<PlanningStatus[]>>(
      API_URL + `/planningStatus/update/${title}`,
      planningStatus,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deletePlanningStatus = async (title: string) => {
  try {
    const res = await apiDelete<null, ApiDataResponse<PlanningStatus[]>>(
      API_URL + `/planningStatus/delete/${title}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
