import React, { useState } from 'react';
import ProfilePicture from './ProfilePicture.js';

const ChatInfo = ({ chat, onBack }) => {
  const [showProfilePic, setShowProfilePic] = useState(false);

  const getPhoneNumber = () => {
    return '+91 ' + Math.floor(Math.random() * 9000000000 + 1000000000);
  };

  const handleProfilePicClick = () => {
    setShowProfilePic(true);
  };

  const handleBackFromProfile = () => {
    setShowProfilePic(false);
  };

  if (showProfilePic) {
    return (
      <ProfilePicture 
        chat={chat}
        onBack={handleBackFromProfile}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
                
        <div className="flex items-center space-x-3">           
          <button 
            onClick={onBack}
            className="text-white hover:bg-green-700 p-1 rounded"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>          
          <h1 className="text-lg font-medium">Contact Info</h1>         
        </div>                     
      </div>

      {/* Contact Profile */}
      <div className="p-6 text-center border-b">
        <div 
          className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl cursor-pointer hover:opacity-80"
          onClick={handleProfilePicClick}
        >
          {chat.avatar}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{chat.name}</h2>
        <p className="text-gray-600 mt-1">{getPhoneNumber()}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">ABOUT</h3>
            <p className="text-gray-700">Hey there! I am using WhatsApp.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">PHONE</h3>
            <p className="text-gray-700">{getPhoneNumber()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;