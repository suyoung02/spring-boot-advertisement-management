import { API_URL } from '@/utils/env';
import { apiPost } from './api';
import { Report } from '@/types/report';

export type CreateReportRequest = Omit<Report, 'id'> & { token: string };

export const createReport = async (data: CreateReportRequest) => {
  try {
    const res = await apiPost<CreateReportRequest, ApiDataResponse<Report>>(
      API_URL + '/report',
      data,
    );

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
