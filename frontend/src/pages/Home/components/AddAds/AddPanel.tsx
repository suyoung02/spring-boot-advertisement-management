import { getAllAdsType } from '@/apis/ads';
import {
  AddPanelRequest,
  UpdateAdsPanelRequest,
  addAdsPanel,
  getAllAdsPosition,
  updateAdsPanel,
} from '@/apis/position';
import { useForm } from '@/hooks/useForm';
import { AdsPanel } from '@/types/ads';
import { getFullAddress } from '@/utils/location';
import {
  Button,
  Combobox,
  Drawer,
  Input,
  InputBase,
  NumberInput,
  Select,
  useCombobox,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconMapPinFilled, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type Props = {
  panel?: AdsPanel;
  opened: boolean;
  onClose: () => void;
  positionId?: number;
};

type AddPanelForm = {
  ads_type: string;
  width: number;
  height: number;
  contract_expiration: Date;
  ads_position: number | undefined;
};

const AddPanel = ({ opened, panel, positionId, onClose }: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  console.log({ panel });

  const size = panel?.size.split(' ');

  const { fields, onChangeField, onError, error } = useForm<AddPanelForm>({
    defaultState: {
      ads_type: panel?.ads_type || '',
      width: size?.[0] ? +size[0] : 1,
      height: size?.[2] ? +size[2] : 1,
      contract_expiration: new Date(),
      ads_position: panel?.ads_position || positionId,
    },
    config: {
      ads_type: { required: true },
      width: { required: true },
      height: { required: true },
      contract_expiration: { required: true },
      ads_position: { required: true },
    },
  });

  const { data: adsType } = useQuery({
    queryKey: ['getAllAdsType'],
    queryFn: () => getAllAdsType(),
  });

  const { data: positions } = useQuery({
    queryKey: ['getAllAdsPosition'],
    queryFn: () => getAllAdsPosition(),
  });

  const { mutate: addPanel, isPending: loading1 } = useMutation({
    mutationFn: (data: AddPanelRequest) => addAdsPanel(data),
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

  const { mutate: updatePanel, isPending: loading2 } = useMutation({
    mutationFn: (data: UpdateAdsPanelRequest) => updateAdsPanel(data),
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

  const activePosition = useMemo(() => {
    return positions?.find((p) => p.adsPosition.id === fields.ads_position);
  }, [fields.ads_position, positions]);

  const onSubmit = () => {
    const err = onError();
    if (err) return;
    panel
      ? updatePanel({
          id: panel.id,
          ...fields,
          size: `${fields.width} x ${fields.height}`,
          ads_position: fields.ads_position as number,
        })
      : addPanel({
          ...fields,
          size: `${fields.width} x ${fields.height}`,
          ads_position: fields.ads_position as number,
        });
  };

  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={onClose}
      title={panel ? 'Cập nhật vị trí' : 'Tạo vị trí'}
      size="lg"
    >
      <form className="flex flex-col gap-2">
        <Select
          withAsterisk
          label="Loại quảng cáo"
          placeholder="Loại quảng cáo"
          data={adsType?.map((type) => ({
            value: type.title,
            label: type.title,
          }))}
          value={fields.ads_type}
          error={error.ads_type}
          onChange={(e) => onChangeField('ads_type', e || '')}
        />
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={(val) => {
            onChangeField('ads_position', +val);
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase
              pointer
              withAsterisk
              label="Chọn điểm bán hàng"
              component="button"
              type="button"
              rightSection={<Combobox.Chevron />}
              onClick={() => combobox.toggleDropdown()}
              rightSectionPointerEvents="none"
              value={fields.ads_position ? `${fields.ads_position}` : undefined}
              error={error.ads_position}
            >
              {activePosition?.adsPosition ? (
                getFullAddress(activePosition.adsPosition)
              ) : (
                <Input.Placeholder>Chọn vị trí</Input.Placeholder>
              )}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>
              {positions?.length ? (
                positions.map((item) => (
                  <Combobox.Option
                    value={`${item.adsPosition.id}`}
                    key={item.adsPosition.id}
                    className="flex items-center gap-2"
                  >
                    <IconMapPinFilled />
                    <div className="flex flex-col gap-1">
                      <div className="text-neutral-700 text-sm">
                        {getFullAddress(item.adsPosition)}
                      </div>
                      <div className="font-medium">{item.adsPosition.name}</div>
                      <div className="text-xs">
                        {item.adsForm.title}, {item.locationType.title},{' '}
                        {item.planningStatus.title}
                      </div>
                    </div>
                  </Combobox.Option>
                ))
              ) : (
                <Combobox.Option
                  value=""
                  disabled
                  className="flex items-center gap-2"
                >
                  Chưa có dữ liệu
                </Combobox.Option>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>

        <div className="flex items-end gap-2">
          <NumberInput
            label="Chiều rộng"
            placeholder="Chiều rộng"
            rightSection="m"
            className="flex-1"
            min={1}
            value={fields.width}
            error={error.width}
            onChange={(e) => onChangeField('width', +e)}
          />
          <IconX className="mb-2" />
          <NumberInput
            label="Chiều dài"
            placeholder="Chiều dài"
            rightSection="m"
            className="flex-1"
            min={1}
            value={fields.height}
            error={error.height}
            onChange={(e) => onChangeField('height', +e)}
          />
        </div>

        <DateTimePicker
          label="Ngày hết hạn"
          placeholder="Ngày hết hạn"
          value={fields.contract_expiration}
          error={error.contract_expiration}
          onChange={(e) => onChangeField('contract_expiration', e as Date)}
        />

        <Button
          loading={loading1 || loading2}
          onClick={onSubmit}
          className="mt-3"
        >
          {panel ? 'Cập nhật' : 'Tạo bảng quảng cáo'}
        </Button>
      </form>
    </Drawer>
  );
};

export default AddPanel;
