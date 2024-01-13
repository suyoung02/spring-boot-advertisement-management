import { create } from 'zustand';

import { createSelectors } from './createSelectors';
import { CURRENT_LOCATION } from '@/utils/location';
import { Location } from '@/types/location';

export enum ModalName {
  ADD_POSITION = 'ADD_POSITION',
  ADD_PANEL = 'ADD_PANEL',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  POSITION_DETAIL = 'POSITION_DETAIL',
  PANEL_DETAIL = 'PANEL_DETAIL',
  REPORT = 'REPORT',
  REPORT_LIST = 'REPORT_LIST',
}

type State = {
  modal: ModalName | null;
  currentLocation: Location;
};

type Actions = {
  setModal: (modal: State['modal']) => void;
  onCloseModal: () => void;
  setCurrentLocation: (location: State['currentLocation']) => void;
};

const initialState: State = {
  modal: null,
  currentLocation: CURRENT_LOCATION,
};

export const useControlStore = createSelectors(
  create<State & Actions>((set) => ({
    ...initialState,
    setModal: (modal) => {
      set({ modal });
    },
    onCloseModal: () => {
      set({ modal: null });
    },
    setCurrentLocation: (location) => {
      set({ currentLocation: location });
    },
  })),
);
