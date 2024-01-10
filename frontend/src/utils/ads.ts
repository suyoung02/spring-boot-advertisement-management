import { LocationType, PositionStatus } from '@/types/enum';

export const positionStatusColors: Record<string, string> = {
  [PositionStatus.ACTIVE]: 'cyan',
  [PositionStatus.DEACTIVE]: 'pink',
  [PositionStatus.IN_PROGRESS]: 'blue',
  [PositionStatus.NOT_YET]: 'yellow',
};

export const positionStatusTitle: Record<string, string> = {
  [PositionStatus.ACTIVE]: 'Đã quy hoạch',
  [PositionStatus.DEACTIVE]: 'Không hoạt động',
  [PositionStatus.IN_PROGRESS]: 'Đang quy hoạch',
  [PositionStatus.NOT_YET]: 'Chưa quy hoạch',
};

export const locationTypeTitle: Record<string, string> = {
  [LocationType.PUBLIC_LAND]: 'Đất công',
  [LocationType.PRIVATE_LAND]: 'Đất tư nhân',
  [LocationType.BUS_SHELTER]: 'Nhà chờ xe buýt',
  [LocationType.GAS_STATION]: 'Cây Xăng',
  [LocationType.SHOPPING_CENTER]: 'Trung tâm thương mại',
  [LocationType.HOUSE]: 'Nhà dân',
  [LocationType.MARKET]: 'Chợ',
  [LocationType.PARK]: 'Công viên',
};
