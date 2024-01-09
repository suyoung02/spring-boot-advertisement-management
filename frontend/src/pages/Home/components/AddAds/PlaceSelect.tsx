import { Combobox, InputBase, useCombobox } from '@mantine/core';
import { IconMapPinFilled } from '@tabler/icons-react';

export type Place = {
  value: string;
  photo: string[] | undefined;
  place_id: string | undefined;
  lat: number | undefined;
  lng: number | undefined;
  label: string;
  description: string;
};

type Props = {
  data: Place[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const PlaceSelect = ({ value, data, error, onChange }: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = data.length ? (
    data.map((item) => (
      <Combobox.Option
        value={item.value}
        key={item.value}
        className="flex items-center gap-2"
      >
        <IconMapPinFilled />
        <div className="flex flex-col gap-1">
          <div className="font-medium">{item.label}</div>
          <div className="text-neutral-700 text-sm">{item.description}</div>
        </div>
      </Combobox.Option>
    ))
  ) : (
    <Combobox.Option value="" disabled className="flex items-center gap-2">
      Chưa có dữ liệu
    </Combobox.Option>
  );

  const activeItem = data.find((d) => d.value === value)?.description;

  console.log(data.find((d) => d.value === value));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          readOnly
          label="Chọn vị trí"
          error={error}
          component="input"
          type="text"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          value={activeItem}
          placeholder="Chọn vị trí"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default PlaceSelect;
