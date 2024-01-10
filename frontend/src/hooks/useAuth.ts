import { getMe } from '@/apis/user';
import { useUserStore } from '@/stores/user';
import { useEffect } from 'react';

const useAuth = () => {
  const setState = useUserStore.use.setState();

  useEffect(() => {
    const isLogin = localStorage.getItem('accessToken');
    if (isLogin) {
      getMe()
        .then((res) => {
          setState({ user: res, status: 'authorized' });
        })
        .catch(() => setState({ user: null, status: 'unauthorized' }));
    } else {
      setState({ user: null, status: 'unauthorized' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAuth;
