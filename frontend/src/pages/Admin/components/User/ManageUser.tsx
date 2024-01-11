import { getAllStaff } from '@/apis/staff';
import { Role } from '@/types/enum';
import { ROLE_TITLE, stringToHslColor } from '@/utils/avatar';
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Group,
  Table,
  Text,
  rem,
} from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import UserDetail from './UserDetail';

// eslint-disable-next-line react-refresh/only-export-components
export const JOB_COLORS: Record<string, string> = {
  [Role.DISTRICT]: 'blue',
  [Role.VHTT]: 'cyan',
  [Role.WARD]: 'pink',
} as const;

const ManageUser = () => {
  const [userId, setUserId] = useState<number>();

  const { data, isLoading } = useQuery({
    queryKey: ['getAllStaff'],
    queryFn: () => getAllStaff(),
  });

  return (
    <div className="p-8 pt-6">
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Chức vụ</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Số điện thoại</Table.Th>
              <Table.Th>Quận</Table.Th>
              <Table.Th>Phường</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading &&
              [1, 2, 3].map((index) => (
                <Table.Tr key={index}>
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <Table.Td key={`${index}_${idx}`} className="w-[120px]">
                      <div className="h-6 w-5/6 bg-neutral-300 animate-pulse"></div>
                    </Table.Td>
                  ))}
                  <Table.Td>
                    <div className="w-[200px] ml-auto h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                </Table.Tr>
              ))}
            {data?.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar
                      size={30}
                      radius={30}
                      color={stringToHslColor(user.fullname)}
                    >
                      {user.fullname
                        .split(' ')
                        .map((name) => name[0])
                        .slice(0, 2)}
                    </Avatar>
                    <Text fz="sm" fw={500}>
                      {user.fullname}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge color={JOB_COLORS[user.role]} variant="light">
                    {ROLE_TITLE[user.role]}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Anchor
                    title={user.email}
                    className="w-[110px] line-clamp-1 text-ellipsis"
                    component="button"
                    size="sm"
                  >
                    {user.email}
                  </Anchor>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{user.phoneNumber}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{user.district}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{user.ward || 'Tất cả'}</Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    onClick={() => setUserId(user.id)}
                    variant="subtle"
                    color="gray"
                  >
                    <IconPencil
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {userId && (
        <UserDetail
          opened
          id={userId}
          onClose={() => {
            setUserId(undefined);
          }}
        />
      )}
    </div>
  );
};

export default ManageUser;
