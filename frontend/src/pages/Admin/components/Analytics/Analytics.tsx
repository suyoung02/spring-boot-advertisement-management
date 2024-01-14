import { getAllAdsPosition, getAllPresentingPanel } from '@/apis/position';
import { getAllReport } from '@/apis/report';
import useLocationOptions from '@/hooks/useLocationOptions';
import { useUserStore } from '@/stores/user';
import { IS_ACTIVE, ReportStatus, Role } from '@/types/enum';
import { Card, MultiSelect, Progress, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

const Analytics = () => {
  const user = useUserStore.use.user();

  const { districts } = useLocationOptions({ district: user?.district });

  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      user.district && setSelectedDistricts([user.district]);
      user.ward && setSelectedWards([`${user.district}_${user.ward}`]);
    }
  }, [user]);

  const wards = useMemo(() => {
    const len = selectedDistricts.length;
    return (
      districts
        .find((district) => district.value === selectedDistricts[len - 1])
        ?.wards.map((ward) => ({
          value: `${ward.name}_${selectedDistricts[len - 1]}`,
          label: ward.name,
          district: selectedDistricts[len - 1],
        })) || []
    );
  }, [districts, selectedDistricts]);

  const { data: allPos } = useQuery({
    queryKey: ['getAllAdsPosition'],
    queryFn: () => getAllAdsPosition(),
  });

  const { data: allReport } = useQuery({
    queryKey: ['getAllReport'],
    queryFn: () => getAllReport(),
  });

  const { data: allPanel } = useQuery({
    queryKey: ['getAllPresentingPanel'],
    queryFn: () => getAllPresentingPanel(),
  });

  const filterPanel = useMemo(() => {
    return allPanel?.filter((panel) => {
      const isIncludeDistrict = selectedDistricts.length
        ? selectedDistricts.includes(panel.adsPosition.district)
        : true;

      const filterWards = selectedWards.filter((ward) => {
        const [, district] = ward.split('_');
        return district === panel.adsPosition.district;
      });

      const isIncludeWard = filterWards.length
        ? filterWards
            .map((ward) => {
              const [_ward] = ward.split('_');
              return _ward;
            })
            .includes(panel.adsPosition.ward)
        : true;

      return isIncludeDistrict && isIncludeWard;
    });
  }, [allPanel, selectedDistricts, selectedWards]);

  const filterData = useMemo(() => {
    return allPos?.filter((pos) => {
      const isIncludeDistrict = selectedDistricts.length
        ? selectedDistricts.includes(pos.adsPosition.district)
        : true;

      const filterWards = selectedWards.filter((ward) => {
        const [, district] = ward.split('_');
        return district === pos.adsPosition.district;
      });

      const isIncludeWard = filterWards.length
        ? filterWards
            .map((ward) => {
              const [_ward] = ward.split('_');
              return _ward;
            })
            .includes(pos.adsPosition.ward)
        : true;

      return isIncludeDistrict && isIncludeWard;
    });
  }, [allPos, selectedDistricts, selectedWards]);

  const filterReport = useMemo(() => {
    return allReport?.filter((report) => {
      const isIncludeDistrict = selectedDistricts.length
        ? selectedDistricts.includes(report.adsPosition.district)
        : true;

      const filterWards = selectedWards.filter((ward) => {
        const [, district] = ward.split('_');
        return district === report.adsPosition.district;
      });

      const isIncludeWard = filterWards.length
        ? filterWards
            .map((ward) => {
              const [_ward] = ward.split('_');
              return _ward;
            })
            .includes(report.adsPosition.ward)
        : true;

      return isIncludeDistrict && isIncludeWard;
    });
  }, [allPos, selectedDistricts, selectedWards]);

  const position =
    filterData && allPos ? (filterData.length * 100) / allPos.length : 100;

  const panel =
    filterPanel && allPanel
      ? (filterPanel.length * 100) / allPanel.length
      : 100;

  const report =
    filterReport && allReport
      ? (filterReport.length * 100) / allReport.length
      : 100;

  const reportData = [
    ReportStatus.IN_PROGRESS,
    ReportStatus.CANCEL,
    ReportStatus.SOLVED,
  ].map((state) => ({
    name: state,
    data:
      filterReport?.filter((report) => report.report.state === state).length ||
      0,
  }));

  const status = allPanel?.map((panel) => panel.contract.state);

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex gap-4 w-full">
        <MultiSelect
          data={districts}
          value={selectedDistricts}
          className="w-1/4"
          disabled={user?.role !== Role.VHTT}
          readOnly={user?.role !== Role.VHTT}
          placeholder="Chọn quận"
          onChange={setSelectedDistricts}
        />
        <MultiSelect
          data={wards}
          value={selectedWards}
          className="w-3/4"
          readOnly={user?.role === Role.WARD}
          disabled={user?.role === Role.WARD}
          placeholder="Chọn phường"
          onChange={setSelectedWards}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card withBorder radius="md" p="xl">
          <Text fz="xs" tt="uppercase" fw={700}>
            Số lượng vị trí
          </Text>
          <Text fz="lg" fw={500}>
            {filterData?.length} / {allPos?.length}
          </Text>
          <Progress value={position} mt="md" size="lg" radius="xl" />
          <div className="mt-3">
            <div>
              Đang hoạt động:{' '}
              {filterData?.filter(
                (data) => data.adsPosition.is_actived === IS_ACTIVE.TRUE,
              ).length || 0}
            </div>
            <div>
              Chưa hoạt động:{' '}
              {filterData?.filter(
                (data) => data.adsPosition.is_actived === IS_ACTIVE.FALSE,
              ).length || 0}
            </div>
          </div>
        </Card>
        <Card withBorder radius="md" p="xl">
          <Text fz="xs" tt="uppercase" fw={700}>
            Số lượng báo cáo
          </Text>
          <Text fz="lg" fw={500}>
            {filterReport?.length} / {allReport?.length}
          </Text>
          <Progress value={report} mt="md" size="lg" radius="xl" color="pink" />
          <div className="mt-3">
            {reportData.map((data) => (
              <div key={data.name} className="flex gap-3">
                <div>{data.name}:</div>
                <div>{data.data}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card withBorder radius="md" p="xl">
          <Text fz="xs" tt="uppercase" fw={700}>
            Số lượng quảng cáo
          </Text>
          <Text fz="lg" fw={500}>
            {filterPanel?.length} / {allPanel?.length}
          </Text>
          <Progress value={panel} mt="md" size="lg" radius="xl" color="cyan" />
          <div className="mt-3">
            {status?.map((state) => (
              <div key={state} className="flex gap-3">
                <div>{state}:</div>
                <div>
                  {filterPanel?.filter(
                    (panel) => panel.contract.state === state,
                  ).length || 0}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
