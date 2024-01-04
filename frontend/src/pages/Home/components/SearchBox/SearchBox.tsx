import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

const SearchBox = () => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    console.log("change");
  };

  return (
    <Autocomplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
      <input
        type="text"
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
