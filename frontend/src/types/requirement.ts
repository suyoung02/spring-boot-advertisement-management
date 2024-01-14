import { RequirementStatus } from './enum';

export type RequirementPanel = {
  id: number;
  new_info: string;
  time_submit: Date;
  reason: string;
  status: RequirementStatus;
  staff: number;
  ads_panel: number;
  ads_position?: number;
};

export type RequirementPosition = {
  id: number;
  new_info: string;
  time_submit: Date;
  reason: string;
  status: RequirementStatus;
  staff: number;
  ads_position: number;
  ads_panel?: number;
};
