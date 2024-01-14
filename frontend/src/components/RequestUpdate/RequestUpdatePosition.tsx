import {
  CreateRequirementPositionRequest,
  createRequirementPosition,
} from '@/apis/requirement';
import { useForm } from '@/hooks/useForm';
import { useUserStore } from '@/stores/user';
import { Button, Modal, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

type Props = {
  position: number;
  opened: boolean;
  onClose: () => void;
};

const RequestUpdatePosition = ({ position, onClose, opened }: Props) => {
  const user = useUserStore.use.user();

  const { fields, onChangeField, error, onError } =
    useForm<CreateRequirementPositionRequest>({
      defaultState: {
        new_info: '',
        reason: '',
        staff: user?.id as number,
        ads_position: position,
      },
      config: {
        new_info: { required: true },
        reason: { required: true },
      },
    });

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

  const onSubmit = () => {
    const err = onError();
    if (err) return;
    mutate(fields);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Yêu cầu thay đổi điểm quảng cáo"
    >
      <div className="flex flex-col gap-2">
        <Textarea
          withAsterisk
          label="Nội dung"
          placeholder="Cập nhật thông tin mới..."
          value={fields.new_info}
          error={error.new_info}
          onChange={(e) => onChangeField('new_info', e.target.value)}
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
          Tạo yêu cầu
        </Button>
      </div>
    </Modal>
  );
};

export default RequestUpdatePosition;
