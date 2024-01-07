import {
  UpdateAdsTypeRequest,
  addAdsType,
  deleteAdsType,
  getAllAdsType,
  updateAdsType,
} from '@/apis/ads';
import { Ads } from '@/types/ads';
import { ActionIcon, Button, Group, Input, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconCirclePlus,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const ManageAdsForm = () => {
  const [editId, setEditId] = useState(-1);
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllAdsType'],
    queryFn: () => getAllAdsType(),
  });

  const { mutate: update } = useMutation({
    mutationFn: (data: UpdateAdsTypeRequest) => updateAdsType(data),
    onSuccess: () => {
      handleCancel();
      refetch();
    },
    onError: (e) => {
      handleCancel();
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const { mutate: addAds } = useMutation({
    mutationFn: (data: Ads) => addAdsType(data),
    onSuccess: () => {
      handleCancel(true);
      refetch();
    },
    onError: (e) => {
      handleCancel(true);
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const { mutate: deleteAds } = useMutation({
    mutationFn: (data: string) => deleteAdsType(data),
    onSuccess: () => {
      handleCancel();
      refetch();
    },
    onError: (e) => {
      handleCancel();
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const handleChange = (title: string) => {
    setTitle(title);
  };

  const handleCancel = (isAdd?: boolean) => {
    setTitle('');
    setEditId(-1);
    isAdd && setAdd(false);
  };

  const handleEdit = (index: number) => {
    if (!data) return;
    setEditId(index);
    setTitle(data[index].title);
  };

  const handleUpdate = () => {
    if (!data) return;
    update({ title: data[editId].title, newTitle: title });
  };

  const handleAdd = () => {
    addAds({ title });
  };

  const handleDelete = (title: string) => {
    if (!data) return;
    deleteAds(title);
  };

  const openModalDelete = (title: string) => {
    modals.openConfirmModal({
      title: `Bạn muốn xoá loại ${title} này?`,
      labels: { confirm: 'Xoá', cancel: 'Huỷ' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleDelete(title),
    });
  };

  return (
    <div className="p-8 pt-6">
      <div className="font-bold mb-3 text-xl">Quản lý hình thức quảng cáo</div>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[100px]">#</Table.Th>
              <Table.Th>Tên</Table.Th>
              <Table.Th className="flex justify-end">
                <Button
                  color="teal"
                  onClick={() => setAdd(true)}
                  leftSection={<IconCirclePlus />}
                >
                  Tạo hình thức
                </Button>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {add && (
              <Table.Tr>
                <Table.Td className="w-[100px]" />
                <Table.Td>
                  <Input
                    value={title}
                    placeholder="Ads title"
                    onChange={(e) => handleChange(e.target.value)}
                  />
                </Table.Td>
                <Table.Td>
                  <Group gap={8} justify="flex-end">
                    <ActionIcon
                      onClick={handleAdd}
                      variant="subtle"
                      color="teal"
                      size="lg"
                    >
                      <IconCheck size={24} />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => handleCancel(true)}
                      variant="subtle"
                      color="red"
                      size="lg"
                    >
                      <IconX size={24} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            )}
            {!isLoading && !data?.length && (
              <Table.Tr>
                <Table.Td className="text-center" colSpan={3}>
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

            {data?.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td className="w-[100px]">
                  <Text fz="sm">{index + 1}</Text>
                </Table.Td>
                <Table.Td>
                  {editId !== index ? (
                    <Text fz="sm">{item.title}</Text>
                  ) : (
                    <Input
                      value={title}
                      placeholder="Ads title"
                      onChange={(e) => handleChange(e.target.value)}
                    />
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap={8} justify="flex-end">
                    {editId !== index ? (
                      <>
                        <ActionIcon
                          onClick={() => handleEdit(index)}
                          variant="subtle"
                          color="gray"
                          size="lg"
                        >
                          <IconPencil size={24} />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => openModalDelete(item.title)}
                          size="lg"
                          variant="subtle"
                          color="red"
                        >
                          <IconTrash size={24} />
                        </ActionIcon>
                      </>
                    ) : (
                      <>
                        <ActionIcon
                          onClick={handleUpdate}
                          variant="subtle"
                          color="teal"
                          size="lg"
                        >
                          <IconCheck size={24} />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => handleCancel()}
                          variant="subtle"
                          color="red"
                          size="lg"
                        >
                          <IconX size={24} />
                        </ActionIcon>
                      </>
                    )}
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

export default ManageAdsForm;
