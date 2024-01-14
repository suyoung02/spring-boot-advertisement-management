import {
  UpdateRequirementPanelRequest,
  approveRequirementPanel,
  deleteRequirementPanel,
  getAllRequirementPanel,
  rejectRequirementPanel,
  updateRequirementPanel,
} from '@/apis/requirement';
import { useForm } from '@/hooks/useForm';
import { useControlStore } from '@/stores/control';
import { useUserStore } from '@/stores/user';
import { Role } from '@/types/enum';
import { RequirementPanel } from '@/types/requirement';
import { STATUS_TITLE } from '@/utils/avatar';
import { sendAddReportMessage } from '@/utils/message';
import { ActionIcon, Group, Table, Text, Textarea } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const ManageRequirementAds = () => {
  const user = useUserStore.use.user();
  const client = useControlStore.use.client();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllRequirementPanel'],
    queryFn: () => getAllRequirementPanel(),
  });

  const [editId, setEditId] = useState(-1);

  const { fields, onChangeField, reset, setFields, error, onError } =
    useForm<UpdateRequirementPanelRequest>({
      defaultState: {
        ads_panel: editId,
        new_info: '',
        reason: '',
        time_submit: new Date(),
        staff: user?.id as number,
      },
      config: {
        new_info: {
          required: true,
        },
        reason: {
          required: true,
        },
      },
    });

  const { mutate: update } = useMutation({
    mutationFn: (data: UpdateRequirementPanelRequest) =>
      updateRequirementPanel(editId, data),
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

  useEffect(() => {
    onChangeField('ads_panel', editId);
  }, [editId]);

  const { mutate: approve } = useMutation({
    mutationFn: (id: number) => approveRequirementPanel(id),
    onSuccess: (_, variables) => {
      const staff = data?.find((report) => report.id === variables)?.staff;
      sendAddReportMessage(
        {
          toPerson: staff,
          message: `Yêu cầu của bạn đã được chấp nhận`,
          title: 'Phản hồi yêu cầu quảng cáo',
        },
        client,
      );
      refetch();
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const { mutate: reject } = useMutation({
    mutationFn: (id: number) => rejectRequirementPanel(id),
    onSuccess: (_, variables) => {
      const staff = data?.find((report) => report.id === variables)?.staff;
      sendAddReportMessage(
        {
          toPerson: staff,
          message: `Yêu cầu của bạn đã bị từ chối`,
          title: 'Phản hồi yêu cầu quảng cáo',
        },
        client,
      );
      refetch();
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const { mutate } = useMutation({
    mutationFn: (id: number) => deleteRequirementPanel(id),
    onSuccess: () => {
      refetch();
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Có lỗi xảy ra',
        message: e.message,
      });
    },
  });

  const handleEdit = async (res: RequirementPanel) => {
    if (!data) return;
    setEditId(res.id);
    setFields(res);
  };

  const handleUpdate = () => {
    const err = onError();
    if (err) return;
    update(fields);
  };

  const handleCancel = () => {
    reset();
    setEditId(-1);
  };

  const openModalDelete = (id: number) => {
    modals.openConfirmModal({
      title: `Bạn muốn xoá yêu cầu này?`,
      labels: { confirm: 'Xoá', cancel: 'Huỷ' },
      confirmProps: { color: 'red' },
      onConfirm: () => mutate(id),
    });
  };

  return (
    <div className="p-8 pt-6">
      <div className="font-bold mb-3 text-xl">
        Yêu cầu thay đổi bảng quảng cáo
      </div>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[100px]">#</Table.Th>
              <Table.Th>Nội dung</Table.Th>
              <Table.Th>Lý do</Table.Th>
              <Table.Th>Tình trạng</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
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
                    <div className="w-[300px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[100px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[100px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                </Table.Tr>
              ))}

            {data?.map((item) => (
              <Table.Tr key={item.id}>
                {editId !== item.id ? (
                  <>
                    <Table.Td className="w-[100px]">
                      <Text fz="sm">{item.id}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{item.new_info}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{item.reason}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{STATUS_TITLE[item.status]}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">
                        {dayjs(item.time_submit).format('DD/MM/YYYY - HH:mm')}
                      </Text>
                    </Table.Td>
                  </>
                ) : (
                  <>
                    <Table.Td className="w-[100px]">
                      <Text fz="sm">{item.id}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Textarea
                        value={fields.new_info}
                        placeholder="Ads title"
                        error={error.new_info}
                        onChange={(e) =>
                          onChangeField('new_info', e.target.value)
                        }
                      />
                    </Table.Td>
                    <Table.Td>
                      <Textarea
                        value={fields.reason}
                        placeholder="Ads title"
                        error={error.reason}
                        onChange={(e) =>
                          onChangeField('reason', e.target.value)
                        }
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{STATUS_TITLE[item.status]}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">
                        {dayjs(item.time_submit).format('DD/MM/YYYY - HH:mm')}
                      </Text>
                    </Table.Td>
                  </>
                )}
                <Table.Td>
                  <Group gap={8} justify="flex-end" wrap="nowrap">
                    {editId !== item.id ? (
                      <>
                        <ActionIcon
                          onClick={() =>
                            user?.role === Role.VHTT
                              ? approve(item.id)
                              : handleEdit(item)
                          }
                          variant="subtle"
                          color="gray"
                          size="lg"
                        >
                          {user?.role === Role.VHTT ? (
                            <IconCheck size={24} color="green" />
                          ) : (
                            <IconPencil size={24} />
                          )}
                        </ActionIcon>
                        <ActionIcon
                          onClick={() =>
                            user?.role === Role.VHTT
                              ? reject(item.id)
                              : openModalDelete(item.id)
                          }
                          // onClick={() => openModalDelete(item.title)}
                          size="lg"
                          variant="subtle"
                          color="red"
                        >
                          {user?.role === Role.VHTT ? (
                            <IconX size={24} />
                          ) : (
                            <IconTrash size={24} />
                          )}
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
                          onClick={handleCancel}
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

export default ManageRequirementAds;
