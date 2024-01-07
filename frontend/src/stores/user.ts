import { create } from 'zustand';

import { User } from '@/types/user';
import { createSelectors } from './createSelectors';

export type AuthStatus = 'loading' | 'unauthorized' | 'authorized';

type State = {
  user: User | null;
  status: AuthStatus;
  accessToken: string;
};

type Actions = {
  setState: (state: State) => void;
  reset: () => void;
};

const initialState: State = {
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
    reset: () => {
      set({ ...initialState, status: 'authorized' });
    },
  })),
);

export const logout = () => {
  const reset = useUserStore.getState().reset;
  reset();
};

export const setToken = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};
