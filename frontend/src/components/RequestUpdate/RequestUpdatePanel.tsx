import {
  CreateRequirementPanelRequest,
  createRequirementPanel,
} from '@/apis/requirement';
import { useForm } from '@/hooks/useForm';
import { useUserStore } from '@/stores/user';
import { RequirementStatus } from '@/types/enum';
import { Button, Modal, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

type Props = {
  panel: number;
  opened: boolean;
  onClose: () => void;
};

const RequestUpdatePanel = ({ panel, onClose, opened }: Props) => {
  const user = useUserStore.use.user();

  const { fields, onChangeField, error, onError } =
    useForm<CreateRequirementPanelRequest>({
      defaultState: {
        new_info: '',
        time_submit: new Date(),
        reason: '',
        status: RequirementStatus.SEND,
        staff: user?.id as number,
        ads_panel: panel,
      },
      config: {
        new_info: { required: true },
        reason: { required: true },
      },
    });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateRequirementPanelRequest) =>
      createRequirementPanel(data),
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

  const onSubmit = () => {
    const err = onError();
    if (err) return;
    mutate({
      new_info: fields.new_info,
      time_submit: new Date(),
      reason: fields.reason,
      status: fields.status,
      staff: fields.staff,
      ads_panel: fields.ads_panel,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Yêu cầu thay đổi bảng quảng cáo"
    >
      <div className="flex flex-col gap-2">
        <TextInput
          withAsterisk
          label="Tiêu đề"
          placeholder="Cập nhật thông tin mới..."
          value={fields.new_info}
          error={error.new_info}
          onChange={(e) => onChangeField('new_info', e.target.value)}
        />
        <TextInput
          withAsterisk
          label="Lý do"
          placeholder="Nhập lý do"
          value={fields.reason}
          error={error.reason}
          onChange={(e) => onChangeField('reason', e.target.value)}
        />
        <Button onClick={onSubmit} loading={isPending} className="w-full mt-2">
          Tạo yêu cầu
        </Button>
      </div>
    </Modal>
  );
};

export default RequestUpdatePanel;
