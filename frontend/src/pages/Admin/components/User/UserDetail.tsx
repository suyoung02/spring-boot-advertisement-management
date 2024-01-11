import {
  UpdateStaffRequest,
  deleteStaff,
  getOneStaff,
  updateOneStaff,
} from '@/apis/staff';
import { useForm } from '@/hooks/useForm';
import useLocationOptions, { CITY } from '@/hooks/useLocationOptions';
import { Role } from '@/types/enum';
import { ROLE_TITLE } from '@/utils/avatar';
import { classNames } from '@/utils/classNames';
import {
  Button,
  Drawer,
  LoadingOverlay,
  Select,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconBuilding,
  IconCalendar,
  IconMail,
  IconPhone,
  IconUser,
  IconUserScan,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect } from 'react';

type Props = {
  id: number;
  opened: boolean;
  onClose: () => void;
};

const UserDetail = ({ id, onClose, opened }: Props) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getOneStaff', id],
    queryFn: () => getOneStaff(id),
  });

  const { fields, onChangeField, error, setFields, onError } =
    useForm<UpdateStaffRequest>({
      defaultState: {
        username: '',
        fullname: '',
        dob: new Date(),
        email: '',
        phoneNumber: '',
        role: '' as Role,
        ward: '',
        district: '',
      },
      validate: {
        ward: ({ value, formValue }) => {
          return formValue?.role === Role.WARD && !value ? 'Bắt buộc' : null;
        },
      },
      config: {
        username: {
          required: true,
          pattern: {
            value: /^[a-z0-9]{8,20}$/,
            message:
              'Tên đăng nhập phải có độ dài từ 8 đến 20, không có ký tự viết hoa và ký tự đặc biệt',
          },
        },
        fullname: { required: true },
        dob: { required: true },
        email: {
          required: true,
          pattern: {
            value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            message: 'Email không hợp lệ',
          },
        },
        phoneNumber: {
          required: true,
          pattern: {
            value: /^(0[3|5|7|8|9])+([0-9]{8})$/,
            message: 'Số điện thoại không hợp lệ',
          },
        },
        role: { required: true },
        district: { required: true },
      },
    });

  useEffect(() => {
    data && setFields(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { districts, wards, cities } = useLocationOptions({
    district: fields.district,
  });

  const { mutate: update, isPending: updateLoading } = useMutation({
    mutationFn: (data: UpdateStaffRequest) => updateOneStaff(id, data),
    onSuccess: () => {
      refetch();
      queryClient.refetchQueries({ queryKey: ['getAllStaff'] });
      notifications.show({ message: 'Cập nhật thành công' });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: 'Có lỗi xảy ra vui lòng thử lại',
      });
    },
  });

  const { mutate, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteStaff(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['getAllStaff'] });
      notifications.show({ message: 'Xoá thành công' });
      onClose();
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: 'Có lỗi xảy ra vui lòng thử lại',
      });
    },
  });

  const handleSubmit = () => {
    const err = onError();
    if (err) return;
    update(fields);
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Bạn muốn xoá tài khoản này?',
      labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        mutate();
      },
    });
  };

  return (
    <Drawer
      size="lg"
      position="right"
      opened={opened}
      onClose={onClose}
      title="Chi tiết cán bộ"
    >
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <div
        className={classNames('p-4  rounded-xl flex flex-col gap-1', {
          'bg-blue-100 text-blue-500': data?.role === Role.DISTRICT,
          'bg-cyan-100 text-cyan-500': data?.role === Role.VHTT,
          'bg-pink-100 text-pink-500': data?.role === Role.WARD,
        })}
      >
        <div className="font-bold mb-1">
          Thông tin cán bộ - {ROLE_TITLE[data?.role as Role]}
        </div>
        <div className="text-base">
          Tên đăng nhập: <span className="font-medium">{data?.username}</span>
        </div>
        <div className="text-base">
          Họ và tên: <span className="font-medium">{data?.fullname}</span>
        </div>
        <div className="text-base">
          Email: <span className="font-medium">{data?.email}</span>
        </div>
        <div className="text-base">
          Số điện thoại:{' '}
          <span className="font-medium">{data?.phoneNumber}</span>
        </div>
        <div className="text-base">
          Ngày sinh:{' '}
          <span className="font-medium">
            {dayjs(data?.dob).format('DD/MM/YYYY')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-base">
            Quận/Huyện: <span className="font-medium">{data?.district}</span>
          </div>
          <div className="text-base">
            Phường/Xã:{' '}
            <span className="font-medium">{data?.ward || 'Tất cả'}</span>
          </div>
        </div>
      </div>
      <form className="flex flex-col gap-3 p-4 border rounded-xl mt-4">
        <TextInput
          disabled
          withAsterisk
          label="Username"
          error={error.username}
          onChange={(e) => onChangeField('username', e.target.value)}
          leftSection={<IconUser />}
          placeholder="Username"
          value={fields.username}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            withAsterisk
            label="Họ và tên"
            error={error.fullname}
            onChange={(e) => onChangeField('fullname', e.target.value)}
            leftSection={<IconUser />}
            placeholder="Họ và tên"
            value={fields.fullname}
          />
          <TextInput
            withAsterisk
            label="Email"
            error={error.email}
            onChange={(e) => onChangeField('email', e.target.value)}
            type="email"
            leftSection={<IconMail />}
            placeholder="Email"
            value={fields.email}
          />
          <TextInput
            withAsterisk
            label="Số điện thoại"
            error={error.email}
            onChange={(e) => onChangeField('phoneNumber', e.target.value)}
            type="number"
            leftSection={<IconPhone />}
            placeholder="Số điện thoại"
            value={fields.phoneNumber}
          />

          <Select
            withAsterisk
            label="Chức vụ"
            error={error.email}
            data={[
              { value: Role.DISTRICT, label: 'Cán bộ Quận' },
              { value: Role.WARD, label: 'Cán bộ Phường' },
            ]}
            onChange={(e) => onChangeField('role', e as Role)}
            leftSection={<IconUserScan />}
            placeholder="Chức vụ"
            value={fields.role}
          />

          <DateInput
            onChange={(value) => onChangeField('dob', value || new Date())}
            label="Ngày sinh"
            leftSection={<IconCalendar />}
            placeholder="Ngày sinh"
            value={new Date(fields.dob)}
          />

          <Select
            disabled
            withAsterisk
            label="Thành phố"
            leftSection={<IconBuilding />}
            data={cities}
            placeholder="Thành phố"
            value={CITY}
          />
          <Select
            withAsterisk
            label="Quận/Huyện"
            error={error.district}
            onChange={(value) => onChangeField('district', value || '')}
            leftSection={<IconBuilding />}
            data={districts}
            placeholder="Chọn quận/huyện"
            value={fields.district}
          />
          <Select
            withAsterisk
            label="Phường/Xã"
            error={error.ward}
            onChange={(value) => onChangeField('ward', value || '')}
            leftSection={<IconBuilding />}
            data={wards}
            placeholder="Chọn phường/xã"
            value={fields.ward}
          />
        </div>
        <Button
          onClick={handleSubmit}
          loading={updateLoading}
          size="md"
          className="w-full mt-2"
        >
          Chỉnh sửa tài khoản
        </Button>
        <Button
          color="red"
          onClick={handleDelete}
          loading={deleteLoading}
          size="md"
          className="w-full"
        >
          Xoá tài khoản
        </Button>
      </form>
    </Drawer>
  );
};

export default UserDetail;
