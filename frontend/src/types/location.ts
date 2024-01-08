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
