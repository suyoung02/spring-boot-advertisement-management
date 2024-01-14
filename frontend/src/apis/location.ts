import type { City, PlaceResponse } from '@/types/location';
import axios from 'axios';
import { apiGet } from './api';

export const getLocationApi = async (depth: number) => {
  try {
    const res = await axios.get<null, ApiDataResponse<City[]>>(
      `https://provinces.open-api.vn/api/?depth=${depth}`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const placeSearch = async (input: string) => {
  const res = await apiGet<any, ApiDataResponse<PlaceResponse>>(
    'https://rsapi.goong.io/geocode',
    {
      api_key: 'sPgcfgAuWiG65qQ84c9TzLd6ABuCJU3f9hS1J41t',
      address: input,
    },
  );

  return res.data;
};
