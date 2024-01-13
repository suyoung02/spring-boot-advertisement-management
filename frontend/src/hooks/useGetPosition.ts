import { getAllAdsPosition } from '@/apis/position';
import { useQuery } from '@tanstack/react-query';

const useGetPosition = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllAdsPosition'],
    queryFn: () => getAllAdsPosition(),
  });

  return { data, isLoading, refetch };
};

export default useGetPosition;