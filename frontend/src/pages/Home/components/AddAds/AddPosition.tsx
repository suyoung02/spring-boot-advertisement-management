import { getLocationApi } from '@/apis/location';
import {
  AddAdsPositionRequest,
  UpdateAdsPositionRequest,
  addAdsPosition,
  updateAdsPosition,
} from '@/apis/position';
import { useForm } from '@/hooks/useForm';
import usePositionOptions from '@/hooks/usePositionOptions';
import { Position } from '@/types/ads';
import { IS_ACTIVE, Role } from '@/types/enum';
import { CURRENT_LOCATION, getAddress } from '@/utils/location';
import { Button, Drawer, Select, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PlaceSelect, { Place } from './PlaceSelect';
import { useUserStore } from '@/stores/user';

type Props = {
  position?: Position;
  opened: boolean;
  onClose: () => void;
  onChangeLocation?: (location: { lat: number; lng: number }) => void;
  place?: google.maps.places.PlaceResult;
  mapRef?: google.maps.Map;
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
  place,
  mapRef,
}: Props) => {
  const queryClient = useQueryClient();
  const user = useUserStore.use.user();

  const [places, setPlaces] = useState<Place[]>([]);
  const { data } = useQuery({
    queryKey: ['getLocationApi', 3],
    queryFn: () => getLocationApi(3),
    staleTime: Infinity,
  });

  const placeAddress = getAddress(place?.formatted_address || '');

  const { fields, onChangeField, onError, error } = useForm<AddAdsPositionForm>(
    {
      defaultState: {
        province:
          position?.adsPosition.province || placeAddress.province || CITY,
        ward:
          user?.role !== Role.VHTT
            ? user?.ward || ''
            : position?.adsPosition.ward || placeAddress.ward || '',
        district:
          user?.role !== Role.VHTT
            ? user?.district || ''
            : position?.adsPosition.district || placeAddress.district || '',
        location_type: position?.locationType.title || '',
        planning_status: position?.planningStatus.title || '',
        ads_form: position?.adsForm.title || '',
        address: position?.adsPosition.address || placeAddress.address || '',
        place_id: position?.adsPosition.place_id || place?.place_id || '',
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

  const { locationType, positionStatus, adsForm } = usePositionOptions();

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

  const onBlur = useCallback(() => {
    if (!fields.address) return;
    const service = new window.google.maps.places.PlacesService(
      mapRef ||
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

    service.textSearch(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
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
  }, [fields.address, fields.district, fields.province, fields.ward, mapRef]);

  useEffect(() => {
    position?.adsPosition.address && onBlur();
  }, [onBlur, position]);

  const { mutate: addPosition } = useMutation({
    mutationFn: (data: AddAdsPositionRequest) => addAdsPosition(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['getAllAdsPosition'] });
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
    mutationFn: (data: UpdateAdsPositionRequest) => updateAdsPosition(data),
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
    const activePlace = places.find((p) => p.place_id === fields.place_id);
    const data = {
      name: activePlace?.label || '',
      address: fields.address,
      ward: fields.ward,
      district: fields.district,
      province: fields.province,
      location_type: fields.location_type,
      ads_form: fields.ads_form,
      planning_status: fields.planning_status,
      photo: activePlace?.photo?.[0] || '',
      place_id: fields.place_id,
      latitude: activePlace?.lat as number,
      longitude: activePlace?.lng as number,
      is_active: user?.role === Role.VHTT ? IS_ACTIVE.TRUE : IS_ACTIVE.FALSE,
    };

    position
      ? updatePosition({
          id: position.adsPosition.id,
          ...data,
        })
      : addPosition(data);
  };

  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      title={position ? 'Cập nhật vị trí' : 'Tạo vị trí'}
      size="lg"
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
          disabled={user?.role !== Role.VHTT}
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
          disabled={
            !fields.district ||
            user?.role === Role.WARD ||
            (user?.role === Role.DISTRICT && !!user.ward)
          }
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
          value={fields.address}
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
          label="Hình thức quảng cáo"
          data={adsForm}
          placeholder="Hình thức loại quảng cáo"
          value={fields.ads_form}
          onChange={(value) => onChangeField('ads_form', value || '')}
          withAsterisk
          error={error.ads_form}
        />
        <Button onClick={onSubmit} className="mt-3">
          {position
            ? 'Cập nhật'
            : user?.role === Role.VHTT
            ? 'Tạo vị trí'
            : 'Tạo yêu cầu vị trí'}
        </Button>
      </form>
    </Drawer>
  );
};

export default AddPosition;
