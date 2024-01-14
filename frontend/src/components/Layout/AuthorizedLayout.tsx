import useAuth from '@/hooks/useAuth';
import { ServerError } from '@/pages/Error';
import { useControlStore } from '@/stores/control';
import { useUserStore } from '@/stores/user';
import { Message } from '@/types/user';
import { getMachineId } from '@/utils/device';
import { AddReportParams } from '@/utils/message';
import { LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useLoadScript } from '@react-google-maps/api';
import { ReactNode, useState } from 'react';
import SockJsClient from 'react-stomp';

type Props = {
  children: ReactNode;
};

const AuthorizedLayout = ({ children }: Props) => {
  useAuth();
  const status = useUserStore.use.status();
  const user = useUserStore.use.user();
  const setClientSocket = useControlStore.use.setClientSocket();

  const onConnected = () => {
    console.info('Connected socket success!!');
  };

  const onMessageReceived = (data: Message, topic: string) => {
    if (topic === '/all/messages' && user) {
      const res = JSON.parse(data.text) as AddReportParams;
      notifications.show({
        color: 'cyan',
        message: res.message,
        title: res.title,
      });
      return;
    }
    if (
      topic === '/person/messages' &&
      !user &&
      data.toPerson === getMachineId()
    ) {
      const res = JSON.parse(data.text) as AddReportParams;
      notifications.show({
        color: 'green',
        message: res.message,
        title: res.title,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [libraries] = useState<any>(['places']);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAESSzwLBdEfkk_WpjVmHQ7_1s15q_S4rg',
    libraries,
  });

  if (loadError) {
    return <ServerError />;
  }

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen">
        <LoadingOverlay visible />
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="w-screen h-screen">
        <LoadingOverlay visible />
      </div>
    );
  }

  return (
    <div>
      {children}
      <div id="map" className="invisible"></div>
      <SockJsClient
        url="http://localhost:8081/ws"
        topics={[
          '/all/messages',
          '/person/messages',
          '/app/application',
          '/app/private',
        ]}
        onConnect={onConnected}
        onMessage={(data: any, topic: any) => {
          onMessageReceived(data, topic);
        }}
        debug={true}
        ref={(client: any) => {
          setClientSocket(client);
        }}
      />
    </div>
  );
};

export default AuthorizedLayout;
