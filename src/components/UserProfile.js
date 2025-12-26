import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Edit3, Search, X, MoreVertical } from 'lucide-react';
import ProfileDownloadPrivacy from './ProfileDownloadPrivacy.js';

const UserProfile = ({ onBack, onViewerClick, userPhoto, setUserPhoto }) => {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'photo', 'viewers'
  const [userAvatar, setUserAvatar] = useState(userPhoto || '👤');
  const [userName, setUserName] = useState('John Doe');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('John Doe');
  
  // New States for Menu and Privacy
  const [showMenu, setShowMenu] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  
  const [showViewers, setShowViewers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle click outside for the new menu
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };
    if (showMenu) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

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
        const newAvatar = e.target.result;
        setUserAvatar(newAvatar);
        if (setUserPhoto) {
          setUserPhoto(newAvatar);
        }
        setShowMenu(false); // Close menu after selection
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setUserAvatar('👤');
    if (setUserPhoto) {
      setUserPhoto('👤');
    }
    setShowMenu(false);
  };

  useEffect(() => {
    if (userPhoto) {
      setUserAvatar(userPhoto);
    }
  }, [userPhoto]);

  // 1. New Profile Privacy Screen
  if (showPrivacySettings) {
    return (
      <ProfileDownloadPrivacy onBack={() => setShowPrivacySettings(false)} />
    );
  }

  // 2. Existing Viewers Screen
  if (showViewers) {
    return (
      <div className="h-screen bg-white relative">
        <div className="h-full relative opacity-20 flex items-center justify-center pointer-events-none">
          {typeof userAvatar === 'string' && userAvatar.length === 2 ? (
            <div className="w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center text-8xl">
              {userAvatar}
            </div>
          ) : (
            <img src={userAvatar} alt="Profile" className="w-48 h-48 rounded-full object-cover" />
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-40 flex flex-col" style={{ height: '70%' }}>
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

  // 3. Updated Photo View with Dark Menu & Footer
  if (currentView === 'photo') {
    return (
      <div className="h-full flex flex-col bg-white relative"> {/* Changed bg-gray-100 to bg-black for better look */}
        <div className="bg-green-600 text-dark px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setCurrentView('main')} className="text-white p-1 rounded-full hover:bg-black/10">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg text-white font-medium">Profile Photo</h1>
            </div>
            
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-full hover:bg-black/10 transition-colors"
              >
                <MoreVertical size={24} className="text-white" />
              </button>

              {/* Dropdown Menu - UPDATED COLORS */}
              {showMenu && (
                <div 
                  ref={menuRef}
                  className="absolute top-12 right-0 bg-gray-900 rounded-lg shadow-xl py-2 w-56 z-50 text-white" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gray-700" 
                    onClick={() => {
                      setShowViewers(true);
                      setShowMenu(false);
                    }}
                  >
                    Seen by
                  </button>
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gray-700"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                  >
                    Change profile
                  </button>
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-red-400"
                    onClick={() => {
                      handleRemovePhoto();
                      setShowMenu(false);
                    }}
                  >
                    Remove photo
                  </button>
                  <button 
                    className="w-full text-left px-4 py-3 hover:bg-gray-700"
                    onClick={() => {
                      setShowPrivacySettings(true);
                      setShowMenu(false);
                    }}
                  >
                    Profile privacy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Photo Display */}
        <div className="flex-1 flex items-center justify-center">
          {typeof userAvatar === 'string' && userAvatar.length === 2 ? (
            <div className="w-64 h-64 bg-gray-700 rounded-lg flex items-center justify-center text-9xl">
              {userAvatar}
            </div>
          ) : (
            <img src={userAvatar} alt="Profile" className="w-64 h-64 rounded-lg object-cover" />
          )}
        </div>

        {/* NEW: Footer Text */}
        <div className="text-dark text-center p-6 bg-white bg-opacity-80">
          <p className="text-sm opacity-60 mt-1">Updated September 12, 9:15 PM</p>
        </div>

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

  // 4. Default View
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Profile</h1>
        </div>
      </div>
      <div className="flex-1 bg-white p-6">
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