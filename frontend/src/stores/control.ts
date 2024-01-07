import { create } from 'zustand';

import { createSelectors } from './createSelectors';

export enum ModalName {
  ADD_POSITION = 'ADD_POSITION',
}

type State = {
  modal: ModalName | null;
};

type Actions = {
  setModal: (modal: State['modal']) => void;
};

const initialState: State = {
  modal: null,
};

export const useControlStore = createSelectors(
  create<State & Actions>((set) => ({
    ...initialState,
    setModal: (modal) => {
      set({ modal });
    },
  })),
);
