/* eslint-disable react-refresh/only-export-components */
import { getDetailAdsPosition } from '@/apis/position';
import { ModalName, useControlStore } from '@/stores/control';
import { AdsPanel } from '@/types/ads';
import { classNames } from '@/utils/classNames';
import { getFullAddress } from '@/utils/location';
import { Button, Drawer, LoadingOverlay } from '@mantine/core';
import {
  IconAlertCircle,
  IconAlertOctagonFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
  IconPencil,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

type Props = {
  opened: boolean;
  onClose: () => void;
  onViewPanel?: (panel: AdsPanel) => void;
  onReport?: () => void;
  id: number;
  place?: google.maps.places.PlaceResult;
};

const PositionDetail = ({
  id,
  onClose,
  onViewPanel,
  onReport,
  opened,
}: Props) => {
  const { data: position, isLoading } = useQuery({
    queryKey: ['getDetailAdsPosition', id],
    queryFn: () => getDetailAdsPosition(id),
  });

  const setModal = useControlStore.use.setModal();

  return (
    <Drawer
      size="lg"
      position="right"
      opened={opened}
      onClose={onClose}
      title="Chi tiết điểm đặt quảng cáo"
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {!position ? (
        <div className="p-4 rounded-xl bg-blue-100 text-blue-600 flex gap-2">
          <IconAlertCircle />
          <div className="flex flex-col">
            <div className="font-bold">Thông tin địa điểm </div>
            <div className="font-medium">Chưa có dữ liệu</div>
            <div className="text-sm">Vui lòng chọn địa điểm khác</div>
          </div>
          <Button>Tạo vị trí</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            style={{
              color: position.planningStatus.color,
              borderColor: position.planningStatus.color,
            }}
            className={classNames(
              'pl-3 pr-4 py-4 gap-2 rounded-xl text-black bg-white border flex',
            )}
          >
            <div className="w-6 h-6">
              {(
                <img
                  alt={position.planningStatus.icon}
                  className="w-full h-full object-cover"
                />
              ) && <IconCircleCheckFilled />}
            </div>
            <div className="flex flex-col w-full">
              <div className="font-bold">
                Thông tin địa điểm - {position.adsForm.title}
              </div>
              <div className="font-medium text-lg">
                {position.adsPosition.name}
              </div>
              <div className="text-sm">
                {getFullAddress(position.adsPosition)}
              </div>
              <div className="text-sm">{position.locationType.title}</div>
              <div className="uppercase font-bold my-1">
                {position.planningStatus.title}
              </div>
              {position.adsPosition.photo && (
                <img
                  alt="photo"
                  src={position.adsPosition.photo}
                  className="w-full h-auto"
                />
              )}
              <div className="flex items-center mt-4 justify-between">
                <Button
                  onClick={() => setModal(ModalName.ADD_POSITION)}
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
          {!position.panels.length && (
            <div className="p-4 rounded-xl bg-green-100 text-green-700 flex gap-3 items-center">
              <IconAlertCircle />
              <div className="flex flex-col">
                <div className="font-bold">Thông tin quảng cáo</div>
                <div className="font-medium">Chưa có dữ liệu</div>
                <div className="text-sm">Vui lòng chọn địa điểm khác</div>
              </div>
              <Button
                onClick={() => setModal(ModalName.ADD_PANEL)}
                className="ml-auto"
                color="green"
              >
                Tạo bảng quảng cáo
              </Button>
            </div>
          )}
          {position.panels.map((panel, index) => (
            <div key={index} className="p-4 rounded-xl border flex gap-2">
              <div className="w-6">
                <IconAlertCircle size={24} />
              </div>
              <div className="flex flex-col">
                <div className="font-bold">
                  Thông tin quảng cáo - {panel.ads_type}
                </div>
                <div className="font-medium mb-2">
                  {getFullAddress(position.adsPosition)}
                </div>
                <div className="text-base">
                  Kích thước: <span className="font-medium">{panel.size}</span>
                </div>
                <div className="text-base">
                  Hình thức:{' '}
                  <span className="font-medium">{position.adsForm.title}</span>
                </div>
                <div className="text-base">
                  Phân loại:{' '}
                  <span className="font-medium">
                    {position.locationType.title}
                  </span>
                </div>
                <div className="text-base">
                  Ngày hết hạn:{' '}
                  <span className="font-medium">
                    {dayjs(panel.contract_expiration).format(
                      'DD/MM/YYYY - HH:mm',
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    leftSection={<IconInfoCircleFilled />}
                    onClick={() => onViewPanel?.(panel)}
                  >
                    Thông tin
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
          ))}
        </div>
      )}
    </Drawer>
  );
};

export default PositionDetail;
