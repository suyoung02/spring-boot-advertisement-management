import { User } from '@/types/user';
import { apiGet } from './api';
import { API_URL } from '@/utils/env';

export const getAllStaff = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<User[]>>(
      API_URL + '/staff/vhtt/get-all',
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
