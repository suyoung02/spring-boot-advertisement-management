import { Role } from './enum';

export type User = {
  id: number;
  fullname: string;
  dob: Date;
  email: string;
  phoneNumber: string;
  username: string;
  role: Role;
  ward: string;
  district: string;
};

export type Message = {
  text: string;
  toPerson: string;
};
