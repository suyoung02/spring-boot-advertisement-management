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

export type Panel = {
  id: number;
  ads_type: AdsType;
  size: string;
  contract_expiration: Date;
  ads_position: number;
  quantity: number;
  ads_form: AdsForm;
  loaction_type: LocationType;
  address: string;
  photo: string;
};

export type Position = {
  adsPosition: AdsPosition;
  locationType: AdsForm;
  adsForm: AdsForm;
  planningStatus: AdsForm;
};

export type AdsPosition = {
  id: number;
  name: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  locationType: string;
  adsForm: string;
  planningStatus: string;
  photo: string;
  placeID: string;
  latitude: number;
  longitude: number;
  isactived: string;
};
