import { getLocationApi } from "@/apis/location";
import { Button, Input, PasswordInput, Select } from "@mantine/core";
import {
  IconArrowBack,
  IconBuilding,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["getLocationApi", 1],
    queryFn: () => getLocationApi(1),
  });

  const formatData = useMemo(() => {
    return data?.map((city) => ({ label: city.name, value: `${city.code}` }));
  }, [data]);

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-slate-200">
      <div className="min-w-[500px] flex flex-col gap-3 p-10 rounded-2xl shadow-lg bg-white">
        <h3 className="font-bold text-2xl text-center uppercase mb-4">
          Đăng ký tài khoản Sở VH-TT
        </h3>
        <Input.Wrapper label="Username">
          <Input leftSection={<IconUser />} placeholder="Username" />
        </Input.Wrapper>
        <Input.Wrapper label="Email">
          <Input leftSection={<IconMail />} placeholder="Email" />
        </Input.Wrapper>
        <Input.Wrapper label="Thành phố">
          <Select
            leftSection={<IconBuilding />}
            data={formatData}
            placeholder="Thành phố"
          />
        </Input.Wrapper>
        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Mật khẩu"
          placeholder="Mật khẩu"
        />
        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Xác nhận mật khẩu"
          placeholder="Xác nhận mật khẩu"
        />
        <Button size="md" className="w-full mt-2">
          Đăng ký
        </Button>
        <div className="flex items-center gap-2 py-2">
          <div className="w-full h-[1px] bg-neutral-400"></div>
          <div className="whitespace-nowrap">Bạn đã có tài khoản?</div>
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
    </div>
  );
};

export default RegisterPage;
