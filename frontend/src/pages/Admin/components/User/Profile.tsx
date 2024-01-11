import {
  ChangePasswordRequest,
  UpdateAccountRequest,
  changePassword,
  updateAccount,
} from '@/apis/staff';
import { useForm } from '@/hooks/useForm';
import { CITY } from '@/hooks/useLocationOptions';
import { useUserStore } from '@/stores/user';
import { Role } from '@/types/enum';
import { User } from '@/types/user';
import { ROLE_TITLE, stringToHslColor } from '@/utils/avatar';
import {
  Avatar,
  Button,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  IconAt,
  IconBuildingSkyscraper,
  IconCake,
  IconCalendar,
  IconLock,
  IconMail,
  IconMap,
  IconMapPin,
  IconPhone,
  IconPhoneCall,
  IconUser,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';

const Profile = () => {
  const user = useUserStore.use.user();
  const setUser = useUserStore.use.setUser();

  const { fields, onChangeField, error, onError } =
    useForm<UpdateAccountRequest>({
      defaultState: {
        fullname: user?.fullname || '',
        dob: user?.dob ? new Date(user.dob) : new Date(),
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
      },
      config: {
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
      },
    });

  const changePasswordForm = useForm<ChangePasswordRequest>({
    defaultState: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      confirmPassword: ({ value, formValue }) => {
        return value !== formValue?.newPassword
          ? 'Xác nhận mật khẩu chưa chính xác'
          : null;
      },
    },
    config: {
      currentPassword: {
        required: true,
        pattern: {
          value:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
          message:
            'Mật khẩu có độ dài tối thiểu 8 và tối đa 20, chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt và 1 chữ số',
        },
      },
      newPassword: {
        required: true,
        pattern: {
          value:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
          message:
            'Mật khẩu có độ dài tối thiểu 8 và tối đa 20, chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt và 1 chữ số',
        },
      },
      confirmPassword: { required: true },
    },
  });

  const { mutate: update, isPending: updateLoading } = useMutation({
    mutationFn: (data: UpdateAccountRequest) => updateAccount(data),
    onSuccess: () => {
      const newUser = { ...user, ...fields } as User;
      setUser(newUser);
      notifications.show({ message: 'Cập nhật thành công' });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: 'Có lỗi xảy ra vui lòng thử lại',
      });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      changePasswordForm.reset();
      notifications.show({ message: 'Cập nhật thành công' });
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra vui lòng thử lại',
        message: e.message,
      });
    },
  });

  const handleSubmit = () => {
    const err = onError();
    if (err) return;
    update(fields);
  };

  const handleChange = () => {
    const err = onError();
    if (err) return;
    mutate(changePasswordForm.fields);
  };

  return (
    <div className="px-8 pt-6">
      <div className="flex items-center gap-3">
        <Avatar
          size={100}
          radius="md"
          color={stringToHslColor(user?.fullname || '')}
        >
          {user?.fullname
            .split(' ')
            .map((name) => name[0])
            .slice(0, 2)}
        </Avatar>
        <div className="w-1/2">
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {ROLE_TITLE[user?.role as Role]}
          </Text>

          <Text fz="xl" fw={700} className="uppercase">
            {user?.fullname}
          </Text>

          <div className="flex justify-between w-full">
            <div>
              <Group wrap="nowrap" gap={8} mt={3}>
                <IconAt
                  stroke={1.5}
                  size="1rem"
                  color="var(--mantine-color-dimmed)"
                />
                <Text fz="xs" c="dimmed">
                  {user?.email}
                </Text>
              </Group>
              <Group wrap="nowrap" gap={8} mt={5}>
                <IconPhoneCall
                  stroke={1.5}
                  size="1rem"
                  color="var(--mantine-color-dimmed)"
                />
                <Text fz="xs" c="dimmed">
                  {user?.phoneNumber}
                </Text>
              </Group>
              <Group wrap="nowrap" gap={8} mt={5}>
                <IconCake
                  stroke={1.5}
                  size="1rem"
                  color="var(--mantine-color-dimmed)"
                />
                <Text fz="xs" c="dimmed">
                  {user?.dob && dayjs(user.dob).format('DD/MM/YYYY')}
                </Text>
              </Group>
            </div>
            <div>
              <Group wrap="nowrap" gap={8} mt={3}>
                <IconBuildingSkyscraper
                  stroke={1.5}
                  size="1rem"
                  color="var(--mantine-color-dimmed)"
                />
                <Text fz="xs" c="dimmed">
                  {CITY}
                </Text>
              </Group>
              <Group wrap="nowrap" gap={8} mt={3}>
                <IconMap
                  stroke={1.5}
                  size="1rem"
                  color="var(--mantine-color-dimmed)"
                />
                <Text fz="xs" c="dimmed">
                  {user?.district || 'Tất cả'}
                </Text>
              </Group>
              <Group wrap="nowrap" gap={8} mt={5}>
                <IconMapPin
                  stroke={1.5}
                  size="1rem"
                  color="var(--mantine-color-dimmed)"
                />
                <Text fz="xs" c="dimmed">
                  {user?.ward || 'Tất cả'}
                </Text>
              </Group>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-10">
        <form className="flex flex-col gap-3 p-4 border rounded-xl mt-4">
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

          <DateInput
            onChange={(value) => onChangeField('dob', value || new Date())}
            label="Ngày sinh"
            leftSection={<IconCalendar />}
            placeholder="Ngày sinh"
            value={new Date(fields.dob)}
          />

          <Button
            onClick={handleSubmit}
            loading={updateLoading}
            size="md"
            className="w-full mt-2"
          >
            Chỉnh sửa tài khoản
          </Button>
        </form>
        <form className="flex flex-col gap-3 p-4 border rounded-xl mt-4 h-fit">
          <PasswordInput
            withAsterisk
            leftSection={<IconLock />}
            label="Mật khẩu mới"
            placeholder="Mật khẩu mới"
            error={changePasswordForm.error.currentPassword}
            value={changePasswordForm.fields.currentPassword}
            onChange={(e) =>
              changePasswordForm.onChangeField(
                'currentPassword',
                e.target.value,
              )
            }
          />

          <PasswordInput
            withAsterisk
            leftSection={<IconLock />}
            label="Mật khẩu mới"
            placeholder="Mật khẩu mới"
            error={changePasswordForm.error.newPassword}
            value={changePasswordForm.fields.newPassword}
            onChange={(e) =>
              changePasswordForm.onChangeField('newPassword', e.target.value)
            }
          />

          <PasswordInput
            withAsterisk
            leftSection={<IconLock />}
            label="Xác nhận mật khẩu"
            placeholder="Xác nhận mật khẩu"
            error={changePasswordForm.error.confirmPassword}
            value={changePasswordForm.fields.confirmPassword}
            onChange={(e) =>
              changePasswordForm.onChangeField(
                'confirmPassword',
                e.target.value,
              )
            }
          />

          <Button
            onClick={handleChange}
            loading={isPending}
            size="md"
            className="w-full mt-2"
          >
            Đổi mật khẩu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
