import { locationTypeTitle, positionStatusTitle } from '@/utils/ads';
import { useMemo } from 'react';

const usePositionOptions = () => {
  const locationType = useMemo(() => {
    return Object.keys(locationTypeTitle).map((key) => {
      return { value: key, label: locationTypeTitle[key] };
    });
  }, []);

  const positionStatus = useMemo(() => {
    return Object.keys(positionStatusTitle).map((key) => {
      return {
        value: key,
        label: positionStatusTitle[key],
        description: positionStatusTitle[key],
      };
    });
  }, []);

  return { locationType, positionStatus };
};

export default usePositionOptions;
