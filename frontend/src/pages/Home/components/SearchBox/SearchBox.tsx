import { useEffect, useRef } from 'react';

type Props = {
  onPlaceChanged?: (location?: google.maps.places.PlaceGeometry) => void;
  value?: string;
  readOnly?: boolean;
};

const SearchBox = ({ onPlaceChanged, value }: Props) => {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete>();
  const inputRef = useRef<any>();
  const options = {
    componentRestrictions: { country: 'ng' },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    types: ['establishment'],
  };

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options,
    );
    autoCompleteRef.current.addListener('place_changed', async function () {
      const place = await autoCompleteRef.current?.getPlace();
      onPlaceChanged?.(place?.geometry);
    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      placeholder="Search for Tide Information"
      style={{
        boxSizing: `border-box`,
        border: `1px solid transparent`,
        width: `240px`,
        height: `32px`,
        padding: `0 12px`,
        borderRadius: `3px`,
        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
        fontSize: `14px`,
        outline: `none`,
        textOverflow: `ellipses`,
      }}
    />
  );
};
export default SearchBox;
