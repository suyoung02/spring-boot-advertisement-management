import { UpdateAdsPositionRequest, updateAdsPosition } from '@/apis/position';
import {
  approveRequirementPosition,
  deleteRequirementPosition,
  getAllRequirementPosition,
  rejectRequirementPosition,
} from '@/apis/requirement';
import { RequestUpdatePosition } from '@/components/RequestUpdate';
import { useControlStore } from '@/stores/control';
import { useUserStore } from '@/stores/user';
import { AdsPosition } from '@/types/ads';
import { RequirementStatus, Role } from '@/types/enum';
import { RequirementPosition } from '@/types/requirement';
import { STATUS_TITLE } from '@/utils/avatar';
import { sendAddReportMessage } from '@/utils/message';
import { ActionIcon, Group, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';

const ManageRequirementPosition = () => {
  const user = useUserStore.use.user();
  const client = useControlStore.use.client();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllRequirementPosition'],
    queryFn: () => getAllRequirementPosition(),
  });

  const [editId, setEditId] = useState(-1);

  const { mutate: approve } = useMutation({
    mutationFn: async ({
      reportId,
      ...data
    }: { reportId: number } & UpdateAdsPositionRequest) => {
      await updateAdsPosition(data);
      return approveRequirementPosition(reportId);
    },
    onSuccess: (_, variables) => {
      const staff = data?.find(
        (report) => report.id === variables.reportId,
      )?.staff;
      sendAddReportMessage(
        {
          toPerson: staff,
          message: `Yêu cầu của bạn đã được chấp nhận`,
          title: 'Phản hồi yêu cầu điểm quảng cáo',
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
    mutationFn: (id: number) => rejectRequirementPosition(id),
    onSuccess: (_, variables) => {
      const staff = data?.find((report) => report.id === variables)?.staff;
      sendAddReportMessage(
        {
          toPerson: staff,
          message: `Yêu cầu của bạn đã bị từ chối`,
          title: 'Phản hồi yêu cầu điểm quảng cáo',
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
    mutationFn: (id: number) => deleteRequirementPosition(id),
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

  const handleEdit = async (res: RequirementPosition) => {
    setEditId(res.id);
  };

  const handleCancel = () => {
    setEditId(-1);
  };

  const handleApprove = (id: number) => {
    const res = data?.find((d) => d.id === id);
    if (!res) return;
    const position = JSON.parse(res?.new_info) as AdsPosition;
    approve({
      reportId: res.id,
      ...position,
      id: res.ads_position,
      is_active: position.is_actived,
    });
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
        Yêu cầu thay đổi điểm quảng cáo
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
                <Table.Td className="w-[100px] break-all">{item.id}</Table.Td>
                <Table.Td>
                  <div className="w-[300px]">{item.new_info}</div>
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
                <Table.Td>
                  <Group gap={8} justify="flex-end" wrap="nowrap">
                    {item.status === RequirementStatus.IN_PROGRESS && (
                      <>
                        <ActionIcon
                          onClick={() =>
                            user?.role === Role.VHTT
                              ? handleApprove(item.id)
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
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {editId !== -1 && (
        <RequestUpdatePosition
          opened
          report={data?.find((d) => d.id === editId)}
          onClose={handleCancel}
        />
      )}
    </div>
  );
};

export default ManageRequirementPosition;
