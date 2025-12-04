import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  isCheckingAuth: false,
  authUser: null,
  isSigningUp: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
    } catch (e) {
      console.log('Error checking auth:', e);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");

    } catch (e) {
      toast.error(e.response.data.message);
      console.log("Error in signup auth store:\n\n", e);
    }
    set({ isSigningUp: false });
  }

}));