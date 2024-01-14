import { getAllAdsType } from '@/apis/ads';
import { AddContractRequest, addContract } from '@/apis/contract';
import {
  UpdateAdsPanelRequest,
  getAllAdsPosition,
  updateAdsPanel,
} from '@/apis/position';
import { TextEditor } from '@/components/TextEditor';
import { useForm } from '@/hooks/useForm';
import { useUserStore } from '@/stores/user';
import { PanelDetail } from '@/types/ads';
import { Role } from '@/types/enum';
import { getFullAddress } from '@/utils/location';
import {
  Button,
  Combobox,
  Drawer,
  Input,
  InputBase,
  NumberInput,
  Select,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconMapPinFilled, IconX } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

type Props = {
  panel?: PanelDetail;
  opened: boolean;
  onClose: () => void;
  positionId?: number;
};

export type AddForm = {
  enterprise_info: string;
  enterprise_email: string;
  enterprise_phone_number: string;
  contract_begin: Date;
  contract_expiration: Date;
  ads_type: string;
  width: number;
  height: number;
  ads_position?: number;
  ads_img: string;
  content: string;
};

const AddPanel = ({ opened, panel, positionId, onClose }: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const queryClient = useQueryClient();
  const user = useUserStore.use.user();

  const size = panel?.adsPanel.size.split(' ');

  const { fields, onChangeField, onError, error } = useForm<AddForm>({
    defaultState: {
      ads_type: panel?.adsPanel.ads_type || '',
      width: size?.[0] ? +size[0] : 1,
      height: size?.[2] ? +size[2] : 1,
      contract_expiration: panel?.contract.contract_expiration || new Date(),
      ads_position: panel?.adsPosition.id || positionId,
      enterprise_info: panel?.contract.enterprise_info || '',
      enterprise_email: panel?.contract.enterprise_email || '',
      enterprise_phone_number: panel?.contract.enterprise_phone_number || '',
      contract_begin: panel?.contract.contract_begin || new Date(),
      ads_img: panel?.adsImages.ads_image || '',
      content: panel?.adsPanel.content || '',
    },
    config: {
      ads_type: { required: true },
      width: { required: true },
      height: { required: true },
      contract_expiration: { required: true },
      contract_begin: { required: true },
      ads_position: { required: true },
      enterprise_phone_number: { required: true },
      enterprise_info: { required: true },
      enterprise_email: {
        required: true,
        pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      },
      ads_img: { required: true },
      content: { required: true },
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

  const filterPositions = useMemo(() => {
    return positions?.filter((pos) => {
      if (user?.role === Role.WARD) {
        return (
          pos.adsPosition.district === user.district &&
          pos.adsPosition.ward === user.ward
        );
      }
      if (user?.role === Role.DISTRICT) {
        return pos.adsPosition.district === user.district;
      }
      return true;
    });
  }, [positions, user]);

  const { mutate: addPanel, isPending: loading1 } = useMutation({
    mutationFn: (data: AddContractRequest) => addContract(data),
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
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['getDetailAdsPanel', variables.id],
      });
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
    console.log({ err });
    if (err) return;
    panel
      ? updatePanel({
          id: panel.adsPanel.id,
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
        <TextInput
          withAsterisk
          label="Tên công ty"
          placeholder="Tên công ty"
          value={fields.enterprise_info}
          error={error.enterprise_info}
          onChange={(e) => onChangeField('enterprise_info', e.target.value)}
        />
        <TextInput
          withAsterisk
          label="Email công ty"
          placeholder="Email công ty"
          value={fields.enterprise_email}
          error={error.enterprise_email}
          onChange={(e) => onChangeField('enterprise_email', e.target.value)}
        />
        <TextInput
          withAsterisk
          label="Số điện thoại"
          placeholder="Số điện thoại"
          value={fields.enterprise_phone_number}
          error={error.enterprise_phone_number}
          onChange={(e) =>
            onChangeField('enterprise_phone_number', e.target.value)
          }
        />

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
              label="Chọn điểm quảng cáo"
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
              {filterPositions?.length ? (
                filterPositions.map((item) => (
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
                      <div className="font-medium text-xs">
                        {item.adsPosition.is_actived === 'TRUE'
                          ? 'Đang hoạt động'
                          : 'Chưa hoạt động'}{' '}
                        - {item.panels.length} Bảng quảng cáo
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
          label="Ngày bắt đầu"
          placeholder="Ngày bắt đầu"
          value={new Date(fields.contract_begin)}
          error={error.contract_begin}
          onChange={(e) => onChangeField('contract_begin', e as Date)}
        />

        <DateTimePicker
          label="Ngày hết hạn"
          placeholder="Ngày hết hạn"
          value={new Date(fields.contract_expiration)}
          error={error.contract_expiration}
          onChange={(e) => onChangeField('contract_expiration', e as Date)}
        />

        <div>
          <Input.Label required>Nội dụng</Input.Label>
          {error.content && (
            <div className="mb-2">
              <Input.Error>{error.content}</Input.Error>
            </div>
          )}
          <TextEditor
            value={fields.content}
            onChange={(content) => onChangeField('content', content)}
            limitImages={1}
            images={fields.ads_img ? [fields.ads_img] : []}
            onChangeImage={(images) => {
              console.log(images);
              onChangeField('ads_img', images[0] || images[1] || '');
            }}
          />
        </div>

        <Button loading={loading1 || loading2} onClick={onSubmit}>
          {panel
            ? 'Cập nhật'
            : user?.role === Role.VHTT
            ? `Tạo bảng quảng cáo`
            : 'Tạo yêu cầu đặt quảng cáo'}
        </Button>
      </form>
    </Drawer>
  );
};

export default AddPanel;
