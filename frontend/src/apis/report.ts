import { Report, ReportForm } from '@/types/report';
import { API_URL } from '@/utils/env';
import { apiDelete, apiGet, apiPost, apiPut } from './api';

export type CreateReportRequest = {
  reportForm: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  content: string;
  state: string;
  deviceId: string;
  image1: string;
  image2: string;
  solving: string;
  adsPanel?: number;
  adsPosition?: number;
  token: string;
};

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

export type UpdateReportType = {
  id: number;
  solving: string;
  processingStatus: string;
};

export const updateReport = async ({ id, ...data }: UpdateReportType) => {
  try {
    const res = await apiPut<
      Omit<UpdateReportType, 'id'>,
      ApiDataResponse<Report>
    >(API_URL + `/report/${id}`, data);

    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getDetailReport = async (id: number) => {
  try {
    const res = await apiGet<null, ApiDataResponse<Report>>(
      API_URL + `/report/all/get-detail/${id}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getReportDetail = async (id: string) => {
  try {
    const res = await apiGet<null, ApiDataResponse<Report>>(
      API_URL + `/report/all/get-detail/${id}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getAllReport = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<Report[]>>(
      API_URL + `/report/all/get-all`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};

export const getAllReportType = async () => {
  try {
    const res = await apiGet<null, ApiDataResponse<ReportForm[]>>(
      API_URL + '/report-form',
    );
    return res.data;
  } catch {
    return null;
  }
};

export const addReportType = async (data: ReportForm) => {
  try {
    const res = await apiPost<ReportForm, ApiDataResponse<ReportForm[]>>(
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
  reportType: ReportForm;
};

export const updateReportType = async ({
  title,
  reportType,
}: UpdateReportTypeRequest) => {
  try {
    const res = await apiPost<ReportForm, ApiDataResponse<ReportForm[]>>(
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
    const res = await apiDelete<null, ApiDataResponse<ReportForm[]>>(
      API_URL + `/report-form/${title}`,
    );
    return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    throw new Error(e.response.data.error_description);
  }
};
