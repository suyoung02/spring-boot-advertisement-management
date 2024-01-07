import type { Ads } from '@/types/ads';
import { API_URL } from '@/utils/env';
import { apiDelete, apiGet, apiPost, apiPut } from './api';

export const getAllAdsType = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<Ads[]>>(
      API_URL + '/adsType/getAll',
    );
    return res.data;
  } catch {
    return null;
  }
};

export const addAdsType = async (data: Ads) => {
  try {
    const res = await apiPost<Ads, ApiDataResponse<Ads[]>>(
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
  newTitle: string;
};

export const updateAdsType = async ({
  title,
  newTitle,
}: UpdateAdsTypeRequest) => {
  try {
    const res = await apiPut<Ads, ApiDataResponse<Ads[]>>(
      API_URL + `/adsType/update/${title}`,
      { title: newTitle },
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deleteAdsType = async (title: string) => {
  try {
    const res = await apiDelete<null, ApiDataResponse<Ads[]>>(
      API_URL + `/adsType/delete/${title}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
