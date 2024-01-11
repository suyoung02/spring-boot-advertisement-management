import { getAllPresentingPanel } from '@/apis/position';
import { useQuery } from '@tanstack/react-query';

const useGetPosition = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllPresentingPanel'],
    queryFn: () => getAllPresentingPanel(),
  });

  return { data, isLoading, refetch };
};

export default useGetPosition;
