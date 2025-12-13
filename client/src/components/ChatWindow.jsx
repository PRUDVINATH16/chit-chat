import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatWindow() {
  const { selectedUser, getMessageByUserId, messages, isMessagesLoading, subscribeToMessage, unsubscribeFromMessage } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessageByUserId(selectedUser._id);
    subscribeToMessage();

    return () => {
      unsubscribeFromMessage();
    }
  }, [selectedUser, getMessageByUserId, subscribeToMessage, unsubscribeFromMessage]);

  const messagesEndRef = (node) => {
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef(document.getElementById("messages-end"));
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-4 overflow-y-auto py-6">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"
                  }`}
              >
                <div
                  className={`chat-bubble relative ${msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                    }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt='shared'
                      className='rounded-lg h-40 object-cover'
                    />
                  )}
                  {msg.text && <p className='text-xs mt-1'>{msg.text}</p>}
                  <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : isMessagesLoading ? <MessagesLoadingSkeleton /> : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatWindow;