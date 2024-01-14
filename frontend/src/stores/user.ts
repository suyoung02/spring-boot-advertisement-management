import { create } from 'zustand';

import { User } from '@/types/user';
import { createSelectors } from './createSelectors';

export type AuthStatus = 'loading' | 'unauthorized' | 'authorized';

type State = {
  isAdminLogin: boolean;
  user: User | null;
  status: AuthStatus;
  accessToken: string;
  expired_time: string | null;
};

type Actions = {
  setState: (state: Partial<State>) => void;
  setUser: (user: State['user'], isAdminLogin?: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  isAdminLogin: false,
  user: null,
  status: 'loading',
  accessToken: localStorage.getItem('accessToken') || '',
  expired_time: localStorage.getItem('expired_time') || null,
};

export const useUserStore = createSelectors(
  create<State & Actions>((set) => ({
    ...initialState,
    setState: (state) => {
      set(state);
    },
    setUser: (user, isAdminLogin = false) => {
      set({ user, isAdminLogin });
    },
    reset: () => {
      set({ ...initialState, status: 'authorized' });
    },
  })),
);

export const logout = () => {
  setToken('', '', undefined);
  const reset = useUserStore.getState().reset;
  reset();
};

export const getAccessToken = () => {
  const { accessToken } = useUserStore.getState();
  return accessToken || localStorage.getItem('access_token');
};

export const setToken = (
  accessToken: string,
  refreshToken: string,
  expired_time?: Date,
) => {
  const { setState } = useUserStore.getState();
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem(
    'expired_time',
    expired_time ? new Date(expired_time).toISOString() : '',
  );
  setState({
    accessToken,
    expired_time: expired_time ? new Date(expired_time).toISOString() : null,
  });
};

export const expiredToken = () => {
  const { expired_time, accessToken } = useUserStore.getState();
  if (!accessToken || !expired_time) return false;
  return +new Date(expired_time) <= +new Date();
};
