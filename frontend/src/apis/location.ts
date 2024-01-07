import type { City } from '@/types/location';
import axios from 'axios';
import { apiGet } from './api';
import { GG_MAP_API_KEY } from '@/utils/env';

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

type PlaceSearchRequest = {
  fields: string;
  input: string;
  inputtype: string;
  key: string;
};

export const placeSearch = async (address: string) => {
  const res = await apiGet<PlaceSearchRequest>(
    'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
    {
      fields: 'formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry',
      input: address,
      inputtype: 'textquery',
      key: GG_MAP_API_KEY,
    },
  );

  console.log(res);
};
