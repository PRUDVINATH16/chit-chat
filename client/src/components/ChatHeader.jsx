import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { XIcon } from "lucide-react";


function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const onlineUsers = useAuthStore(state => state.onlineUsers);

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 px-5 py-3">
      <div className="flex items-center space-x-3">
        <div className={`avatar ${onlineUsers.includes(selectedUser._id) ? "online" : "offline"}`}>
          <div className="w-11 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium text-base">{selectedUser.fullName}</h3>
          <p className='text-slate-400 text-sm'>{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
        </div>
      </div>
      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  )
}

export default ChatHeader;