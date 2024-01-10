import { Autocomplete } from '@react-google-maps/api';
import { useRef } from 'react';

type Props = {
  onPlaceChanged?: () => void;
  value?: string;
  readOnly?: boolean;
};

const SearchBox = ({ onPlaceChanged, value }: Props) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handleChanged = () => {
    console.log('change', autocompleteRef);
    onPlaceChanged?.();
  };

  return (
    <Autocomplete onPlaceChanged={handleChanged} onLoad={onLoad}>
      <input
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
    </Autocomplete>
  );
};
export default SearchBox;
