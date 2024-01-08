import type { LocationType, PositionStatus } from './enum';

export type Ads = {
  title: string;
};

export type Position = {
  id: number;
  address: string;
  ward: string;
  district: string;
  province: string;
  location_type: LocationType;
  ads_form: string;
  planning_status: PositionStatus;
  name: string;
  photo: string;
};

export type Panel = {
  id: number;
  ads_type: string;
  size: string;
  contract_expiration: Date;
  ads_position: number;
  quantity: number;
  ads_form: string;
  loaction_type: string;
  address: string;
  photo: string;
};
