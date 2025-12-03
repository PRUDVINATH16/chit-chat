import {create} from 'zustand';

export const useAuthStore = create((set) => ({
  login: (user) => set({user})
}));