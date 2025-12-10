import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

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
  },

  getMessageByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch(e) {
      toast.error("Something went wrong");
      console.log("\n\nError in getMessageByUserId:\n\n", e);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, getMyChats } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    }

    set({ messages: [...messages, optimisticMessage]});

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: messages.concat(res.data) });
      getMyChats();
    } catch (e) {
      set({ messages: messages });
      toast.error("Something went wrong");
      console.log("\n\nError in sending message:\n\n", e);
    }
  },

}));