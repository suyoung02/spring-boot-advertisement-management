import { getAllReport } from '@/apis/report';
import { getMachineId } from '@/utils/device';
import { getFullAddress } from '@/utils/location';
import { Drawer } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type Props = {
  opened: boolean;
  onClose: () => void;
};

const ReportList = ({ opened, onClose }: Props) => {
  const { data } = useQuery({
    queryKey: ['getAllReport'],
    queryFn: () => getAllReport(),
  });

  const filterData = useMemo(() => {
    return data?.filter((res) => res.report.deviceId === getMachineId());
  }, [data]);

  return (
    <Drawer size="lg" position="right" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        {!filterData?.length && <div>Chưa có dữ liệu</div>}
        {filterData?.map((report) => (
          <div key={report.report.id} className="p-4 shadow rounded-xl border">
            <div className="text-md font-medium">{report.report.state}</div>
            <div>Hình thức: {report.reportForm.title}</div>
            <div>Điểm quảng cáo: {getFullAddress(report.adsPosition)}</div>
            <div>
              Nội dung quảng cáo:{' '}
              <div
                dangerouslySetInnerHTML={{ __html: report.adsPanel?.content }}
              ></div>
            </div>
            <div>
              Nội dung báo cáo:
              <div
                dangerouslySetInnerHTML={{ __html: report.report?.content }}
              ></div>
            </div>
            <div className="flex">
              {[report.report.image1, report.report.image2]
                .filter((img) => !!img)
                .map((img) => (
                  <div key={img} className="flex-1 max-h-[200px]">
                    <img src={img} className="w-full h-full object-contain" />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default ReportList;
