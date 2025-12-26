import React, { useState } from 'react';

const ProfilePicture = ({ chat, onBack, hideFooter = false }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleBackgroundClick = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  return (
    <div 
      className="h-full flex flex-col bg-black relative"
      onClick={handleBackgroundClick}
    >
      <div className="bg-black bg-opacity-80 text-white px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onBack}
              className="text-white hover:bg-gray-800 p-2 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h1 className="text-lg font-medium">{chat.name}</h1>
          </div>                  
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          {/* Main profile picture */}
          <div 
            className="w-80 h-80 bg-gray-700 rounded-2xl flex items-center justify-center text-9xl shadow-2xl border-4 border-white border-opacity-20 transition-transform"
            style={{ 
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            }}
          >
            <span className="drop-shadow-lg">{chat.avatar}</span>
          </div>         
        </div>
      </div>
      
      {/* Conditionally render the footer text based on the prop */}
      {!hideFooter && (
        <div className="text-white text-center p-6 bg-black bg-opacity-80">
          <p className="text-sm opacity-60 mt-1">Updated September 12, 9:15 PM</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;