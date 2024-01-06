import { getLocationApi } from '@/apis/location';
import { RegisterRequest, registerApi } from '@/apis/user';
import { useForm } from '@/hooks/useForm';
import { Button, PasswordInput, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconArrowBack,
  IconBuilding,
  IconCalendar,
  IconLock,
  IconMail,
  IconPhone,
  IconUser,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { Role } from '@/types/enum';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

type RegisterForm = Omit<RegisterRequest, 'role' | 'ward' | 'district'> & {
  city: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { fields, onError, onChangeField, error } = useForm<RegisterForm>({
    defaultState: {
      username: '',
      password: '',
      confirmPassword: '',
      fullname: '',
      dob: new Date(),
      email: '',
      phoneNumber: '',
      city: 'Thành phố Hồ Chí Minh',
    },
    validate: {
      confirmPassword: ({ value, formValue }) => {
        return value !== formValue?.password
          ? 'Xác nhận mật khẩu chưa chính xác'
          : null;
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
      city: { required: true },
    },
  });

  const { data } = useQuery({
    queryKey: ['getLocationApi', 1],
    queryFn: () => getLocationApi(1),
  });

  const { mutate } = useMutation({
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

  const formatData = useMemo(() => {
    return data?.map((city) => ({ label: city.name, value: city.name }));
  }, [data]);

  const onSubmit = () => {
    const error = onError();
    if (error) return;
    mutate({ ...fields, role: Role.VHTT, ward: '', district: '' });
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-slate-200">
      <form className="w-[800px] flex flex-col gap-3 p-10 rounded-2xl shadow-lg bg-white">
        <h3 className="font-bold text-2xl text-center uppercase mb-4">
          Đăng ký tài khoản Sở VH-TT
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <TextInput
            withAsterisk
            label="Username"
            error={error.username}
            onChange={(e) => onChangeField('username', e.target.value)}
            leftSection={<IconUser />}
            placeholder="Username"
            value={fields.username}
          />

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
            value={fields.dob}
          />

          <Select
            disabled
            withAsterisk
            label="Thành phố"
            error={error.city}
            onChange={(value) => onChangeField('city', value || '')}
            leftSection={<IconBuilding />}
            data={formatData}
            placeholder="Thành phố"
            value={fields.city}
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
        <Button onClick={onSubmit} size="md" className="w-full mt-2">
          Đăng ký
        </Button>
        <div className="flex items-center gap-2 py-2">
          <div className="w-full h-[1px] bg-neutral-400"></div>
          <div className="whitespace-nowrap">Bạn đã có tài khoản?</div>
          <div className="w-full h-[1px] bg-neutral-400"></div>
        </div>
        <Button
          onClick={() => navigate('/admin/login')}
          leftSection={<IconArrowBack />}
          size="md"
          variant="default"
        >
          Quay lại đăng nhập
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
