import { getAllAdsPosition } from '@/apis/position';

import { ActionIcon, Badge, Button, Group, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCirclePlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

const ManagePosition = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['getAllAdsPosition'],
    queryFn: () => getAllAdsPosition(),
  });

  const openModalDelete = () => {
    modals.openConfirmModal({
      title: `Bạn muốn xoá loại vị trí này?`,
      labels: { confirm: 'Xoá', cancel: 'Huỷ' },
      confirmProps: { color: 'red' },
      // onConfirm: () => handleDelete(title),
    });
  };

  return (
    <div className="p-8 pt-6">
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr className="flex items-center">
              <Table.Th className="w-[50px]">#</Table.Th>
              <Table.Th className="flex-1">Address</Table.Th>
              <Table.Th className="w-[150px]">Ads type</Table.Th>
              <Table.Th className="w-[100px]">Loại</Table.Th>
              <Table.Th className="w-[100px]">Tình trạng</Table.Th>
              <Table.Th className="w-[200px] flex justify-end">
                <Button
                  color="teal"
                  // onClick={() => setAdd(true)}
                  leftSection={<IconCirclePlus />}
                >
                  Tạo vị trí
                </Button>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!isLoading && !data?.length && (
              <Table.Tr>
                <Table.Td className="text-center" colSpan={6}>
                  <Text fz="sm">Chưa có dữ liệu</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {isLoading &&
              [1, 2, 3, 4, 5].map((index) => (
                <Table.Tr key={index}>
                  <Table.Td className="w-[100px]">
                    <div className="w-[50px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[300px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[200px] ml-auto h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                </Table.Tr>
              ))}
            {/* 
            {data?.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td className="w-[100px]">
                  <Text fz="sm">{item.id}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{item.address}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{item.ads_form}</Text>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{locationTypeTitle[item.location_type]}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={positionStatusColors[item.planning_status]}
                    variant="light"
                  >
                    {positionStatusTitle[item.planning_status]}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={8} justify="flex-end">
                    <ActionIcon
                      // onClick={() => handleEdit(index)}
                      variant="subtle"
                      color="gray"
                      size="lg"
                    >
                      <IconPencil size={24} />
                    </ActionIcon>
                    <ActionIcon
                      onClick={openModalDelete}
                      size="lg"
                      variant="subtle"
                      color="red"
                    >
                      <IconTrash size={24} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))} */}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
};

export default ManagePosition;
