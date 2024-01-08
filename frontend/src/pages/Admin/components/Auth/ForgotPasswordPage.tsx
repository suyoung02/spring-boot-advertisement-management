import {
  ForgetPasswordRequest,
  forgotPasswordApi,
  sendOtpApi,
} from '@/apis/user';
import { useForm } from '@/hooks/useForm';
import {
  Button,
  Modal,
  PasswordInput,
  PinInput,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowBack, IconLock, IconUser } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [otp, setOtp] = useState<string>('');

  const { fields, onError, onChangeField, error, reset } = useForm<
    Omit<ForgetPasswordRequest, 'otp'>
  >({
    defaultState: {
      username: '',
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
      username: {
        required: true,
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

  const { mutate: sendOtp, isPending } = useMutation({
    mutationFn: (username: string) => sendOtpApi(username),
    onSuccess: (data) => {
      console.log(data);
      setOpened(true);
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (data: ForgetPasswordRequest) => forgotPasswordApi(data),
    onSuccess: () => {
      reset();
      setOpened(false);
      notifications.show({
        message: 'Đổi mật khẩu thành công',
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

  const onSubmit = () => {
    const error = onError();
    console.log({ error });
    if (error) return;
    sendOtp(fields.username);
  };

  const onConfirm = () => {
    mutate({ ...fields, otp });
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-slate-200">
      <div className="min-w-[500px] flex flex-col gap-3 p-10 rounded-2xl shadow-lg bg-white">
        <h3 className="font-bold text-2xl text-center uppercase">
          Quên mật khẩu
        </h3>

        <TextInput
          withAsterisk
          label="Username"
          leftSection={<IconUser />}
          placeholder="Username"
          error={error.username}
          onChange={(e) => onChangeField('username', e.target.value)}
        />

        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Mật khẩu mới"
          placeholder="Mật khẩu mới"
          error={error.newPassword}
          onChange={(e) => onChangeField('newPassword', e.target.value)}
        />

        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Xác nhận mật khẩu"
          placeholder="Xác nhận mật khẩu"
          error={error.confirmPassword}
          onChange={(e) => onChangeField('confirmPassword', e.target.value)}
        />

        <Button
          loading={isPending}
          onClick={onSubmit}
          size="md"
          className="w-full mt-2"
        >
          Gửi mã OTP
        </Button>
        <div className="flex items-center gap-2 py-2">
          <div className="w-full h-[1px] bg-neutral-400"></div>
          <div className="whitespace-nowrap">Đăng nhập lại</div>
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
      </div>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Nhập mã OTP"
        closeOnClickOutside={false}
      >
        <div className="flex flex-col gap-3">
          <PinInput onChange={setOtp} length={6} className="mx-auto" />
          <div
            onClick={onSubmit}
            className="text-center cursor-pointer text-blue-500 underline"
          >
            Gửi lại mã OTP
          </div>
          <Button
            onClick={onConfirm}
            loading={loading}
            disabled={otp.length < 6}
            className="w-full"
          >
            Xác nhận
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ForgotPasswordPage;
