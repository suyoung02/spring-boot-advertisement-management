export type AddReportParams = {
  message: string;
  title: string;
};

export const sendAddReportMessage = (data: AddReportParams, client: any) => {
  const req = {
    text: JSON.stringify(data),
    toPerson: null,
  };
  client.sendMessage('/app/application', JSON.stringify(req));
};

export type UpdateReportParams = {
  title: string;
  message: string;
  deviceId: string;
};

export const sendUpdateReportMessage = (
  data: UpdateReportParams,
  client: any,
) => {
  const { deviceId, ...message } = data;
  const req = {
    text: JSON.stringify(message),
    toPerson: data.deviceId,
  };
  client.sendMessage('/app/private', JSON.stringify(req));
};
