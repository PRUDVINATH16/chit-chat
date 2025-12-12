import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound"

function ChatsList() {

  const { getMyChats, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect( () => {
    getMyChats();
  }, [getMyChats]);

  if(isUsersLoading) return <UsersLoadingSkeleton />
  if(chats.length == 0) return <NoChatsFound />

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors'
          onClick={() => {
            setSelectedUser(chat);
          }}
        >
          <div className='flex items-center gap-3'>
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className='size-12 rounded-full'>
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                />
              </div>
            </div>
            <h4 className='text-slate-200 fond-medium truncate'>
              {chat.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}

export default ChatsList;