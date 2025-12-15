import { useState, useRef, useEffect } from 'react';
import { LogOutIcon, VolumeOffIcon, Volume2Icon, MoreVerticalIcon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const mouseClickedSound = new Audio('/sounds/mouse-click.mp3');

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundOn, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64data = reader.result;
      setSelectedImg(base64data);
      await updateProfile({ profilePic: base64data });
    };
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSoundToggle = () => {
    mouseClickedSound.currentTime = 0;
    mouseClickedSound.play().catch((e) => console.log('Error playing sound:', e));
    toggleSound();
  };

  return (
    <div className="p-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-12 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || '/avatar.png'}
                alt="User Image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-sm max-w-[180px] truncate">{authUser.fullName}</h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* OPTIONS MENU */}
        <div className="relative" ref={menuRef}>
          <button className="text-slate-400 hover:text-slate-200 transition-colors" onClick={toggleMenu}>
            <MoreVerticalIcon className="size-5" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                    onClick={handleSoundToggle}
                  >
                    {isSoundOn ? <Volume2Icon className="size-4" /> : <VolumeOffIcon className="size-4" />}
                    <span>Sound ({isSoundOn ? 'On' : 'Off'})</span>
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                    onClick={logout}
                  >
                    <LogOutIcon className="size-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
