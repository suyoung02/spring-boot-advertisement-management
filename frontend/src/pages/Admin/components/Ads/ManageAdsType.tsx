import {
  UpdateAdsTypeRequest,
  addAdsType,
  deleteAdsType,
  getAllAdsType,
  updateAdsType,
} from '@/apis/ads';
import { IconInput } from '@/components/IconInput';
import { getImageUrl, storageRef, uploadFile } from '@/configs/firebase';
import { useForm } from '@/hooks/useForm';
import { AdsType } from '@/types/ads';
import { classNames } from '@/utils/classNames';
import { createFile } from '@/utils/stringToPath';
import {
  ActionIcon,
  Button,
  ColorInput,
  Group,
  Input,
  Table,
  Text,
} from '@mantine/core';
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

type AdsTypeForm = Omit<AdsType, 'icon'> & {
  icon: File | null;
};

const ManageAdsType = () => {
  const [editId, setEditId] = useState(-1);
  const [add, setAdd] = useState(false);
  const { fields, onChangeField, reset, setFields } = useForm<AdsTypeForm>({
    defaultState: {
      title: '',
      color: '#fff',
      icon: null,
    },
    config: {
      title: {
        required: true,
      },
      color: {
        required: true,
      },
    },
  });

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
    mutationFn: (data: AdsType) => addAdsType(data),
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

  const handleCancel = (isAdd?: boolean) => {
    reset();
    setEditId(-1);
    isAdd && setAdd(false);
  };

  const handleEdit = async (index: number) => {
    if (!data) return;
    setAdd(false);
    setEditId(index);
    const img = data[index].icon && (await createFile(data[index].icon));
    console.log(data[index]);
    setFields({
      title: data[index].title,
      color: data[index].color,
      icon: img || null,
    });
  };

  const uploadImage = async (file: File) => {
    const ref = storageRef(`files/${file.name}`);
    const res = await uploadFile(file, ref);
    if (!res) return;
    const url = await getImageUrl(res.ref);
    return url;
  };

  const handleUpdate = async () => {
    if (!data) return;
    const icon = fields.icon && (await uploadImage(fields.icon));
    update({
      title: data[editId].title,
      adsType: { ...fields, icon: icon || '' },
    });
  };

  const handleAdd = async () => {
    const icon = fields.icon && (await uploadImage(fields.icon));
    addAds({ ...fields, icon: icon || '' });
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
      <div className="font-bold mb-3 text-xl">Quản lý loại quảng cáo</div>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[100px]">#</Table.Th>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Màu sắc</Table.Th>
              <Table.Th>Icon</Table.Th>
              <Table.Th className="flex justify-end">
                <Button
                  color="teal"
                  onClick={() => {
                    setAdd(true);
                    setEditId(-1);
                    reset();
                  }}
                  leftSection={<IconCirclePlus />}
                >
                  Tạo Ads type
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
                    value={fields.title}
                    placeholder="Ads title"
                    onChange={(e) => onChangeField('title', e.target.value)}
                  />
                </Table.Td>
                <Table.Td>
                  <ColorInput
                    value={fields.color}
                    placeholder="Ads color"
                    className="w-[150px]"
                    onChange={(value) => onChangeField('color', value)}
                  />
                </Table.Td>
                <Table.Td>
                  <IconInput
                    onChange={(e) => onChangeField('icon', e)}
                    wrapperClass="flex-row-reverse justify-end"
                    className="max-w-[150px] whitespace-nowrap text-ellipsis"
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
                <Table.Td className="text-center" colSpan={5}>
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
                    <div className="w-[50px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[50px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[200px] ml-auto h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                </Table.Tr>
              ))}

            {data?.map((item, index) => (
              <Table.Tr key={index}>
                {editId !== index ? (
                  <>
                    <Table.Td className="w-[100px]">
                      <Text fz="sm">{index + 1}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{item.title}</Text>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center gap-1">
                        <div
                          className={classNames('w-8 h-8', {
                            border: !!item.color,
                          })}
                          style={{ background: item.color }}
                        />
                        <span>{item.color}</span>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      {item.icon && (
                        <div className="w-8 h-8">
                          <img
                            alt="icon"
                            src={item.icon}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </Table.Td>
                  </>
                ) : (
                  <>
                    <Table.Td className="w-[100px]">
                      <Text fz="sm">{index + 1}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Input
                        value={fields.title}
                        placeholder="Ads title"
                        onChange={(e) => onChangeField('title', e.target.value)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <ColorInput
                        value={fields.color || undefined}
                        placeholder="Ads color"
                        className="w-[150px]"
                        onChange={(value) => onChangeField('color', value)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <IconInput
                        value={fields.icon}
                        onChange={(e) => onChangeField('icon', e)}
                        wrapperClass="flex-row-reverse justify-end"
                        className="max-w-[150px] whitespace-nowrap text-ellipsis"
                      />
                    </Table.Td>
                  </>
                )}
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

export default ManageAdsType;
