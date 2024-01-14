import { getAllReport } from '@/apis/report';
import useLocationOptions from '@/hooks/useLocationOptions';
import { useUserStore } from '@/stores/user';
import { Role } from '@/types/enum';
import { getFullAddress } from '@/utils/location';
import { Badge, MultiSelect, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import ReportDetail from './ReportDetail';

const ManageReport = () => {
  const user = useUserStore.use.user();

  const { districts } = useLocationOptions({ district: user?.district });

  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      user.district && setSelectedDistricts([user.district]);
      user.ward && setSelectedWards([`${user.ward}_${user.district}`]);
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllReport'],
    queryFn: () => getAllReport(),
  });

  const filterData = useMemo(() => {
    return data?.filter((report) => {
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
  }, [data, selectedDistricts, selectedWards]);

  const [reportId, setReportId] = useState<number | null>(null);

  return (
    <div className="p-8 pt-6">
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
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[200px]">Họ và tên</Table.Th>
              <Table.Th className="w-[300px]">Nội dung</Table.Th>
              <Table.Th className="w-[300px]">Hình thức báo cáo</Table.Th>
              <Table.Th className="w-[200px]">Địa chỉ</Table.Th>
              <Table.Th className="w-[100px]">Loại vị trí</Table.Th>
              <Table.Th>Tình trạng</Table.Th>
              <Table.Th className="w-[50px]">Hình thức quảng cáo</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!isLoading && !filterData?.length && (
              <Table.Tr>
                <Table.Td className="text-center" colSpan={7}>
                  <Text fz="sm">Chưa có dữ liệu</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {isLoading &&
              [1, 2, 3, 4, 5].map((index) => (
                <Table.Tr key={index}>
                  <Table.Td colSpan={7}>
                    <div className="h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                </Table.Tr>
              ))}

            {filterData?.map((item) => (
              <Table.Tr key={item.report.id}>
                <Table.Td
                  className="cursor-pointer w-[50px]"
                  onClick={() => setReportId(item.report.id)}
                >
                  <Text fz="sm">{item.report.fullName}</Text>
                </Table.Td>
                <Table.Td
                  className="cursor-pointer w-[50px]"
                  onClick={() => setReportId(item.report.id)}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: item.report.content }}
                  ></div>
                </Table.Td>
                <Table.Td
                  className="cursor-pointer w-[200px]"
                  onClick={() => setReportId(item.report.id)}
                >
                  <Text
                    title={getFullAddress(item.adsPosition)}
                    fz="sm"
                    lineClamp={2}
                    className="text-ellipsis"
                  >
                    {getFullAddress(item.adsPosition)}
                  </Text>
                </Table.Td>
                <Table.Td
                  className="cursor-pointer"
                  onClick={() => setReportId(item.report.id)}
                >
                  <Text fz="sm">{item.adsPosition.ads_form}</Text>
                </Table.Td>
                <Table.Td
                  className="w-[150px] cursor-pointer"
                  onClick={() => setReportId(item.report.id)}
                >
                  <Text fz="sm">{item.adsPosition.location_type}</Text>
                </Table.Td>
                <Table.Td
                  className="cursor-pointer"
                  onClick={() => setReportId(item.report.id)}
                >
                  {item.report.state}
                </Table.Td>
                <Table.Td
                  className="cursor-pointer"
                  onClick={() => setReportId(item.report.id)}
                >
                  <Badge color={item.reportForm.color} variant="outline">
                    {item.reportForm.title}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {reportId && (
        <ReportDetail
          opened
          onClose={() => {
            refetch();
            setReportId(null);
          }}
          reportId={reportId}
        />
      )}
    </div>
  );
};

export default ManageReport;
