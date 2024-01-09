import { Position } from '@/types/ads';

export const CURRENT_LOCATION = {
  lat: 10.762622,
  lng: 106.660172,
};

export const getFullAddress = (position: Position['adsPosition']) => {
  return [
    position.address,
    position.ward,
    position.district,
    position.province,
  ].join(', ');
};
