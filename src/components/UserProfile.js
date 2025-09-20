import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Eye, Edit3, Search, X } from 'lucide-react';

const UserProfile = ({ onBack, onViewerClick }) => {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'photo', 'viewers'
  const [userAvatar, setUserAvatar] = useState('👤');
  const [userName, setUserName] = useState('John Doe');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('John Doe');
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const editOptionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
        // Close the menu if the click is outside of the menu element
        if (editOptionsRef.current && !editOptionsRef.current.contains(event.target)) {
            setShowEditOptions(false);
        }
    };
    
    // Only listen for clicks when the menu is actually open
    if (showEditOptions) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the listener when the component unmounts or the menu closes
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEditOptions]);
  const fileInputRef = useRef(null);

  const profileViewers = [
    { id: 1, name: 'Mom', avatar: '👩‍💼', time: 'Today, 2:30 PM' },
    { id: 2, name: 'Dad', avatar: '👨‍🦳', time: 'Yesterday, 8:45 PM' },
    { id: 3, name: 'Alex Johnson', avatar: '🧑‍💻', time: '2 days ago' },
    { id: 4, name: 'Emma Wilson', avatar: '👩‍🎨', time: '3 days ago' }
  ];

  const [userAbout, setUserAbout] = useState('Hey there! I am using WhatsApp.');
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [tempAbout, setTempAbout] = useState('Hey there! I am using WhatsApp.');

  const filteredViewers = profileViewers.filter(viewer => 
    viewer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserAvatar(e.target.result);
        setShowEditOptions(false);
        setCurrentView('main');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setUserAvatar('👤');
    setShowEditOptions(false);
    setCurrentView('main');
  };


  if (showViewers) {
    return (
      <div className="h-screen bg-white relative">
        {/* Main profile photo in background */}
        <div className="h-full relative opacity-20 flex items-center justify-center pointer-events-none">
          {typeof userAvatar === 'string' && userAvatar.length === 2 ? (
            <div className="w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center text-8xl">
              {userAvatar}
            </div>
          ) : (
            <img src={userAvatar} alt="Profile" className="w-48 h-48 rounded-full object-cover" />
          )}
        </div>

        {/* Bottom sliding panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-40 flex flex-col" style={{ height: '70%' }}>
          {/* Header */}
          <div className="bg-green-600 px-4 py-3 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center space-x-3 flex-1">
              {isSearchOpen ? (
                <div className="flex items-center w-full space-x-2">
                  <button onClick={() => setIsSearchOpen(false)} className="p-1 rounded-full hover:bg-green-700">
                    <ArrowLeft size={20} className="text-white" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search viewers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1 bg-green-700 text-white rounded-md outline-none placeholder-white/70"
                    autoFocus
                  />
                </div>
              ) : (
                <span className="text-white font-medium">Seen by {filteredViewers.length}</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {!isSearchOpen && (
                <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-full hover:bg-green-700">
                  <Search size={20} className="text-white" />
                </button>
              )}
              <button onClick={() => setShowViewers(false)} className="p-2 rounded-full hover:bg-green-700">
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Viewers List */}
          <div className="flex-1 overflow-y-auto">
            {filteredViewers.length > 0 ? (
              filteredViewers.map(viewer => (
                <div 
                  key={viewer.id} 
                  className="flex items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setShowViewers(false);
                    if (onViewerClick) {
                      onViewerClick(viewer);
                    }
                  }}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">
                    {viewer.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{viewer.name}</h3>
                    <p className="text-sm text-gray-500">{viewer.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 p-8">
                <p>No viewers found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'photo') {
    return (
      <div className="h-full flex flex-col bg-gray-100 relative">
        {/* Header */}
        <div className="bg-green-600 text-white px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setCurrentView('main')} className="text-white p-1 rounded-full hover:bg-black/10">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-medium">Profile Photo</h1>
            </div>

            {/* This is the corrected section for the icons and menu */}
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowViewers(true)} className="p-1 rounded-full hover:bg-black/10">
                <Eye size={20} className="text-white" />
              </button>
              
              {/* The button and menu are now wrapped in a relative container */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditOptions(prev => !prev);
                  }}
                  className="p-1 rounded-full hover:bg-black/10"
                >
                  <Edit3 size={20} className="text-white" />
                </button>

                {/* The menu is positioned relative to the button above */}
                {showEditOptions && (
                  <div 
                    ref={editOptionsRef}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-xl border p-2 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      className="w-full text-left p-3 hover:bg-gray-100 rounded text-gray-800"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select Photo
                    </button>
                    <button 
                      className="w-full text-left p-3 hover:bg-gray-100 rounded text-red-600"
                      onClick={handleRemovePhoto}
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Photo Display */}
        <div className="flex-1 flex items-center justify-center">
          {typeof userAvatar === 'string' && userAvatar.length === 2 ? (
            <div className="w-64 h-64 bg-gray-300 rounded-lg flex items-center justify-center text-9xl">
              {userAvatar}
            </div>
          ) : (
            <img src={userAvatar} alt="Profile" className="w-64 h-64 rounded-lg object-cover" />
          )}
        </div>

        {/* (The rest of your code for this view, like the footer and "Seen By" sheet, remains here) */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 bg-white p-6">
        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <div 
            className="cursor-pointer"
            onClick={() => setCurrentView('photo')}
          >
            {typeof userAvatar === 'string' && userAvatar.length === 2 ? (
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-6xl">
                {userAvatar}
              </div>
            ) : (
              <img src={userAvatar} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Name</label>
            <div className="border-b border-gray-200 pb-2 flex items-center">
              {isEditingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={() => {
                    setUserName(tempName);
                    setIsEditingName(false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setUserName(tempName);
                      setIsEditingName(false);
                    }
                  }}
                  className="bg-transparent text-gray-700 border-none outline-none focus:ring-0 flex-1"
                  autoFocus
                />
              ) : (
                <>
                  <span className=" flex-1 text-gray-700">{userName}</span>
                  <button 
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(true);
                    }}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <Edit3 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">About</label>
            <div className="border-b border-gray-200 pb-2 flex items-center">
              {isEditingAbout ? (
                <input
                  type="text"
                  value={tempAbout}
                  onChange={(e) => setTempAbout(e.target.value)}
                  onBlur={() => {
                    setUserAbout(tempAbout);
                    setIsEditingAbout(false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setUserAbout(tempAbout);
                      setIsEditingAbout(false);
                    }
                  }}
                  className="bg-transparent text-gray-700 border-none outline-none focus:ring-0 flex-1"
                  autoFocus
                />
              ) : (
                <>
                  <span className="flex-1 text-gray-700">{userAbout}</span>
                  <button 
                    onClick={() => {
                      setTempAbout(userAbout);
                      setIsEditingAbout(true);
                    }}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <Edit3 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">Phone</label>
            <div className="border-b border-gray-200 pb-2">
              <span className="text-gray-700">+91 2345678900</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;