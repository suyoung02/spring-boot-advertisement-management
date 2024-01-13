import { getDetailReport, updateReport } from '@/apis/report';
import { ReportStatus } from '@/types/enum';
import { getFullAddress } from '@/utils/location';
import { Button, Drawer, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type Props = {
  opened: boolean;
  onClose: () => void;
  reportId: number;
};

const ReportDetail = ({ opened, onClose, reportId }: Props) => {
  const { data } = useQuery({
    queryKey: ['getDetailReport', reportId],
    queryFn: () => getDetailReport(reportId),
  });

  const [solving, setSolving] = useState('');

  useEffect(() => {
    setSolving(data?.report.solving || '');
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateReport({
        id: reportId,
        solving,
        processingStatus: ReportStatus.SOLVED,
      }),
    onSuccess: () => {
      notifications.show({ message: 'Cập nhật thành công' });
    },
    onError: () => {
      notifications.show({
        color: 'res',
        message: 'Có lỗi xảy ra vui lòng thử lại',
      });
    },
  });

  const handleUpdate = () => {
    mutate();
  };

  return (
    <Drawer
      position="right"
      title="Chi tiết report"
      size="lg"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-xl shadow flex flex-col gap-1">
          <div>Họ và tên: {data?.report.fullName}</div>
          <div>Email: {data?.report.email}</div>
          <div>Số điện thoại: {data?.report.phoneNumber}</div>
        </div>
        {data?.adsPosition && (
          <div className="p-4 rounded-xl shadow flex flex-col gap-1">
            <div>Tên điểm quảng cáo: {data.adsPosition.name}</div>
            <div>Hình thức quảng cáo: {data.adsPosition.ads_form}</div>
            <div>Loại vị trí: {data.adsPosition.location_type}</div>
            <div>Tình trạng: {data.adsPosition.planning_status}</div>
            <div>Địa chỉ: {getFullAddress(data.adsPosition)}</div>
          </div>
        )}
        {data?.adsPanel && (
          <div className="p-4 rounded-xl shadow flex flex-col gap-1">
            <div>Loại quảng cáo: {data.adsPanel.ads_type}</div>
            <div>Kích thước: {data.adsPanel.size}</div>
            <div>
              Nội dung:
              <div
                dangerouslySetInnerHTML={{ __html: data.adsPanel.content }}
              ></div>
            </div>
          </div>
        )}
        <div>
          Hình thức báo cáo: <b>{data?.reportForm.title}</b>
        </div>
        <div>
          <div>Nội dung: </div>
          <div
            dangerouslySetInnerHTML={{ __html: data?.report.content || '' }}
          ></div>
        </div>
        <div className="flex gap-1">
          {data?.report.image1 && (
            <img className="flex-1 w-full h-auto" src={data?.report.image1} />
          )}
          {data?.report.image2 && (
            <img className="flex-1 w-full h-auto" src={data?.report.image2} />
          )}
        </div>
        <div>
          Cách giải quyết:
          <Textarea
            value={solving}
            placeholder="Giải quyết báo cáo"
            onChange={(e) => setSolving(e.target.value)}
          />
        </div>
        <Button loading={isPending} disabled={!solving} onClick={handleUpdate}>
          {data?.report.solving ? 'Phản hồi' : 'Cập nhật phản hồi'}
        </Button>
      </div>
    </Drawer>
  );
};

export default ReportDetail;
