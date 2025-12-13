import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

const notificationSound = new Audio("/sounds/notification.mp3");

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

  updateChatsOrder: async () => {
    try {
      const res = await axiosInstance.get("/message/chats");
      set({ chats: res.data });
    } catch (e) {
      console.log("Error updating chats order:\n\n", e);
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
    const { selectedUser, messages, updateChatsOrder } = get();
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
      updateChatsOrder();
    } catch (e) {
      set({ messages: messages });
      toast.error("Something went wrong");
      console.log("\n\nError in sending message:\n\n", e);
    }
  },

  subscribeToMessage: () => {
    const { selectedUser, isSoundOn } = get();

    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      get().updateChatsOrder();
      const { selectedUser, isSoundOn } = get();
      const isMessageSentFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;
      
      if(isMessageSentFromSelectedUser) {
        const currentMessages = get().messages;
        set({ messages: [...currentMessages, newMessage] });
      }

      if(isSoundOn) {
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => {
          console.log("Error playing notification sound:\n", e);
        });
      }
    });
  },

  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

}));