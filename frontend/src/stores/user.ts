import { create } from 'zustand';

import { User } from '@/types/user';
import { createSelectors } from './createSelectors';

export type AuthStatus = 'loading' | 'unauthorized' | 'authorized';

type State = {
  isAdminLogin: boolean;
  user: User | null;
  status: AuthStatus;
  accessToken: string;
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
  localStorage.clear();
  const reset = useUserStore.getState().reset;
  reset();
};

export const getAccessToken = () => {
  const { accessToken } = useUserStore.getState();
  return accessToken || localStorage.getItem('access_token');
};

export const setToken = (accessToken: string, refreshToken: string) => {
  const { setState } = useUserStore.getState();
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  setState({ accessToken });
};
