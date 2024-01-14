import { getLocationApi } from '@/apis/location';
import {
  CreateRequirementPositionRequest,
  UpdateRequirementPositionRequest,
  createRequirementPosition,
  updateRequirementPosition,
} from '@/apis/requirement';
import { useForm } from '@/hooks/useForm';
import { CITY } from '@/hooks/useLocationOptions';
import usePositionOptions from '@/hooks/usePositionOptions';
import { AddAdsPositionForm } from '@/pages/Home/components/AddAds/AddPosition';
import PlaceSelect, { Place } from '@/pages/Home/components/AddAds/PlaceSelect';
import { useUserStore } from '@/stores/user';
import { AdsPosition } from '@/types/ads';
import { IS_ACTIVE } from '@/types/enum';
import { RequirementPosition } from '@/types/requirement';
import { CURRENT_LOCATION } from '@/utils/location';
import { Button, Modal, Select, TextInput, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Props = {
  position?: AdsPosition;
  report?: RequirementPosition;
  opened: boolean;
  onClose: () => void;
};

const RequestUpdatePosition = ({
  report,
  position,
  onClose,
  opened,
}: Props) => {
  const user = useUserStore.use.user();
  const queryClient = useQueryClient();

  const [places, setPlaces] = useState<Place[]>([]);
  const { data } = useQuery({
    queryKey: ['getLocationApi', 3],
    queryFn: () => getLocationApi(3),
    staleTime: Infinity,
  });

  const { fields, onChangeField, onError, error, setFields } = useForm<
    AddAdsPositionForm & CreateRequirementPositionRequest
  >({
    defaultState: {
      province: position?.province || '',
      ward: position?.ward || '',
      district: position?.district || '',
      location_type: position?.location_type || '',
      planning_status: position?.planning_status || '',
      ads_form: position?.ads_form || '',
      address: position?.address || '',
      place_id: position?.place_id || '',
      is_active: position?.is_actived || IS_ACTIVE.FALSE,
      new_info: '',
      reason: '',
      staff: user?.id as number,
      ads_position: position?.id as number,
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
      reason: { required: true },
      ward: { required: true },
      district: { required: true },
      location_type: { required: true },
      planning_status: { required: true },
      ads_form: { required: true },
      address: { required: true },
      place_id: { required: true },
    },
  });

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
  }, [fields.address, fields.district, fields.province, fields.ward]);

  useEffect(() => {
    if (position) {
      position.address && onBlur();
      return;
    }
    if (report) {
      const position = JSON.parse(report.new_info) as AddAdsPositionForm;
      setFields({
        ...position,
        ads_position: report.ads_position,
        reason: report.reason,
        new_info: report.new_info,
        staff: report.staff,
      });
      position.address && onBlur();
    }
  }, [onBlur, position, report]);

  const handleChangeLocation = (value: string) => {
    onChangeField('place_id', value);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateRequirementPositionRequest) =>
      createRequirementPosition(data),
    onSuccess: () => {
      notifications.show({ message: 'Tạo thành công' });
      onClose();
    },
    onError: () => {
      notifications.show({
        message: 'Có lỗi xảy ra vui lòng thử lại',
        color: 'red',
      });
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: (data: UpdateRequirementPositionRequest) =>
      updateRequirementPosition(report?.id as number, data),
    onSuccess: () => {
      onClose();
      queryClient.refetchQueries({ queryKey: ['getAllRequirementPosition'] });
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

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
      is_active: fields.is_active,
    };

    report
      ? update({
          new_info: JSON.stringify(data),
          reason: fields.reason,
          staff: fields.staff,
          ads_position: fields.ads_position,
          time_submit: new Date(),
        })
      : mutate({
          new_info: JSON.stringify(data),
          reason: fields.reason,
          staff: fields.staff,
          ads_position: fields.ads_position,
        });
  };

  return (
    <Modal
      size="lg"
      opened={opened}
      onClose={onClose}
      title="Yêu cầu thay đổi điểm quảng cáo"
    >
      <div className="flex flex-col gap-2">
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
        <Select
          label="Trạng thái"
          data={[
            { value: IS_ACTIVE.TRUE, label: 'Đang hoạt động' },
            { value: IS_ACTIVE.FALSE, label: 'Chưa hoạt động' },
          ]}
          placeholder="Trạng thái hoạt động"
          value={fields.is_active}
          onChange={(value) => onChangeField('is_active', value as IS_ACTIVE)}
          withAsterisk
          error={error.is_active}
        />
        <Textarea
          withAsterisk
          label="Lý do"
          placeholder="Nhập lý do"
          value={fields.reason}
          error={error.reason}
          onChange={(e) => onChangeField('reason', e.target.value)}
        />
        <Button onClick={onSubmit} loading={isPending} className="w-full mt-2">
          {report ? 'Cập nhật yêu cầu' : 'Tạo yêu cầu'}
        </Button>
      </div>
    </Modal>
  );
};

export default RequestUpdatePosition;
