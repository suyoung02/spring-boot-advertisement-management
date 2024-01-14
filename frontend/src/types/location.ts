export type City = {
  name: string;
  code: number;
  divisionType: string;
  codename: string;
  phoneCode: number;
  districts: District[];
};

export type District = {
  name: string;
  code: number;
  codename: string;
  divisionType: string;
  shortCodename: string;
  wards?: District[];
};

export type Location = {
  lat: number;
  lng: number;
};

export type PlaceResponse = {
  results: Result[];
  status: string;
};

export type Result = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  reference: string;
  plus_code: PlusCode;
  compound: Compound;
  types: string[];
  name: string;
  address: string;
};

export type AddressComponent = {
  long_name: string;
  short_name: string;
};

export type Compound = {
  district: string;
  commune: string;
  province: string;
};

export type Geometry = {
  location: Location;
  boundary: null;
};

export type PlusCode = {
  compound_code: string;
  global_code: string;
};
