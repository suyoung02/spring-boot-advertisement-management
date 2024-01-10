import { getAllAdsType } from '@/apis/ads';
import { addAdsPosition } from '@/apis/position';
import { getLocationApi } from '@/apis/location';
import { useForm } from '@/hooks/useForm';
import usePositionOptions from '@/hooks/usePositionOptions';
import { Position } from '@/types/ads';
import { LocationType, PositionStatus } from '@/types/enum';
import { CURRENT_LOCATION } from '@/utils/location';
import { Button, Drawer, Select, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import PlaceSelect, { Place } from './PlaceSelect';

type Props = {
  position?: Position;
  opened: boolean;
  onClose: () => void;
  onChangeLocation?: (location: { lat: number; lng: number }) => void;
};

const CITY = 'Thành phố Hồ Chí Minh';

export type AddAdsPositionForm = {
  address: string;
  ward: string;
  district: string;
  province: string;
  location_type: string;
  ads_form: string;
  planning_status: string;
  place_id: string;
};

const AddPosition = ({
  opened,
  position,
  onClose,
  onChangeLocation,
}: Props) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const { data } = useQuery({
    queryKey: ['getLocationApi', 3],
    queryFn: () => getLocationApi(3),
    staleTime: Infinity,
  });

  const { fields, onChangeField, onError, error } = useForm<AddAdsPositionForm>(
    {
      defaultState: {
        province: position?.province || CITY,
        ward: position?.ward || '',
        district: position?.district || '',
        location_type: position?.location_type || LocationType.PUBLIC_LAND,
        planning_status: position?.planning_status || PositionStatus.NOT_YET,
        ads_form: position?.ads_form || '',
        address: position?.address || '',
        place_id: '',
      },
      validate: {
        ward: ({ value, formValue }) => {
          return districts
            .find((d) => d.value === formValue?.district)
            ?.wards.find((w) => w.name === value)
            ? null
            : 'Phường không hợp lệ';
        },
      },
      config: {
        ward: { required: true },
        district: { required: true },
        location_type: { required: true },
        planning_status: { required: true },
        ads_form: { required: true },
        address: { required: true },
        place_id: { required: true },
      },
    },
  );

  const { locationType, positionStatus } = usePositionOptions();
  const { data: adsTypes } = useQuery({
    queryKey: ['getAllAdsType'],
    queryFn: () => getAllAdsType(),
  });

  const rawData = useMemo(() => {
    return data?.find((city) => city.name === CITY);
  }, [data]);

  const districts = useMemo(() => {
    return (
      rawData?.districts?.map((district) => ({
        value: district.name,
        label: district.name,
        wards: district.wards || [],
      })) || []
    );
  }, [rawData]);

  const wards = useMemo(() => {
    return (
      districts
        ?.find((d) => d.value === fields.district)
        ?.wards.map((ward) => ({
          value: ward.name,
          label: ward.name,
        })) || []
    );
  }, [districts, fields.district]);

  const onBlur = () => {
    if (!fields.address) return;
    const service = new window.google.maps.places.PlacesService(
      new window.google.maps.Map(
        document.getElementById('map') as HTMLElement,
        { center: CURRENT_LOCATION, zoom: 15 },
      ),
    );

    const request = {
      query: [
        fields.address,
        fields.ward,
        fields.district,
        fields.province,
      ].join(','),
      fields: ['name', 'geometry', 'place_id', 'photos', 'formatted_address'],
    };

    service.findPlaceFromQuery(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log({ results });
        const data =
          results?.map((res) => ({
            value: res.place_id || '',
            photo: res.photos?.map((p) => p.getUrl()),
            place_id: res.place_id,
            lat: res.geometry?.location?.lat(),
            lng: res.geometry?.location?.lng(),
            label: res.name || '',
            description: res.formatted_address || '',
          })) || [];
        setPlaces(data);
      }
    });
  };

  const { mutate: addPosition } = useMutation({
    mutationFn: (data: AddAdsPositionForm) => addAdsPosition(data),
    onSuccess: () => {
      notifications.show({
        message: 'Tạo thành công',
      });
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const { mutate: updatePosition } = useMutation({
    mutationFn: (data: AddAdsPositionForm) => addAdsPosition(data),
    onSuccess: () => {
      notifications.show({
        message: 'Tạo thành công',
      });
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const handleChangeLocation = (value: string) => {
    const location = places.find((p) => p.value === value) as Place;
    onChangeField('place_id', value);
    if (!location) {
      onChangeLocation?.(CURRENT_LOCATION);
      return;
    }
    console.log({ location });
    onChangeLocation?.({
      lat: location.lat as number,
      lng: location.lng as number,
    });
  };

  const onSubmit = () => {
    const err = onError();
    if (err) return;
    position ? updatePosition({ ...position, ...fields }) : addPosition(fields);
  };

  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      title={position ? 'Cập nhật vị trí' : 'Tạo vị trí'}
    >
      <form className="flex flex-col gap-2">
        <Select
          disabled
          label="Thành phố"
          data={[{ value: fields.province, label: fields.province }]}
          value={fields.province}
          withAsterisk
        />
        <Select
          label="Quận"
          data={districts}
          allowDeselect={false}
          placeholder="Chọn quận"
          value={fields.district}
          onChange={(value) => {
            onChangeField('district', value || '');
            onChangeField('ward', '');
          }}
          withAsterisk
          error={error.district}
        />
        <Select
          data={wards}
          disabled={!fields.district}
          label="Phường"
          allowDeselect={false}
          placeholder="Chọn phường"
          value={fields.ward}
          onChange={(value) => onChangeField('ward', value || '')}
          withAsterisk
          error={error.ward}
        />
        <TextInput
          label="Địa chỉ"
          onBlur={onBlur}
          placeholder="Nhập địa chỉ"
          onChange={(e) => onChangeField('address', e.target.value)}
          withAsterisk
          error={error.address}
        />

        <PlaceSelect
          data={places}
          value={fields.place_id}
          onChange={(value) => handleChangeLocation(value || '')}
          error={error.place_id}
        />

        <Select
          label="Loại đất"
          placeholder="Loại đất"
          data={locationType}
          value={fields.location_type}
          onChange={(value) => onChangeField('location_type', value || '')}
          withAsterisk
          error={error.location_type}
        />
        <Select
          label="Tình trạng"
          placeholder="Tình trạng"
          data={positionStatus}
          value={fields.planning_status}
          onChange={(value) => onChangeField('planning_status', value || '')}
          withAsterisk
          error={error.planning_status}
        />
        <Select
          label="Loại quảng cáo được phép"
          data={adsTypes?.map((type) => ({
            value: type.title,
            label: type.title,
          }))}
          placeholder="Chọn loại quảng cáo được phép"
          value={fields.ads_form}
          onChange={(value) => onChangeField('ads_form', value || '')}
          withAsterisk
          error={error.ads_form}
        />
        <Button onClick={onSubmit} className="mt-3">
          Tạo vị trí
        </Button>
      </form>
    </Drawer>
  );
};

export default AddPosition;
