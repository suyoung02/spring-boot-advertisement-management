import { Report } from '@/types/report';
import { API_URL } from '@/utils/env';
import { apiPost } from './api';

export type CreateRequirementPanelRequest = {
  new_info: string;
  time_submit: Date;
  reason: string;
  status: string;
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
