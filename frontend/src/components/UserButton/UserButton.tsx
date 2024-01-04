import { Avatar, Text, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

const UserButton = () => {
  return (
    <div className="flex items-center justify-between gap-2">
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
        radius="xl"
      />

      <div style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          Harriette Spoonlicker
        </Text>

        <Text c="dimmed" size="xs">
          hspoonlicker@outlook.com
        </Text>
      </div>

      <IconChevronRight
        style={{ width: rem(14), height: rem(14) }}
        stroke={1.5}
      />
    </div>
  );
};

export default UserButton;
