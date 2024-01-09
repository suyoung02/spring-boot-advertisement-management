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
  id: number;
  address: string;
  ward: string;
  district: string;
  province: string;
  location_type: LocationType;
  ads_form: string;
  planning_status: PlanningStatus;
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
