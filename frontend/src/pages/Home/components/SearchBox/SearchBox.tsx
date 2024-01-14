import { placeSearch } from '@/apis/location';
import { Location } from '@/types/location';
import { Combobox, TextInput, useCombobox } from '@mantine/core';
import { IconMapPinFilled } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useMemo, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

type Props = {
  onPlaceChanged?: (location: Location) => void;
  readOnly?: boolean;
};

const SearchBox = ({ onPlaceChanged }: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [value, setValue] = useState<string>('');
  const debouncedValue = useDebounce<string>(value, 500);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    combobox.openDropdown();
    combobox.updateSelectedOptionIndex();
  };

  const { data } = useQuery({
    queryKey: ['placeSearch', debouncedValue],
    queryFn: () => placeSearch(debouncedValue),
    enabled: !!debouncedValue,
  });

  const options = useMemo(() => {
    return data?.results.map((res) => ({
      value: res.place_id,
      lat: res.geometry.location.lat,
      lng: res.geometry.location.lng,
      label: res.formatted_address,
      name: res.name,
    }));
  }, [data]);

  const handleChangePlace = (placeId: string) => {
    const place = options?.find((opt) => opt.value === placeId);
    place && setValue(place.label);
    place && onPlaceChanged?.({ lat: place.lat, lng: place.lng });
  };

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        handleChangePlace(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <TextInput
          className="w-[300px]"
          value={value}
          placeholder="Nhập địa chỉ tìm kiếm"
          onChange={handleChange}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {options?.length ? (
            options.map((item) => (
              <Combobox.Option
                value={`${item.value}`}
                key={item.value}
                className="flex items-center gap-2"
              >
                <IconMapPinFilled />
                <div className="flex flex-col gap-1">
                  <div className="text-neutral-700 text-sm font-semibold">
                    {item.name}
                  </div>
                  <div className="font-medium">{item.label}</div>
                </div>
              </Combobox.Option>
            ))
          ) : (
            <Combobox.Empty className="flex items-center gap-2">
              Chưa có dữ liệu
            </Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
export default SearchBox;
