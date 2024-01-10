import { Role } from './enum';

export type User = {
  id: number;
  fullname: string;
  dob: string;
  email: string;
  phoneNumber: string;
  username: string;
  role: Role;
  ward: string;
  district: string;
};
