import { logoutApi } from '@/apis/user';
import { logout } from '@/stores/user';
import { User } from '@/types/user';
import { stringToHslColor } from '@/utils/avatar';
import { Avatar, Text, rem } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

type Props = {
  user: User;
};

const UserButton = ({ user }: Props) => {
  const handleLogout = async () => {
    await logoutApi();
    logout();
  };

  if (!user) return <></>;

  return (
    <div className="flex items-center justify-between gap-2">
      <Avatar color={stringToHslColor(user.fullname)} radius="xl">
        {user.fullname
          .split(' ')
          .map((name) => name[0])
          .slice(0, 2)}
      </Avatar>

      <div style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          {user.fullname}
        </Text>

        <Text c="dimmed" size="xs">
          {user.role}
        </Text>
      </div>

      <IconLogout
        className="cursor-pointer"
        onClick={handleLogout}
        style={{ width: rem(14), height: rem(14) }}
        stroke={1.5}
      />
    </div>
  );
};

export default UserButton;
