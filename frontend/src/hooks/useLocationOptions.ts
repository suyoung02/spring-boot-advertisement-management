import { getLocationApi } from '@/apis/location';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type Params = {
  district?: string;
};

export const CITY = 'Thành phố Hồ Chí Minh';

const useLocationOptions = ({ district }: Params) => {
  const { data } = useQuery({
    queryKey: ['getLocationApi', 3],
    queryFn: () => getLocationApi(3),
    staleTime: Infinity,
  });

  const rawData = useMemo(() => {
    return data?.find((city) => city.name === CITY);
  }, [data]);

  const districts = useMemo(() => {
    return (
      rawData?.districts?.map((district) => ({
        value: district.name,
        label: district.name,
        wards: district.wards || [],
      })) || []
    );
  }, [rawData]);

  const wards = useMemo(() => {
    return (
      districts
        ?.find((d) => d.value === district)
        ?.wards.map((ward) => ({
          value: ward.name,
          label: ward.name,
        })) || []
    );
  }, [districts, district]);

  return { wards, districts, cities: [{ value: CITY, label: CITY }] };
};
export default useLocationOptions;
