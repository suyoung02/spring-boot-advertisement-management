import { getAllStaff } from '@/apis/staff';
import { Role } from '@/types/enum';
import { ROLE_TITLE, stringToHslColor } from '@/utils/avatar';
import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  rem,
  Menu,
  TextInput,
} from '@mantine/core';
import {
  IconDots,
  IconMessages,
  IconNote,
  IconPencil,
  IconReportAnalytics,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

const jobColors: Record<string, string> = {
  [Role.DISTRICT]: 'blue',
  [Role.VHTT]: 'cyan',
  [Role.WARD]: 'pink',
};

const ManageUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['getAllStaff'],
    queryFn: () => getAllStaff(),
  });

  return (
    <div className="p-8 pt-6">
      <TextInput
        className="mb-3"
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
      />
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
                  <Badge color={jobColors[user.role]} variant="light">
                    {ROLE_TITLE[user.role]}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Anchor component="button" size="sm">
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
                  <Text fz="sm">{user.ward}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={0} justify="flex-end">
                    <ActionIcon variant="subtle" color="gray">
                      <IconPencil
                        style={{ width: rem(16), height: rem(16) }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                    <Menu
                      transitionProps={{ transition: 'pop' }}
                      withArrow
                      position="bottom-end"
                      withinPortal
                    >
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDots
                            style={{ width: rem(16), height: rem(16) }}
                            stroke={1.5}
                          />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={
                            <IconMessages
                              style={{ width: rem(16), height: rem(16) }}
                              stroke={1.5}
                            />
                          }
                        >
                          Send message
                        </Menu.Item>
                        <Menu.Item
                          leftSection={
                            <IconNote
                              style={{ width: rem(16), height: rem(16) }}
                              stroke={1.5}
                            />
                          }
                        >
                          Add note
                        </Menu.Item>
                        <Menu.Item
                          leftSection={
                            <IconReportAnalytics
                              style={{ width: rem(16), height: rem(16) }}
                              stroke={1.5}
                            />
                          }
                        >
                          Analytics
                        </Menu.Item>
                        <Menu.Item
                          leftSection={
                            <IconTrash
                              style={{ width: rem(16), height: rem(16) }}
                              stroke={1.5}
                            />
                          }
                          color="red"
                        >
                          Terminate contract
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
};

export default ManageUser;
