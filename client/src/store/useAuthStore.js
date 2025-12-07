import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  isCheckingAuth: false,
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,

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
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
    } catch (e) {
      toast.error(e.response.data.message);
      console.log("Error in login auth store:\n\n", e);
    }
    set({ isLoggingIn: false });
  },

  logout: async() => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
    } catch (e) {
      toast.error("Error logging out. Please try again.");
      console.log("Error in logout auth store:\n\n", e);
    }
  },

  updateProfile: async(data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (e) {
      console.log("Error updating profile:\n\n", e);
      toast.error("Failed to update profile. Please try again.");
    }
  }

}));