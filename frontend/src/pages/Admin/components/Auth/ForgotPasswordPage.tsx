import { Button, Input, Modal, PasswordInput, PinInput } from "@mantine/core";
import { IconArrowBack, IconLock, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-slate-200">
      <div className="min-w-[500px] flex flex-col gap-3 p-10 rounded-2xl shadow-lg bg-white">
        <h3 className="font-bold text-2xl text-center uppercase">
          Quên mật khẩu
        </h3>
        <Input.Wrapper label="Username">
          <Input leftSection={<IconUser />} placeholder="Username" />
        </Input.Wrapper>
        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Mật khẩu mới"
          placeholder="Mật khẩu mới"
        />
        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Xác nhận mật khẩu"
          placeholder="Xác nhận mật khẩu"
        />
        <Button
          onClick={() => setOpened(true)}
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
          onClick={() => navigate("/admin/login")}
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
          <PinInput length={5} className="mx-auto" />
          <div className="text-center text-blue-500 underline">
            Gửi lại mã OTP
          </div>
          <Button className="w-full">Xác nhận</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ForgotPasswordPage;
