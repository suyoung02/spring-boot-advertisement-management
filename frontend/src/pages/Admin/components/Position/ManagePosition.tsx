import { deleteAdsPosition, getAllAdsPosition } from '@/apis/position';
import { RequestUpdatePosition } from '@/components/RequestUpdate';
import useLocationOptions from '@/hooks/useLocationOptions';
import { AddPosition } from '@/pages/Home/components/AddAds';
import { PositionDetail } from '@/pages/Home/components/Ads';
import { useUserStore } from '@/stores/user';
import { Position } from '@/types/ads';
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
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconCirclePlus,
  IconPencil,
  IconPencilPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

const ManagePosition = () => {
  const user = useUserStore.use.user();
  const { districts } = useLocationOptions({ district: user?.district });

  const [selectedWards, setSelectedWards] = useState<string[]>([]);

  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setSelectedDistricts([user.district]);
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
    queryKey: ['getAllAdsPosition'],
    queryFn: () => getAllAdsPosition(),
  });

  const filterData = useMemo(() => {
    return data?.filter((pos) => {
      const isIncludeDistrict = selectedDistricts.length
        ? selectedDistricts.includes(pos.adsPosition.district)
        : true;

      const filterWards = selectedWards.filter((ward) => {
        const [, district] = ward.split('_');
        return district === pos.adsPosition.district;
      });

      const isIncludeWard = filterWards.length
        ? filterWards
            .map((ward) => {
              const [_ward] = ward.split('_');
              return _ward;
            })
            .includes(pos.adsPosition.ward)
        : true;

      return isIncludeDistrict && isIncludeWard;
    });
  }, [data, selectedDistricts, selectedWards]);

  const [add, setAdd] = useState(false);
  const [view, setView] = useState(false);
  const [request, setRequest] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  const { mutate } = useMutation({
    mutationFn: (id: number) => deleteAdsPosition(id),
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

  const handleDetail = (position: Position) => {
    setView(true);
    setPosition(position);
  };

  const openModalDelete = (id: number) => {
    modals.openConfirmModal({
      title: `Bạn muốn xoá vị trí này?`,
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
          disabled={user?.role === Role.WARD}
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
              <Table.Th className="w-[150px]">Ads type</Table.Th>
              <Table.Th className="w-[100px]">Loại</Table.Th>
              <Table.Th className="w-[100px]">Tình trạng</Table.Th>
              <Table.Th className="w-[200px]">
                <div className="flex justify-end">
                  <Button
                    color="teal"
                    onClick={() => setAdd(true)}
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
                  <Text fz="sm">{item.adsForm.title}</Text>
                </Table.Td>
                <Table.Td
                  className="w-[150px] cursor-pointer"
                  onClick={() => handleDetail(item)}
                >
                  <Text fz="sm">{item.locationType.title}</Text>
                </Table.Td>
                <Table.Td
                  className="cursor-pointer"
                  onClick={() => handleDetail(item)}
                >
                  <Badge color={item.planningStatus.color} variant="outline">
                    {item.planningStatus.title}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={8} justify="flex-end">
                    {user?.role === Role.VHTT ? (
                      <>
                        <ActionIcon
                          onClick={() => {
                            setAdd(true);
                            setPosition(item);
                          }}
                          variant="subtle"
                          color="gray"
                          size="lg"
                        >
                          <IconPencil size={24} />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => openModalDelete(item.adsPosition.id)}
                          size="lg"
                          variant="subtle"
                          color="red"
                        >
                          <IconTrash size={24} />
                        </ActionIcon>
                      </>
                    ) : (
                      <ActionIcon
                        onClick={() => {
                          setRequest(true);
                          setPosition(item);
                        }}
                        variant="subtle"
                        color="gray"
                        size="lg"
                      >
                        <IconPencilPlus size={24} />
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {add && (
        <AddPosition
          opened
          onClose={() => {
            refetch();
            setAdd(false);
            setPosition(null);
          }}
          position={position || undefined}
        />
      )}
      {position && (
        <PositionDetail
          opened={view}
          onClose={() => {
            setView(false);
            setPosition(null);
          }}
          id={position.adsPosition.id}
        />
      )}
      {position && (
        <RequestUpdatePosition
          position={position?.adsPosition.id}
          opened={request}
          onClose={() => {
            setRequest(false);
            setPosition(null);
          }}
        />
      )}
    </div>
  );
};

export default ManagePosition;
