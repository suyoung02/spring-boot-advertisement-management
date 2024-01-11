import useAuth from '@/hooks/useAuth';
import { ServerError } from '@/pages/Error';
import { useUserStore } from '@/stores/user';
import { LoadingOverlay } from '@mantine/core';
import { useLoadScript } from '@react-google-maps/api';
import { ReactNode, useState } from 'react';

type Props = {
  children: ReactNode;
};

const AuthorizedLayout = ({ children }: Props) => {
  useAuth();
  const status = useUserStore.use.status();

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
    </div>
  );
};

export default AuthorizedLayout;
