/* eslint-disable react-refresh/only-export-components */
import { classNames } from '@/utils/classNames';
import { Button, Drawer } from '@mantine/core';
import {
  IconAlertCircle,
  IconAlertOctagonFilled,
  IconCheck,
  IconInfoCircleFilled,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

type Props = {
  opened: boolean;
  onClose: () => void;
  onViewPanel?: () => void;
  onReport?: () => void;
};

export const POSITION_MOCK = {
  name: 'Tên địa điểm',
  address: '50 Tôn thất đạm, Phường nguyễn thái học, Quận 1, TP Hồ chí minh',
  ward: 'Phường nguyễn thái học',
  district: 'Quận 1',
  location_type: 'Đất công/Công viên/Hành lang an toàn giao thông',
  ads_form: 'Cổ động chính trị',
  photo:
    'https://kenh14cdn.com/thumb_w/640/pr/2023/photo1690512826899-169051282719950251601-63826136671078.jpg',
  planning_status: 'Đã quy hoạch',
};

export const PANEL_MOCK = [
  {
    address: POSITION_MOCK.address,
    ads_type: 'Trụ bảng hiflex',
    size: '2.5m * 1.5m',
    location_type: POSITION_MOCK.location_type,
    ads_form: POSITION_MOCK.ads_form,
    quantity: '1 trụ/bảng',
    contract_expiration: new Date(),
  },
  {
    address: POSITION_MOCK.address,
    ads_type: 'Trụ bảng hiflex',
    size: '2.5m * 1.5m',
    location_type: POSITION_MOCK.location_type,
    ads_form: POSITION_MOCK.ads_form,
    quantity: '1 trụ/bảng',
    contract_expiration: new Date(),
  },
];

const PositionDetail = ({ onClose, onViewPanel, onReport, opened }: Props) => {
  return (
    <Drawer
      size="lg"
      position="right"
      opened={opened}
      onClose={onClose}
      title="Chi tiết điểm đặt quảng cáo"
    >
      <div className="flex flex-col gap-4">
        <div
          className={classNames(
            'pl-3 pr-4 py-4 gap-2 rounded-xl bg-red-100 text-red-600 flex',
          )}
        >
          <div className="w-6">
            <IconCheck />
          </div>
          <div className="flex flex-col">
            <div className="font-bold">
              Thông tin địa điểm - {POSITION_MOCK.ads_form}
            </div>
            <div className="font-medium text-lg">{POSITION_MOCK.name}</div>
            <div className="text-sm">{POSITION_MOCK.address}</div>
            <div className="text-sm">{POSITION_MOCK.location_type}</div>
            <div className="uppercase font-bold my-1">
              {POSITION_MOCK.planning_status}
            </div>
            <img
              alt="photo"
              src={POSITION_MOCK.photo}
              className="w-full h-auto"
            />
            <Button
              onClick={onReport}
              className="self-end mt-4"
              color="red"
              leftSection={<IconAlertOctagonFilled />}
            >
              Báo cáo vi phạm
            </Button>
          </div>
        </div>
        {!PANEL_MOCK.length && (
          <div className="p-4 rounded-xl bg-blue-100 text-blue-600 flex gap-2">
            <IconAlertCircle />
            <div className="flex flex-col">
              <div className="font-bold">Thông tin quảng cáo</div>
              <div className="font-medium">Chưa có dữ liệu</div>
              <div className="text-sm">Vui lòng chọn địa điểm khác</div>
            </div>
          </div>
        )}
        {PANEL_MOCK.map((panel, index) => (
          <div key={index} className="p-4 rounded-xl border flex gap-2">
            <div className="w-6">
              <IconAlertCircle size={24} />
            </div>
            <div className="flex flex-col">
              <div className="font-bold">
                Thông tin quảng cáo - {panel.ads_type}
              </div>
              <div className="font-medium mb-2">{panel.address}</div>
              <div className="text-base">
                Kích thước: <span className="font-medium">{panel.size}</span>
              </div>
              <div className="text-base">
                Số lượng: <span className="font-medium">{panel.quantity}</span>
              </div>
              <div className="text-base">
                Hình thức: <span className="font-medium">{panel.ads_form}</span>
              </div>
              <div className="text-base">
                Phân loại:{' '}
                <span className="font-medium">{panel.location_type}</span>
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
                  onClick={onViewPanel}
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
    </Drawer>
  );
};

export default PositionDetail;
