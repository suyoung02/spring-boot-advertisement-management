import { Button, Input, PasswordInput } from "@mantine/core";
import { IconBrandGoogle, IconLock } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-slate-200">
      <div className="min-w-[500px] flex flex-col gap-3 p-10 rounded-2xl shadow-lg bg-white">
        <h3 className="font-bold text-2xl text-center uppercase">
          Đăng nhập hệ thống Quản lý
        </h3>
        <Input.Wrapper label="Email">
          <Input placeholder="Email" />
        </Input.Wrapper>
        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Mật khẩu"
          placeholder="Mật khẩu"
        />
        <Link
          className="text-blue-500 underline text-right"
          to="/admin/register"
        >
          Bạn muốn đăng ký tài khoản Sở VH-TT?
        </Link>
        <Button size="md" className="w-full mt-2">
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
      </div>
    </div>
  );
};

export default LoginPage;
