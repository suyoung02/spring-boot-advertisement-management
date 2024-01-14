import { getDetailAdsPanel } from '@/apis/position';
import { RequestUpdatePanel } from '@/components/RequestUpdate';

import { ModalName, useControlStore } from '@/stores/control';
import { useUserStore } from '@/stores/user';
import { Role } from '@/types/enum';
import { classNames } from '@/utils/classNames';
import { getFullAddress } from '@/utils/location';
import { Button, Drawer, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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

  const [openRequest, { open, close }] = useDisclosure();
  const user = useUserStore.use.user();
  const setModal = useControlStore.use.setModal();

  const handleEdit = () => {
    if (!user) return;
    user.role === Role.VHTT ? setModal(ModalName.ADD_PANEL) : open();
  };

  return (
    <>
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
            className={classNames(
              'pl-3 pr-4 py-4 gap-2 rounded-xl flex border',
            )}
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
              <div className="font-medium text-lg">
                Loại quảng cáo: {panel.adsType.title}
              </div>
              <div className="font-medium mb-2">
                {getFullAddress(panel.adsPosition)}
              </div>
              <div className="shadow px-4 py-2 rounded-xl flex flex-col gap-0.5 mb-2 text-black">
                <div className="text-base">
                  Thông tin công ty:{' '}
                  <span className="font-medium">
                    {panel.contract.enterprise_info}
                  </span>
                </div>
                <div className="text-base">
                  Email công ty:{' '}
                  <span className="font-medium">
                    {panel.contract.enterprise_email}
                  </span>
                </div>
                <div className="text-base">
                  Số điện thoại:{' '}
                  <span className="font-medium">
                    {panel.contract.enterprise_phone_number}
                  </span>
                </div>
                <div className="text-base">
                  Ngày bắt đầu:{' '}
                  <span className="font-medium">
                    {dayjs(panel.contract.contract_begin).format(
                      'DD/MM/YYYY - HH:mm',
                    )}
                  </span>
                </div>
                <div className="text-base">
                  Ngày hết hạn:{' '}
                  <span className="font-medium">
                    {dayjs(panel.contract.contract_expiration).format(
                      'DD/MM/YYYY - HH:mm',
                    )}
                  </span>
                </div>
              </div>
              <div className="text-base">
                Kích thước:{' '}
                <span className="font-medium">{panel.adsPanel.size}</span>
              </div>
              <div className="text-base">
                Hình thức:{' '}
                <span className="font-medium">
                  {panel.adsPosition.ads_form}
                </span>
              </div>
              <div className="text-base">
                Phân loại:{' '}
                <span className="font-medium">
                  {panel.adsPosition.location_type}
                </span>
              </div>
              <div>
                <div>Nội dung</div>
                <div
                  dangerouslySetInnerHTML={{ __html: panel.adsPanel.content }}
                ></div>
              </div>
              {(panel.adsImages.ads_image || panel.adsPosition.photo) && (
                <img
                  alt="photo"
                  src={panel.adsImages.ads_image || panel.adsPosition.photo}
                  className="w-full h-auto"
                />
              )}
              <div className="flex items-center mt-4 justify-between">
                {user && (
                  <Button onClick={handleEdit} leftSection={<IconPencil />}>
                    Chỉnh sửa
                  </Button>
                )}
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
      {panel && (
        <RequestUpdatePanel
          panel={panel.adsPanel.id}
          opened={openRequest}
          onClose={close}
        />
      )}
    </>
  );
};

export default PanelDetail;
