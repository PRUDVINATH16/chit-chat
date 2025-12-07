import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({

  messages: [],
  chats: [],
  allContacts: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundOn: JSON.parse(localStorage.getItem("chit-chat-sound")) === true,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  
  toggleSound: () => {
    localStorage.setItem("chit-chat-sound", !get().isSoundOn);
    set({ isSoundOn: !get().isSoundOn });
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/contacts");
      set({ allContacts: res.data });
    } catch (e) {
      console.log("Error fetching contacts:\n\n", e);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChats: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/chats");
      set({ chats: res.data });
    } catch (e) {
      console.log("Error fetching chats:\n\n", e);
    } finally {
      set({ isUsersLoading: false });
    }
  }

}));