import { LoginRequest, loginApi } from '@/apis/user';
import { useForm } from '@/hooks/useForm';
import { setToken } from '@/stores/user';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBrandGoogle, IconLock, IconUser } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const { fields, onError, onChangeField, error } = useForm<LoginRequest>({
    defaultState: {
      username: '',
      password: '',
    },

    config: {
      username: {
        required: true,
      },
      password: {
        required: true,
      },
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: (data) => {
      setToken(data.accessToken, data.refreshToken, data.expired_time);
      notifications.show({
        message: 'Đăng nhập thành công',
      });
      navigate('/admin');
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Đăng nhập thất bại',
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
    <div className="flex w-screen h-screen items-center justify-center bg-slate-200">
      <form className="min-w-[500px] flex flex-col gap-3 p-10 rounded-2xl shadow-lg bg-white">
        <h3 className="font-bold text-2xl text-center uppercase">
          Đăng nhập hệ thống Quản lý
        </h3>

        <TextInput
          withAsterisk
          label="Username"
          placeholder="Username"
          leftSection={<IconUser />}
          error={error.username}
          onChange={(e) => onChangeField('username', e.target.value)}
        />

        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Mật khẩu"
          placeholder="Mật khẩu"
          error={error.password}
          onChange={(e) => onChangeField('password', e.target.value)}
        />

        <div className="flex justify-between">
          <Link
            className="text-neutral-700 underline text-right"
            to="/admin/forgot-password"
          >
            Quên mật khẩu?
          </Link>
          <Link
            className="text-blue-500 underline text-right"
            to="/admin/register"
          >
            Đăng ký tài khoản Sở VH-TT?
          </Link>
        </div>
        <Button
          loading={isPending}
          onClick={onSubmit}
          size="md"
          className="w-full mt-2"
        >
          Đăng nhập
        </Button>
        <div className="flex items-center gap-2 py-2">
          <div className="w-full h-[1px] bg-neutral-400"></div>
          <div className="whitespace-nowrap">Hoặc đăng nhặp bằng</div>
          <div className="w-full h-[1px] bg-neutral-400"></div>
        </div>
        <Button leftSection={<IconBrandGoogle />} size="md" color="teal">
          Đăng nhập bằng Google
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
