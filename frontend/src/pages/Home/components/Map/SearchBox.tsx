import { Autocomplete } from "@mantine/core";

const SearchBox = () => {
  // const { data } = useQuery({ queryKey: ["searcg"], queryFn: () => {
  //   return fetch
  // } });

  return (
    <div className="absolute z-10 top-0 left-0 mt-10 ml-10">
      <Autocomplete
        placeholder="Pick value or enter anything"
        data={["React", "Angular", "Vue", "Svelte"]}
      />
    </div>
  );
};

export default SearchBox;
