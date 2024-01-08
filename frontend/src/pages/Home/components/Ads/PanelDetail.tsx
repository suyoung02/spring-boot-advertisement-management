import { classNames } from '@/utils/classNames';
import { Button, Drawer } from '@mantine/core';
import {
  IconAdCircleFilled,
  IconAlertOctagonFilled,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { POSITION_MOCK } from './PositionDetail';

type Props = {
  opened: boolean;
  onClose: () => void;
  onReport?: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const PANEL_MOCK = {
  address: POSITION_MOCK.address,
  ads_type: 'Trụ bảng hiflex',
  size: '2.5m * 1.5m',
  location_type: POSITION_MOCK.location_type,
  ads_form: POSITION_MOCK.ads_form,
  quantity: '1 trụ/bảng',
  contract_expiration: new Date(),
  photo: POSITION_MOCK.photo,
};

const PanelDetail = ({ opened, onClose, onReport }: Props) => {
  return (
    <Drawer
      size="lg"
      position="right"
      opened={opened}
      onClose={onClose}
      title="Chi tiết bảng quảng cáo"
    >
      <div
        className={classNames(
          'pl-3 pr-4 py-4 gap-2 rounded-xl bg-red-100 text-red-600 flex',
        )}
      >
        <div className="w-6">
          <IconAdCircleFilled />
        </div>
        <div className="flex flex-col">
          <div className="font-bold">Thông tin quảng cáo</div>
          <div className="font-medium text-lg">{PANEL_MOCK.ads_type}</div>
          <div className="font-medium mb-2">{PANEL_MOCK.address}</div>
          <div className="text-base">
            Kích thước: <span className="font-medium">{PANEL_MOCK.size}</span>
          </div>
          <div className="text-base">
            Số lượng: <span className="font-medium">{PANEL_MOCK.quantity}</span>
          </div>
          <div className="text-base">
            Hình thức:{' '}
            <span className="font-medium">{PANEL_MOCK.ads_form}</span>
          </div>
          <div className="text-base">
            Phân loại:{' '}
            <span className="font-medium">{PANEL_MOCK.location_type}</span>
          </div>
          <div className="text-base">
            Ngày hết hạn:{' '}
            <span className="font-medium">
              {dayjs(PANEL_MOCK.contract_expiration).format(
                'DD/MM/YYYY - HH:mm',
              )}
            </span>
          </div>

          <img alt="photo" src={PANEL_MOCK.photo} className="w-full h-auto" />
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
    </Drawer>
  );
};

export default PanelDetail;
