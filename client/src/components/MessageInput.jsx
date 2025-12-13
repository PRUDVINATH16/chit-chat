import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { toast } from 'react-hot-toast';
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

import useKeyboardSound from "../hooks/useKeyboardSounds";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundOn } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;
    if (isSoundOn) playRandomKeyStrokeSound();

    sendMessage({
      text: text,
      image: imagePreview,
    });
    setText('');
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file !!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="p-3 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-700" />

            <button
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              onClick={removeImage}
              type="button">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-3">
        <input type="text"
          id="message-input-field"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundOn && playRandomKeyStrokeSound();
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-1.5 px-3"
          placeholder="Type your message..."
        />
        <input type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-3 transition-colors ${imagePreview ? 'text-cyan-500' : ''}`}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-3 py-1.5 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}

export default MessageInput;