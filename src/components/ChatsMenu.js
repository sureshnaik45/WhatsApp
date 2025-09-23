import React from 'react';
import { Users, Star, Pin, Settings as SettingsIcon } from 'lucide-react';

const ChatsMenu = ({ onClose, onNewGroup, onNewCategory, onStarred, onPinned, onSettings }) => {
  const menuItems = [
    { icon: Users, label: 'New Group', action: onNewGroup },
    { icon: Users, label: 'New Category', action: onNewCategory },
    { icon: Star, label: 'Starred Messages', action: onStarred },
    { icon: Pin, label: 'Pinned Chats', action: onPinned },
    { icon: SettingsIcon, label: 'Settings', action: onSettings }
  ];

  return (
    <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white rounded-lg shadow-xl py-2 min-w-[200px] z-30">
      {menuItems.map((item, index) => (
        <button 
          key={index}
          onClick={() => {
            item.action();
            onClose();
          }}
          className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center space-x-3 transition-colors"
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ChatsMenu;