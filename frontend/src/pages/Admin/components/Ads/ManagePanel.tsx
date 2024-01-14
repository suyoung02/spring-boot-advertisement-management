import { getAllPresentingPanel } from '@/apis/position';
import useLocationOptions from '@/hooks/useLocationOptions';
import { useUserStore } from '@/stores/user';

import { AddPanel } from '@/pages/Home/components/AddAds';
import { ModalName, useControlStore } from '@/stores/control';
import { Role } from '@/types/enum';
import { getFullAddress } from '@/utils/location';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  MultiSelect,
  Table,
  Text,
} from '@mantine/core';
import {
  IconCheck,
  IconCirclePlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import PanelDetail from './PanelDetail';
import {
  approveContract,
  deleteContract,
  rejectContract,
} from '@/apis/contract';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';

const ManagePanel = () => {
  const user = useUserStore.use.user();
  const { districts } = useLocationOptions({ district: user?.district });

  const modal = useControlStore.use.modal();
  const setModal = useControlStore.use.setModal();
  const onCloseModal = useControlStore.use.onCloseModal();
  const [selectedWards, setSelectedWards] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      user.district && setSelectedDistricts([user.district]);
      user.ward && setSelectedWards([`${user.district}_${user.ward}`]);
    }
  }, [user]);

  const wards = useMemo(() => {
    const len = selectedDistricts.length;
    return (
      districts
        .find((district) => district.value === selectedDistricts[len - 1])
        ?.wards.map((ward) => ({
          value: `${ward.name}_${selectedDistricts[len - 1]}`,
          label: ward.name,
          district: selectedDistricts[len - 1],
        })) || []
    );
  }, [districts, selectedDistricts]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getAllPresentingPanel'],
    queryFn: () => getAllPresentingPanel(),
  });

  const filterData = useMemo(() => {
    return data?.filter((panel) => {
      const isIncludeDistrict = selectedDistricts.length
        ? selectedDistricts.includes(panel.adsPosition.district)
        : true;

      const filterWards = selectedWards.filter((ward) => {
        const [, district] = ward.split('_');
        return district === panel.adsPosition.district;
      });

      const isIncludeWard = filterWards.length
        ? filterWards
            .map((ward) => {
              const [_ward] = ward.split('_');
              return _ward;
            })
            .includes(panel.adsPosition.ward)
        : true;

      return isIncludeDistrict && isIncludeWard;
    });
  }, [data, selectedDistricts, selectedWards]);

  const [panel, setPanel] = useState<PanelDetail | null>(null);
  const [view, setView] = useState(false);

  const handleDetail = (panel: PanelDetail) => {
    setView(true);
    setPanel(panel);
  };

  const { mutate: approve } = useMutation({
    mutationFn: (id: number) => approveContract(id),
    onSuccess: () => {
      refetch();
      notifications.show({ message: 'Chấp nhận thành công' });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: 'Có lỗi xảy ra vui lòng thử lại',
      });
    },
  });

  const { mutate: reject } = useMutation({
    mutationFn: (id: number) => rejectContract(id),
    onSuccess: () => {
      refetch();
      notifications.show({ message: 'Từ chối thành công' });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: 'Có lỗi xảy ra vui lòng thử lại',
      });
    },
  });

  const { mutate } = useMutation({
    mutationFn: (id: number) => deleteContract(id),
    onSuccess: () => {
      refetch();
      notifications.show({ message: 'Xoá thành công' });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        message: 'Có lỗi xảy ra vui lòng thử lại',
      });
    },
  });

  const handleApprove = (id: number) => {
    approve(id);
  };

  const handleReject = (id: number) => {
    reject(id);
  };

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: `Bạn muốn xoá bảng quảng cáo này?`,
      labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
      confirmProps: { color: 'red' },
      onConfirm: () => mutate(id),
    });
  };

  return (
    <div className="p-8 pt-6">
      <div className="flex gap-4 w-full">
        <MultiSelect
          data={districts}
          value={selectedDistricts}
          className="w-1/4"
          disabled={user?.role !== Role.VHTT}
          readOnly={user?.role !== Role.VHTT}
          placeholder="Chọn quận"
          onChange={setSelectedDistricts}
        />
        <MultiSelect
          data={wards}
          value={selectedWards}
          className="w-3/4"
          readOnly={user?.role === Role.WARD}
          disabled={
            user?.role === Role.WARD ||
            (user?.role === Role.DISTRICT && !!user.ward)
          }
          placeholder="Chọn phường"
          onChange={setSelectedWards}
        />
      </div>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-[50px]">#</Table.Th>
              <Table.Th className="w-[200px]">Address</Table.Th>
              <Table.Th className="w-[150px]">Loại</Table.Th>
              <Table.Th className="w-[150px]">Hình thức</Table.Th>
              <Table.Th className="w-[100px]">Tình trạng</Table.Th>
              <Table.Th className="w-[200px]">
                <div className="flex justify-end">
                  <Button
                    color="teal"
                    onClick={() => setModal(ModalName.ADD_PANEL)}
                    leftSection={<IconCirclePlus />}
                  >
                    Tạo vị trí
                  </Button>
                </div>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!isLoading && !filterData?.length && (
              <Table.Tr>
                <Table.Td className="text-center" colSpan={6}>
                  <Text fz="sm">Chưa có dữ liệu</Text>
                </Table.Td>
              </Table.Tr>
            )}
            {isLoading &&
              [1, 2, 3, 4, 5].map((index) => (
                <Table.Tr key={index}>
                  <Table.Td className="w-[50px]">
                    <div className="w-[50px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[200px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[100px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[100px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[100px] h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                  <Table.Td>
                    <div className="w-[200px] ml-auto h-6 bg-neutral-300 animate-pulse"></div>
                  </Table.Td>
                </Table.Tr>
              ))}

            {filterData?.map((item) => (
              <Table.Tr key={item.adsPosition.id}>
                <Table.Td
                  className="cursor-pointer w-[50px]"
                  onClick={() => handleDetail(item)}
                >
                  <Text fz="sm">{item.adsPosition.id}</Text>
                </Table.Td>
                <Table.Td
                  className="cursor-pointer w-[200px]"
                  onClick={() => handleDetail(item)}
                >
                  <Text
                    title={getFullAddress(item.adsPosition)}
                    fz="sm"
                    lineClamp={2}
                    className="text-ellipsis"
                  >
                    {getFullAddress(item.adsPosition)}
                  </Text>
                </Table.Td>
                <Table.Td
                  className="cursor-pointer"
                  onClick={() => handleDetail(item)}
                >
                  <Badge color={item.adsType.color} variant="outline">
                    {item.adsType.title}
                  </Badge>
                </Table.Td>
                <Table.Td
                  className="cursor-pointer"
                  onClick={() => handleDetail(item)}
                >
                  {item.adsPosition.ads_form}
                </Table.Td>
                <Table.Td
                  className="w-[150px] cursor-pointer"
                  onClick={() => setPanel(item)}
                >
                  <Text fz="sm">{item.contract.state}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={8} justify="flex-end">
                    {user?.role === Role.VHTT &&
                    user.id !== item.contract.staff ? (
                      <>
                        <ActionIcon
                          onClick={() => {
                            handleApprove(item.contract.id);
                          }}
                          variant="subtle"
                          color="green"
                          size="lg"
                        >
                          <IconCheck size={24} />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => {
                            handleReject(item.contract.id);
                          }}
                          size="lg"
                          variant="subtle"
                          color="red"
                        >
                          <IconX size={24} />
                        </ActionIcon>
                      </>
                    ) : (
                      <ActionIcon
                        onClick={() => {
                          handleDelete(item.contract.id);
                        }}
                        variant="subtle"
                        color="gray"
                        size="lg"
                      >
                        <IconTrash size={24} />
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {modal === ModalName.ADD_PANEL && (
        <AddPanel
          opened
          onClose={() => {
            onCloseModal();
            refetch();
          }}
          panel={panel || undefined}
        />
      )}
      {panel && (
        <PanelDetail
          opened={view}
          onClose={() => {
            setView(false);
            setPanel(null);
          }}
          id={panel.adsPanel.id}
        />
      )}
    </div>
  );
};

export default ManagePanel;
