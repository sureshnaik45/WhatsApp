import React, { useState, useEffect, useRef } from 'react';
// 1. Importing all the necessary icons for the new UI
import { ChevronDown, Bell, BellOff, Archive, Trash2 } from 'lucide-react';

const ChatItem = ({ chat, onAvatarClick, onChatClick, status, onMuteToggle, onArchive, onDelete }) => {
  // 2. State to manage hover and menu visibility
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 3. This hook handles closing the menu when you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    // Only add the event listener when the menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    // Clean up the event listener on unmount or when menu closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);


  const borderClass = status && !status.viewed ? "border-green-500" : "border-gray-300";
  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevents the chat from being opened
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMute = (e) => {
    e.stopPropagation();
    onMuteToggle(chat.id);
    setIsMenuOpen(false);
  };
  
  const handleArchive = (e) => {
    e.stopPropagation();
    onArchive(chat.id);
    setIsMenuOpen(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(chat.id);
    setIsMenuOpen(false);
  };

  return (
    <div
      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-gray-100 last:border-b-0 relative"
      onClick={() => onChatClick(chat)}
      // ✨ 4. We now track when the mouse enters and leaves the chat item
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      <div
        className="relative"
        onClick={(e) => {
          e.stopPropagation();
          onAvatarClick(chat);
        }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 border-2 ${borderClass}`}>
          {chat.avatar}
        </div>
        {chat.isGroup && (<span className="absolute -bottom-1 right-2 text-gray-500 text-xs">👥</span>)}
      </div>

      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
          <span className="text-xs text-gray-500">{chat.time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{chat.message}</p>
      </div>

      {/* 5. This is the new dynamic right-side content area */}
      <div className="ml-3 w-8 h-5 flex items-center justify-center">
        {isHovered ? (
          // If hovered, show the ChevronDown button
          <button onClick={handleMenuClick} className="p-1 rounded-full">
            <ChevronDown size={20} className="text-gray-500" />
          </button>
        ) : chat.isMuted ? (
          // If not hovered BUT muted, show the mute icon
          <BellOff size={16} className="text-gray-400" />
        ) : chat.unread > 0 ? (
          // If not hovered and not muted, show unread count
          <span className="bg-green-500 text-white text-xs font-semibold rounded-full flex items-center justify-center w-5 h-5">
            {chat.unread}
          </span>
        ) : null}
      </div>
      
      {/* 6. The Dropdown Menu itself. Only visible when isMenuOpen is true. */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-10 right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
          <ul className="py-1">
            <li>
              <button onClick={handleMute} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                {chat.isMuted ? <Bell size={16} className="mr-3"/> : <BellOff size={16} className="mr-3"/>}
                {chat.isMuted ? 'Unmute Chat' : 'Mute Chat'}
              </button>
            </li>
            <li>
              <button onClick={handleArchive} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <Archive size={16} className="mr-3"/>
                Archive Chat
              </button>
            </li>
            <div className="border-t my-1"></div>
            <li>
              <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                <Trash2 size={16} className="mr-3"/>
                Delete Chat
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatItem;