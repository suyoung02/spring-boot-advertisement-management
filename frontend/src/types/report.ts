import { AdsPanel, AdsPosition } from './ads';
import { ReportStatus } from './enum';

export type Report = {
  reportForm: ReportForm;
  adsPanel: AdsPanel;
  adsPosition: AdsPosition;
  report: AdsReport;
};

export type AdsReport = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  content: string;
  state: ReportStatus;
  deviceId: string;
  image1: string;
  image2: string;
  solving: string;
  reportForm: string;
  adsPanel: number;
  adsPosition: 3;
};

export type ReportForm = {
  title: string;
  color: string;
  icon: string;
};
