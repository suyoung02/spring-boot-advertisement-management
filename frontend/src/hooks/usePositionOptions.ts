import {
  getAllAdsForm,
  getAllLocationType,
  getAllPlanningStatus,
} from '@/apis/ads';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const usePositionOptions = () => {
  const locationTypeQuery = useQuery({
    queryKey: ['getAllLocationType'],
    queryFn: () => getAllLocationType(),
  });

  const positionStatusQuery = useQuery({
    queryKey: ['getAllPlanningStatus'],
    queryFn: () => getAllPlanningStatus(),
  });

  const adsFormQuery = useQuery({
    queryKey: ['getAllAdsForm'],
    queryFn: () => getAllAdsForm(),
  });

  const positionStatus = useMemo(() => {
    return positionStatusQuery.data?.map((data) => {
      return {
        value: data.title,
        label: data.title,
        ...data,
      };
    });
  }, [positionStatusQuery.data]);

  const locationType = useMemo(() => {
    return locationTypeQuery.data?.map((data) => {
      return {
        value: data.title,
        label: data.title,
        ...data,
      };
    });
  }, [locationTypeQuery.data]);

  const adsForm = useMemo(() => {
    return adsFormQuery.data?.map((data) => {
      return {
        value: data.title,
        label: data.title,
        ...data,
      };
    });
  }, [adsFormQuery.data]);

  return {
    locationType,
    positionStatus,
    adsForm,
  };
};

export default usePositionOptions;
