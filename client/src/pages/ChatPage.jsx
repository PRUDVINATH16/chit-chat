import { useEffect } from "react";
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      // If the user is already typing in an input, textarea, or contenteditable, do nothing
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Check if the key is a single character (letters, numbers, symbols)
      if (e.key.length === 1) {
        const inputField = document.getElementById('message-input-field');
        if (inputField) {
          inputField.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
