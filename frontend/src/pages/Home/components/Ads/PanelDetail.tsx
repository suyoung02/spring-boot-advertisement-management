import { getDetailAdsPanel } from '@/apis/position';
import { ModalName, useControlStore } from '@/stores/control';
import { classNames } from '@/utils/classNames';
import { getFullAddress } from '@/utils/location';
import { Button, Drawer, LoadingOverlay } from '@mantine/core';
import {
  IconAdCircleFilled,
  IconAlertCircle,
  IconAlertOctagonFilled,
  IconPencil,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

type Props = {
  opened: boolean;
  onClose: () => void;
  onReport?: () => void;
  id: number;
};

const PanelDetail = ({ id, opened, onClose, onReport }: Props) => {
  const { data: panel, isLoading } = useQuery({
    queryKey: ['getDetailAdsPanel', id],
    queryFn: () => getDetailAdsPanel(id),
  });

  const setModal = useControlStore.use.setModal();

  return (
    <Drawer
      size="lg"
      position="right"
      opened={opened}
      onClose={onClose}
      title="Chi tiết bảng quảng cáo"
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {!panel ? (
        <div className="p-4 rounded-xl bg-blue-100 text-blue-600 flex gap-2">
          <IconAlertCircle />
          <div className="flex flex-col">
            <div className="font-bold">Thông tin địa điểm </div>
            <div className="font-medium">Chưa có dữ liệu</div>
            <div className="text-sm">Vui lòng chọn địa điểm khác</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            color: panel.adsType.color,
            borderColor: panel.adsType.color,
          }}
          className={classNames('pl-3 pr-4 py-4 gap-2 rounded-xl flex border')}
        >
          <div className="w-6 h-6">
            {(
              <img
                alt={panel.adsType.icon}
                className="w-full h-full object-cover"
              />
            ) && <IconAdCircleFilled />}
          </div>
          <div className="flex flex-col">
            <div className="font-bold">Thông tin quảng cáo</div>
            <div className="font-medium text-lg">{panel.adsType.title}</div>
            <div className="font-medium mb-2">
              {getFullAddress(panel.adsPosition)}
            </div>
            <div className="text-base">
              Kích thước:{' '}
              <span className="font-medium">{panel.adsPanel.size}</span>
            </div>
            <div className="text-base">
              Hình thức:{' '}
              <span className="font-medium">{panel.adsPosition.ads_form}</span>
            </div>
            <div className="text-base">
              Phân loại:{' '}
              <span className="font-medium">
                {panel.adsPosition.location_type}
              </span>
            </div>
            <div className="text-base">
              Ngày hết hạn:{' '}
              <span className="font-medium">
                {dayjs(panel.adsPanel.contract_expiration).format(
                  'DD/MM/YYYY - HH:mm',
                )}
              </span>
            </div>
            {panel.adsPosition.photo && (
              <img
                alt="photo"
                src={panel.adsPosition.photo}
                className="w-full h-auto"
              />
            )}
            <div className="flex items-center mt-4 justify-between">
              <Button
                onClick={() => setModal(ModalName.ADD_PANEL)}
                leftSection={<IconPencil />}
              >
                Chỉnh sửa
              </Button>
              <Button
                onClick={onReport}
                color="red"
                leftSection={<IconAlertOctagonFilled />}
              >
                Báo cáo vi phạm
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default PanelDetail;
