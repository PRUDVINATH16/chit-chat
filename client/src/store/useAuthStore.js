import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useChatStore } from './useChatStore'; // Import useChatStore

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://chit-chat-sr.onrender.com';

export const useAuthStore = create((set, get) => ({
  isCheckingAuth: false,
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
      get().connectSocket();
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

      get().connectSocket();

    } catch (e) {
      toast.error(e.response?.data?.message || "An error occurred during signup");
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

      get().connectSocket();
    } catch (e) {
      toast.error(e.response?.data?.message || "Login Failed. Please check your credentials.");
      console.log("Error in login auth store:\n\n", e);
    }
    set({ isLoggingIn: false });
  },

  logout: async() => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!");
      useChatStore.getState().clearChatState(); // Clear chat state
      get().disconnectSocket();
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
      toast.error(e.response?.data?.message || "Failed to update profile. Please try again.");
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {withCredentials: true});
    socket.connect();
    set({ socket });
    
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },

}));