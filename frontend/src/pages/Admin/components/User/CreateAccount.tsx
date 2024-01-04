import { Button, Input, PasswordInput, Select } from "@mantine/core";
import {
  IconBuilding,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";

const CreateAccount = () => {
  return (
    <div className="w-full mt-10 flex items-center justify-center">
      <div className="w-1/2 max-w-[500px] flex flex-col gap-3">
        <h3 className="font-medium text-2xl mb-3 text-center">Tạo tài khoản</h3>
        <Input.Wrapper label="Username">
          <Input leftSection={<IconUser />} placeholder="Username" />
        </Input.Wrapper>
        <Input.Wrapper label="Email">
          <Input leftSection={<IconMail />} placeholder="Email" />
        </Input.Wrapper>
        <Input.Wrapper label="Thành phố">
          <Select
            leftSection={<IconBuilding />}
            // data={formatData}
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
          Tạo tài khoản
        </Button>
      </div>
    </div>
  );
};

export default CreateAccount;
