import { Button, Drawer } from '@mantine/core';
import { IconAlertCircle, IconMapPinFilled } from '@tabler/icons-react';

type Props = {
  place: google.maps.places.PlaceResult;
  onClose: () => void;
  opened: boolean;
  onAddPosition?: () => void;
};

const PlaceDetail = ({ place, onClose, opened, onAddPosition }: Props) => {
  return (
    <Drawer
      size="lg"
      position="right"
      opened={opened}
      onClose={onClose}
      title="Chi tiết vị trí"
    >
      <div className="p-4 rounded-xl bg-blue-100 text-blue-600 flex gap-2">
        <IconAlertCircle />
        <div className="flex flex-col">
          <div className="font-bold">Thông tin điểm quảng cáo</div>
          <div className="font-medium">Chưa có dữ liệu</div>
          <div className="text-sm">Vui lòng chọn địa điểm khác</div>
        </div>
      </div>
      <div className="p-4 mt-4 rounded-xl bg-teal-50 border-teal-500 text-teal-700 border flex gap-2">
        <div className="w-6">
          <IconMapPinFilled size={24} />
        </div>
        <div className="flex flex-col">
          <div className="font-bold">Thông tin địa điểm</div>
          <div className="font-medium">{place.name}</div>
          <div className="text-sm">{place.formatted_address}</div>
          <div className="text-sm">{place.formatted_phone_number}</div>
          <div className="w-full">
            <img
              alt="photo"
              src={place.photos?.[0].getUrl()}
              className="w-full h-auto"
            />
          </div>
          <Button onClick={onAddPosition} color="teal" className="w-full mt-4">
            Tạo vị trí
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default PlaceDetail;
