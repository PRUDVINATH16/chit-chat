import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactsList from "../components/ContactsList";
import ChatWindow from "../components/ChatWindow";
import NoChatSelected from "../components/NoChatSelected";

function ChatPage() {

  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[95vh]">

      <BorderAnimatedContainer>
                <div className="w-full flex">
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          
          <ProfileHeader />

          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">

            {activeTab === "chats" ? <ChatsList /> : <ContactsList />}

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-1 flex-col bg-slate-900/50 backdrop-blur-sm">
          
          { selectedUser ? <ChatWindow /> : <NoChatSelected /> }

        </div>
        </div>

      </BorderAnimatedContainer>

    </div>
  );
}

export default ChatPage;
