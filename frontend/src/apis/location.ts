import type { City } from "@/types/location";
import axios from "axios";

export const getLocationApi = async (depth: number) => {
  try {
    const res = await axios.get<null, ApiDataResponse<City[]>>(
      `https://provinces.open-api.vn/api/?depth=${depth}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
