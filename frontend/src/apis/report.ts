import { Report, ReportType } from '@/types/report';
import { API_URL } from '@/utils/env';
import { apiDelete, apiGet, apiPost } from './api';

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

export const getAllReportType = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<ReportType[]>>(
      API_URL + '/report-form',
    );
    return res.data;
  } catch {
    return null;
  }
};

export const addReportType = async (data: ReportType) => {
  try {
    const res = await apiPost<ReportType, ApiDataResponse<ReportType[]>>(
      API_URL + '/report-form',
      data,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export type UpdateReportTypeRequest = {
  title: string;
  reportType: ReportType;
};

export const updateReportType = async ({
  title,
  reportType,
}: UpdateReportTypeRequest) => {
  try {
    const res = await apiPost<ReportType, ApiDataResponse<ReportType[]>>(
      API_URL + `/report-form/${title}`,
      reportType,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const deleteReportType = async (title: string) => {
  try {
    const res = await apiDelete<null, ApiDataResponse<ReportType[]>>(
      API_URL + `/report-form/${title}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
