import { getMe } from '@/apis/user';
import { useUserStore } from '@/stores/user';
import { useEffect } from 'react';

const useAuth = () => {
  const setState = useUserStore.use.setState();
  const accessToken = useUserStore.use.accessToken();

  useEffect(() => {
    const isLogin = !!accessToken;
    if (isLogin) {
      getMe()
        .then((res) => {
          setState({ user: res, status: 'authorized' });
        })
        .catch(() => setState({ user: null, status: 'unauthorized' }));
    } else {
      setState({ user: null, status: 'unauthorized' });
    }
  }, [accessToken, setState]);
};

export default useAuth;
