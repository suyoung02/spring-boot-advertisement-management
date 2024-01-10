export type ProfileState = {
  report: Report;
  reportForm: ReportForm;
  state: ReportForm;
  adsPosition: AdsPosition;
  adsPanel: AdsPanel;
};

export type AdsPanel = {
  id: number;
  ads_type: string;
  size: string;
  contract_expiration: Date;
  ads_position: number;
};

export type AdsPosition = {
  id: number;
  name: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  location_type: string;
  ads_form: string;
  planning_status: string;
  photo: string;
  place_id: string;
  latitude: number;
  longitude: number;
  is_actived: string;
};

export type Report = {
  id: number;
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
  adsPanel: number;
  adsPosition: number;
};

export type ReportForm = {
  title: string;
  color: string;
  icon: string;
};
