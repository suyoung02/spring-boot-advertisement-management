import { getLocationApi } from '@/apis/location';
import { RegisterRequest, registerApi } from '@/apis/user';
import { useForm } from '@/hooks/useForm';
import { Role } from '@/types/enum';
import { Button, PasswordInput, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  IconBuilding,
  IconCalendar,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
  IconUserScan,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const CITY = 'Thành phố Hồ Chí Minh';

const CreateAccount = () => {
  const { data } = useQuery({
    queryKey: ['getLocationApi', 3],
    queryFn: () => getLocationApi(3),
    staleTime: Infinity,
  });

  const { fields, onError, onChangeField, error } = useForm<RegisterRequest>({
    defaultState: {
      username: '',
      password: '',
      confirmPassword: '',
      fullname: '',
      dob: new Date(),
      email: '',
      phoneNumber: '',
      role: '',
      ward: '',
      district: '',
    },
    validate: {
      confirmPassword: ({ value, formValue }) => {
        return value !== formValue?.password
          ? 'Xác nhận mật khẩu chưa chính xác'
          : null;
      },
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
      password: {
        required: true,
        pattern: {
          value:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
          message:
            'Mật khẩu có độ dài tối thiểu 8 và tối đa 20, chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt và 1 chữ số',
        },
      },
      confirmPassword: { required: true },
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

  const rawData = useMemo(() => {
    return data?.find((city) => city.name === CITY);
  }, [data]);

  console.log({ rawData });

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

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data),
    onSuccess: () => {
      notifications.show({
        message: 'Đăng ký thành công',
      });
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Đăng ký thất bại',
        message: e.message,
      });
    },
  });

  const onSubmit = () => {
    const error = onError();
    if (error) return;
    mutate(fields);
  };

  return (
    <div className="w-full mt-10 flex items-center justify-center">
      <form className="w-1/2 max-w-[500px] flex flex-col gap-3">
        <h3 className="font-medium text-2xl mb-3 text-center">Tạo tài khoản</h3>
        <TextInput
          withAsterisk
          label="Username"
          error={error.username}
          onChange={(e) => onChangeField('username', e.target.value)}
          leftSection={<IconUser />}
          placeholder="Username"
          value={fields.username}
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
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
            onChange={(e) => onChangeField('role', e || '')}
            leftSection={<IconUserScan />}
            placeholder="Chức vụ"
            value={fields.role}
          />

          <DateInput
            onChange={(value) => onChangeField('dob', value || new Date())}
            label="Ngày sinh"
            leftSection={<IconCalendar />}
            placeholder="Ngày sinh"
            value={fields.dob}
          />

          <Select
            disabled
            withAsterisk
            label="Thành phố"
            leftSection={<IconBuilding />}
            data={[{ value: CITY, label: CITY }]}
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

          <PasswordInput
            withAsterisk
            error={error.password}
            onChange={(e) => onChangeField('password', e.target.value)}
            leftSection={<IconLock />}
            label="Mật khẩu"
            placeholder="Mật khẩu"
            value={fields.password}
          />
          <PasswordInput
            withAsterisk
            error={error.confirmPassword}
            leftSection={<IconLock />}
            label="Xác nhận mật khẩu"
            placeholder="Xác nhận mật khẩu"
            onChange={(e) => onChangeField('confirmPassword', e.target.value)}
            value={fields.confirmPassword}
          />
        </div>
        <Button
          onClick={onSubmit}
          loading={isPending}
          size="md"
          className="w-full mt-2"
        >
          Tạo tài khoản
        </Button>
      </form>
    </div>
  );
};

export default CreateAccount;
