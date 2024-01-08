import { Button, Input, Modal, PasswordInput } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';

type Props = {
  opened: boolean;
  onClose: () => void;
};

const Register = ({ opened, onClose }: Props) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Đăng nhập">
      <div className="flex flex-col gap-4">
        {/* Modal content */}
        <Input.Wrapper label="Email">
          <Input placeholder="Email" />
        </Input.Wrapper>
        <PasswordInput
          withAsterisk
          leftSection={<IconLock />}
          label="Mật khẩu"
          placeholder="Mật khẩu"
        />
        <Button size="md" color="teal" className="w-full mt-2">
          Đăng nhập
        </Button>
      </div>
    </Modal>
  );
};

export default Register;
