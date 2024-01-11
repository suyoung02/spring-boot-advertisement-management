import { IS_ACTIVE } from './enum';

export type AdsType = {
  title: string;
  color: string;
  icon: string;
};

export type AdsForm = {
  title: string;
  color: string;
  icon: string;
};

export type LocationType = {
  title: string;
  color: string;
  icon: string;
};

export type PlanningStatus = {
  title: string;
  color: string;
  icon: string;
};

export type Position = {
  adsPosition: AdsPosition;
  locationType: AdsForm;
  adsForm: AdsForm;
  planningStatus: AdsForm;
  panels: AdsPanel[];
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
  isactived: IS_ACTIVE;
};

export type Panel = {
  adsPanel: AdsPanel;
  adsType: AdsType;
  adsPosition: AdsPosition;
};

export type AdsPanel = {
  id: number;
  ads_type: string;
  size: string;
  contract_expiration: Date;
  ads_position: number;
};

export type Contract = {
  id: number;
  enterprise_info: string;
  enterprise_email: string;
  enterprise_phone_number: string;
  contract_begin: Date;
  contract_expiration: Date;
  ads_panel: number;
  state: string;
  staff: number;
};

export type PresentingPanel = Position & { contract: Contract };
