export type ReportType = {
  title: string;
  color: string;
  icon: string;
};

export type Report = {
  id: number;
  reportForm: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  content: string;
  state: string;
  deviceId: string;
  image1: string;
  image2: string;
  solving: string;
};
