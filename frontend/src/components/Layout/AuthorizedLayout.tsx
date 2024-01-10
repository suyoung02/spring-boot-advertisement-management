import useAuth from '@/hooks/useAuth';
import { useUserStore } from '@/stores/user';
import { LoadingOverlay } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const AuthorizedLayout = ({ children }: Props) => {
  useAuth();
  const status = useUserStore.use.status();

  if (status === 'loading') {
    return (
      <div className="w-screen h-screen">
        <LoadingOverlay visible />
      </div>
    );
  }

  return children;
};

export default AuthorizedLayout;
