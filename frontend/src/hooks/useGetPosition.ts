import { getAllAdsPosition } from '@/apis/position';
import { useUserStore } from '@/stores/user';
import { Position } from '@/types/ads';
import { IS_ACTIVE } from '@/types/enum';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const useGetPosition = (filter: string) => {
  const user = useUserStore.use.user();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllAdsPosition'],
    queryFn: () => getAllAdsPosition(),
  });

  const filterData = useMemo(() => {
    return data?.reduce((positions: Position[], pos: Position) => {
      if (!user && pos.adsPosition.is_actived === IS_ACTIVE.FALSE)
        return positions;
      const panel = pos.panelDetails.filter((panel) =>
        !user ? panel.contract.state === 'Đang hiện diện' : true,
      );
      if (filter === 'Chưa báo cáo' && pos.isReported) return positions;
      if (filter === 'Đã báo cáo' && !pos.isReported) return positions;
      return [...positions, { ...pos, panelDetails: panel }];
    }, []);
  }, [data, filter]);

  return { data: filterData, isLoading, refetch };
};

export default useGetPosition;
