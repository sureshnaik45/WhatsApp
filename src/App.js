import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users, Search, Phone, MoreVertical, ArrowLeft, Camera, Bell, ChevronDown, ChevronRight, Settings as SettingsIcon, UserPlus, UserMinus, Trash2, BellOff } from 'lucide-react';
import ChatItem from './components/ChatItem.js';
import NewGroupModal from './components/NewGroupModal.js';
import CategoryInfo from './components/CategoryInfo.js';
import StatusItem from './components/StatusItem.js';
import CallItem from './components/CallItem.js';
import NewCategoryModal from './components/NewCategoryModal.js';
import ChatWindow from './components/ChatWindow.js';
import ChatInfo from './components/ChatInfo.js';
import ContactSelector from './components/ContactSelector.js';
import GlobalSearch from './components/GlobalSearch.js';
import MyStatusManager from './components/MyStatusManager.js';
import StatusSettings from './components/StatusSettings.js';
import StatusViews from './components/StatusViews.js';
import StatusSearch from './components/StatusSearch.js';
import VideoCallWindow from './components/VideoCallWindow.js';
import Settings from './components/Settings.js';
import ChatsMenu from './components/ChatsMenu.js';
import StatusViewer from './components/StatusViewer.js';
import { chatsData } from './data/chats.js';
import { categoriesData } from './data/categories.js';
import { statusData } from './data/status.js';
import { callsData } from './data/calls.js';
import MyStatusViewer from './components/MyStatusViewer.js';
import CallsSearch from './components/CallsSearch.js';
import ChatSettings from './components/ChatSettings.js';
import StarredMessages from './components/StarredMessages.js';
import PinnedMessages from './components/PinnedMessages.js';
import Calendar from './components/Calendar.js';
import UserProfile from './components/UserProfile.js';
import GroupInfo from './components/GroupInfo.js';
import About from './components/About.js';
import './App.css';
import CalendarSettings from './components/CalendarSettings.js';

const App = () => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(null);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(null);
  const [addMemberSearchQuery, setAddMemberSearchQuery] = useState('');
  const [selectedContactsForAdd, setSelectedContactsForAdd] = useState([]);
  const [activeTab, setActiveTab] = useState('chats');
  const [showCalendarSettings, setShowCalendarSettings] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showMyStatusManager, setShowMyStatusManager] = useState(false);
  const [showStatusSettings, setShowStatusSettings] = useState(false);
  const [showStatusViews, setShowStatusViews] = useState(false);
  const [showStatusSearch, setShowStatusSearch] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallContact, setVideoCallContact] = useState(null);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showCallsMenu, setShowCallsMenu] = useState(false);
  const [categories, setCategories] = useState(categoriesData);
  const [userHasStatus, setUserHasStatus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChatsMenu, setShowChatsMenu] = useState(false);
  const [selectedStatusToView, setSelectedStatusToView] = useState(null);
  const [myStatuses, setMyStatuses] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showMyStatusViewer, setShowMyStatusViewer] = useState(false);
  const [activeStatusViewer, setActiveStatusViewer] = useState(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [statuses, setStatuses] = useState(statusData);
  const [currentCall, setCurrentCall] = useState(null);
  const [callError, setCallError] = useState(null);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [openCategorySettings, setOpenCategorySettings] = useState(null);
  const categorySettingsMenuRef = useRef(null);
  const [contactSelectorMode, setContactSelectorMode] = useState('call');
  const [contactSelectorCategory, setContactSelectorCategory] = useState(null);
  const [contactSelectorExistingMembers, setContactSelectorExistingMembers] = useState([]);
  const [showCallsSearch, setShowCallsSearch] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showIndividualBackup, setShowIndividualBackup] = useState(false);
  const [globalPinnedMessages, setGlobalPinnedMessages] = useState([]);
  const [showStarredMessages, setShowStarredMessages] = useState(false);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBirthdaySelector, setShowBirthdaySelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedMembersForRemove, setSelectedMembersForRemove] = useState([]);
  const [chatPinnedMessages, setChatPinnedMessages] = useState({}); 
  const [showAbout, setShowAbout] = useState(false);
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);
  const [userPhoto, setUserPhoto] = useState( '👤');
  const [birthdays, setBirthdays] = useState({
    // August is month index 7
    '2025-7-17': [{ id: 1, name: 'Mom', avatar: '👩‍💼', type: 'birthday' }],
    '2025-7-30': [{ id: 2, name: 'Dad', avatar: '👨‍🦳', type: 'birthday' }],
    '2025-8-10': [{ id: 3, name: 'Sister', avatar: '👩‍🎓', type: 'birthday' }],
    '2025-8-27': [{ id: 4, name: 'Lisa Chen', avatar: '👩‍🔬', type: 'birthday' }],
    '2025-8-15': [{ id: 'note-1', name: 'Graduation Day! 🎓', author: 'You', avatar: userPhoto, type: 'note' }],
    '2025-8-20': [{ id: 'note-2', name: 'Our family blessed with a baby girl', author: 'Sister', avatar: '👩‍🎓', type: 'note' }],
    '2025-8-25': [{ id: 'note-3', name: 'Promoted as Product Manager in WhatsApp!', author: 'Alex Johnson', avatar: '🧑‍💻', type: 'note' }]
  });
  const [showBackupToast, setShowBackupToast] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [chats, setChats] = useState(chatsData); 
  const [expandedCategories, setExpandedCategories] = useState({ family: true });
  const [globalStarredMessages, setGlobalStarredMessages] = useState(() => {
    const starredMessages = [];
    chatsData.forEach(chat => {
      if (chat.name === 'Mom') {
        starredMessages.push({
          chatName: chat.name,
          chatAvatar: chat.avatar,
          message: {
            id: 999,
            text: "Don't forget dinner tonight!",
            time: '10:30 PM',
            fromSelf: false,
            starred: true,
            status: 'delivered'
          }
        });
      }
      if (chat.name === 'Dad') {
        starredMessages.push({
          chatName: chat.name,
          chatAvatar: chat.avatar,
          message: {
            id: 998,
            text: 'Proud of you kiddo! 🎉',
            time: 'Yesterday',
            fromSelf: false,
            starred: true,
            status: 'delivered'
          }
        });
      }
    });
    return starredMessages;
  });
  
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowChatsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.more-menu')) {
        setShowCategoriesMenu(false);
        setShowStatusMenu(false);
        setShowCallsMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categorySettingsMenuRef.current && !categorySettingsMenuRef.current.contains(event.target)) {
        setOpenCategorySettings(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categorySettingsMenuRef]);

  const handleCategorySettingsClick = (e, categoryId) => {
    e.stopPropagation();
    if (openCategorySettings === categoryId) {
      setOpenCategorySettings(null); // Close if already open
    } else {
      setOpenCategorySettings(categoryId); // Open new one
    }
  };

  const handleMakeCall = (contact, callType) => {
    if (currentCall && showVideoCall) {
      setIsCallMinimized(false);
      setCallError("You can't make a call while another call is ongoing");
      return;
    } 
    const newCallLog = {
      id: Date.now(),
      name: contact.name,
      avatar: contact.avatar,
      type: callType,
      direction: 'outgoing',
      time: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      date: new Date().toLocaleDateString(),
      duration: Math.floor(Math.random() * 300) + 30,
      status: 'completed'
    };    

    setCallLogs(prev => [newCallLog, ...prev]);
    setCurrentCall({ contact, callType });
    setShowVideoCall(true);
    setIsCallMinimized(false);
  };

  const handleEndCall = () => {
    setCurrentCall(null);
    setShowVideoCall(false);
    setActiveTab("chats");
    setIsCallMinimized(false);
  };

  const handleMuteToggle = (chatId) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
      )
    );
  };

  const handleArchive = (chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
  };

  const handleDelete = (chatId) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
  };
  
  const handleAvatarClick = (chat) => {
    const status = statuses.find(s => s.name === chat.name);
    if (status) {
      setActiveStatusViewer(status);
    } else {
      setActiveChat(chat);
    }
  };

  const handleStatusSent = (statusData) => {
    setMyStatuses(prev => [...prev, {
      ...statusData,
      id: Date.now(),
      timestamp: new Date()
    }]);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (showVideoCall && currentCall) {
      setSelectedCategory(null);
      setActiveChat(null);
      setShowChatInfo(false);
      setShowContactSelector(false);
      setShowGlobalSearch(false);
      setShowMyStatusManager(false);
      setShowStatusSettings(false);
      setShowStatusViews(false);
      setShowStatusSearch(false);
      setVideoCallContact(null);
    } else {
      resetAllViews();
    }
  };

  const resetAllViews = () => {
    setSelectedCategory(null);
    setActiveChat(null);
    setShowChatInfo(false);
    setShowContactSelector(false);
    setShowGlobalSearch(false);
    setShowMyStatusManager(false);
    setShowStatusSettings(false);
    setShowStatusViews(false);
    setShowStatusSearch(false);
    setShowVideoCall(false);
    setVideoCallContact(null);
  };

  const openChat = (chat) => {
    setActiveChat(chat);
    resetOtherViews();
  };

  const resetOtherViews = () => {
    setShowGlobalSearch(false);
    setShowContactSelector(false);
    setShowMyStatusManager(false);
    setShowStatusSettings(false);
    setShowStatusViews(false);
    setShowStatusSearch(false);
  };

  const [callLogs, setCallLogs] = useState(callsData);
  const goBackToCategories = () => setSelectedCategory(null);
  const closeContactSelector = () => setShowContactSelector(false);
  const openGlobalSearch = () => setShowGlobalSearch(true);
  const closeGlobalSearch = () => setShowGlobalSearch(false);
  const closeMyStatusManager = () => setShowMyStatusManager(false);
  const closeStatusSettings = () => setShowStatusSettings(false);
  const closeStatusViews = () => setShowStatusViews(false);
  const openStatusSearch = () => setShowStatusSearch(true);
  const closeStatusSearch = () => setShowStatusSearch(false);
  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);
  const closeChatsMenu = () => setShowChatsMenu(false);
  const handleNewGroup = () => {
    setShowNewGroupModal(true);
    closeChatsMenu();
  };
  const handleNewCategory = () => setShowNewCategoryModal(true);

  const handleShowContactSelector = (mode, category = null, existingMembers = []) => {
    setContactSelectorMode(mode);
    setContactSelectorCategory(category);
    setContactSelectorExistingMembers(existingMembers);
    setShowContactSelector(true);
  };

  const handleFloatingButtonClick = () => {
  if (activeTab === 'categories') {
    setShowNewCategoryModal(true);
  } else if (activeTab === 'calls') {
    handleShowContactSelector('call');
  } else if (activeTab === 'status') {
    setShowMyStatusManager(true);
  } else if (activeTab === 'chats') {
    handleShowContactSelector('chat');
  }
};

  const getChatsByCategory = (categoryId) => {
    console.log(`Getting chats for category ${categoryId}:`, chats.filter(chat => chat.category === categoryId));
    return chats.filter(chat => chat.category === categoryId);
  };
  const getTotalUnreadForCategory = (categoryId) => {
    return getChatsByCategory(categoryId).reduce((total, chat) => total + (chat.isMuted ? 0 : chat.unread), 0);
  };


  const uncategorizedChats = chats.filter(chat => !chat.category);
  const unreadChatsCount = uncategorizedChats.filter(chat => chat.unread > 0 && !chat.isMuted).length;
  const unreadCategoriesCount = categories.filter(category => {
    return getChatsByCategory(category.id).some(chat => chat.unread > 0 && !chat.isMuted);
  }).length;

  const handleCreateGroup = (groupData) => {
    setChats(prevChats => [groupData, ...prevChats]);
    setShowNewGroupModal(false);
  };

  const handleCreateCategory = (categoryName) => {
    if (categoryName.trim()) {
      const newCategoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
      const newCategory = {
        id: newCategoryId,
        name: categoryName,
        color: '#607D8B',
        notifications: true,
        contacts: []
      };
      setCategories([...categories, newCategory]);
      setExpandedCategories(prev => ({ ...prev, [newCategoryId]: true }));
    }
  };
  
  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleContactSelection = (chat) => {
    const existingCategory = categories.find(cat => cat.contacts.includes(chat.name));
    
    if (existingCategory) {
      alert(`${chat.name} is already in the '${existingCategory.name}' category.`);
      return;
    }
    
    const isAlreadySelected = selectedContactsForAdd.find(c => c.id === chat.id);
    if (isAlreadySelected) {
      setSelectedContactsForAdd(prev => prev.filter(c => c.id !== chat.id));
    } else {
      setSelectedContactsForAdd(prev => [...prev, chat]);
    }
  };

  const handleToggleCategoryNotifications = (categoryId) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, notifications: !cat.notifications }
          : cat
      )
    );
    setOpenCategorySettings(null); // Close menu after action
  };

  const handleRemoveCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setOpenCategorySettings(null);
  };

  const handleRemoveMembersFromCategory = (categoryId, membersToRemove) => {
    const memberNamesToRemove = membersToRemove.map(member => member.name);
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, contacts: cat.contacts.filter(cName => !memberNamesToRemove.includes(cName)) }
          : cat
      )
    );

    setChats(prevChats =>
      prevChats.map(chat =>
        memberNamesToRemove.includes(chat.name)
          ? { ...chat, category: null } // Set category to null so it reappears in Chats
          : chat
      )
    );
    setShowRemoveMemberModal(null);
    setSelectedMembersForRemove([]);
  };

  const showOverlay = showGlobalSearch || showContactSelector || showMyStatusManager || 
                   showStatusSettings || showStatusViews || showStatusSearch || 
                   activeChat || selectedCategory || (showVideoCall && !isCallMinimized) || showMyStatusViewer
                   || showSettings || showChatSettings || showIndividualBackup || showStarredMessages || showPinnedMessages
                   || showCalendar || showBirthdaySelector || showBackupToast || showUserProfile || showAbout ||
                   showAddMemberModal || showRemoveMemberModal || showCalendarSettings;



  return (
    <div className={`max-w-md mx-auto mt-2 shadow-2xl rounded-lg overflow-hidden relative bg-white`} 
      style={{ height: '600px' }}
    >      
      <NewGroupModal 
        isOpen={showNewGroupModal}
        onClose={() => setShowNewGroupModal(false)}
        onCreate={handleCreateGroup}
      />
      {showVideoCall && currentCall && (
        <VideoCallWindow
          contact={currentCall.contact}
          callType={currentCall.callType}
          onEndCall={handleEndCall}
          minimized={isCallMinimized}
          onBack={() => setIsCallMinimized(true)}
          onMinimize={setIsCallMinimized}
          error={callError}
        />
      )}

      {showCalendarSettings && (
        <CalendarSettings 
          onBack={() => {
            setShowCalendarSettings(false);
            setShowCalendar(true); // Go back to the calendar
          }}
        />
      )}              

      {showCallsSearch && ( 
        <CallsSearch 
          onBack={() => setShowCallsSearch(false)} 
          onMakeCall={handleMakeCall}
        /> 
      )}

      {showSettings && ( 
        <Settings 
          onBack={closeSettings} 
          userPhoto={userPhoto}
          onOpenChatSettings={() => {
            setShowSettings(false);
            setShowChatSettings(true);
          }}
          onOpenCalendar={() => {
            setShowSettings(false);
            setShowCalendar(true);
          }}
          onOpenProfile={() => {
            setShowSettings(false);
            setShowUserProfile(true);
          }}
          onOpenAbout={() => {
            setShowSettings(false);
            setShowAbout(true);
          }}
        /> 
      )}

      {showAbout && (
        <About 
          onBack={() => {
            setShowAbout(false);
            setShowSettings(true);
          }}
        />
      )}

      {showUserProfile && (
        <UserProfile 
          onBack={() => {
            setShowUserProfile(false);
            setShowSettings(true);
          }}
          onViewerClick={(viewer) => {
            const targetChat = chats.find(chat => chat.name === viewer.name);
            if (targetChat) {
              setActiveChat(targetChat);
              setShowUserProfile(false);
              setActiveTab('chats');
            }
          }}
          userPhoto={userPhoto}
          setUserPhoto={setUserPhoto}
        />
      )}

      {showCalendar && (
        <Calendar
          onBack={() => {
            setShowCalendar(false);
            setShowSettings(true);
          }}
          birthdays={birthdays}
          setBirthdays={setBirthdays}
          userPhoto={userPhoto}
          onDateClick={(date) => {
            setSelectedDate(date);
            setShowBirthdaySelector(true);
            setShowCalendar(false);
          }}
          onAvatarClick={(contact) => {
            const targetChat = chats.find(chat => chat.name === contact.name);
            if (targetChat) {
              setActiveChat(targetChat);
              setShowCalendar(false);
              setActiveTab('chats');
            }
          }}
          onOpenSettings={() => {
            setShowCalendar(false);
            setShowCalendarSettings(true);
          }}
        />
      )}

      {showBirthdaySelector && (
        <ContactSelector 
          onBack={() => {
            setShowBirthdaySelector(false);
            setShowCalendar(true);
          }}
          onSelectContact={(contact) => {
            const existingBirthday = Object.keys(birthdays).find(dateKey => 
              birthdays[dateKey].some(person => person.name === contact.name)
            );
            
            if (existingBirthday) {
              alert(`${contact.name} already has a birthday on ${existingBirthday}. Remove the existing birthday first.`);
              return;
            }
            setBirthdays(prev => ({
              ...prev,
              [selectedDate]: [...(prev[selectedDate] || []), contact]
            }));
            setShowBirthdaySelector(false);
            setShowCalendar(true);
          }}
          mode="birthday"
        />
      )}

      {showChatSettings && (
        <ChatSettings
          onBack={() => {
            setShowChatSettings(false);
            setShowSettings(true);
          }}
          onIndividualBackup={() => {
            setShowChatSettings(false);
            setShowIndividualBackup(true);
          }}
        />
      )}
      {showIndividualBackup && (
        <ContactSelector 
          onBack={() => {
            setShowIndividualBackup(false);
            setShowChatSettings(true);
          }}
          onSelectContact={(contact) => {
            setShowBackupToast(true);
            setBackupProgress(0);
            const progressInterval = setInterval(() => {
              setBackupProgress(prev => {
                if (prev >= 100) {
                  clearInterval(progressInterval);
                  setTimeout(() => {
                    setShowBackupToast(false);
                    alert('Chat backup successful!');
                    const backupMessages = [
                      { id: Date.now() - 6, text: `Hey ${contact.name}, how are you doing?`, time: '9:00 AM', fromSelf: true, starred: false, status: 'read', reactions: {}, readAt: null, deliveredAt: 'Today, 9:00 AM' },
                      { id: Date.now() - 5, text: "I'm doing great! Just finished my morning workout.", time: '9:05 AM', fromSelf: false, starred: false, status: 'delivered', reactions: {}, readAt: null, deliveredAt: 'Today, 9:05 AM' },
                      { id: Date.now() - 4, text: "That's awesome! What kind of workout did you do?", time: '9:07 AM', fromSelf: true, starred: false, status: 'read', reactions: {}, readAt: null, deliveredAt: 'Today, 9:07 AM' },
                      { id: Date.now() - 3, text: "Mostly cardio and some weight training. You should join me sometime!", time: '9:10 AM', fromSelf: false, starred: true, status: 'delivered', reactions: {}, readAt: null, deliveredAt: 'Today, 9:10 AM' },
                      { id: Date.now() - 2, text: "I'd love to! When are you planning to go next?", time: '9:12 AM', fromSelf: true, starred: false, status: 'read', reactions: {}, readAt: null, deliveredAt: 'Today, 9:12 AM' },
                      { id: Date.now() - 1, text: "How about tomorrow morning? I usually go around 7 AM.", time: '9:15 AM', fromSelf: false, starred: false, status: 'delivered', reactions: {}, readAt: null, deliveredAt: 'Today, 9:15 AM' }
                    ];
                    
                    const updatedContact = {
                      ...contact,
                      backupMessages: backupMessages,
                      lastBackup: new Date().toLocaleString()
                    };
                    
                    setActiveChat(updatedContact);
                    setShowIndividualBackup(false);
                    setActiveTab('chats');
                  }, 500);
                  return 100;
                }
                return prev + 10;
              });
            }, 200);
          }}
          mode="backup"
        />
      )}
      {showBackupToast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-lg font-medium mb-4 text-center">Backing up chat...</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${backupProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-center">{backupProgress}%</p>
          </div>
        </div>
      )}

      {showStarredMessages && (
        <StarredMessages 
          onBack={() => setShowStarredMessages(false)}
          starredMessages={globalStarredMessages}
          onMessageClick={(chatName, message) => {
            const targetChat = chats.find(chat => chat.name === chatName);
            if (targetChat) {
              setActiveChat(targetChat);
              setShowStarredMessages(false);
              setActiveTab('chats');
              setTimeout(() => {
                document.getElementById(`msg-${message.id}`)?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }, 300);
            }
          }}
        />
      )}

      {showChatInfo && activeChat && !activeChat.isGroup && (
        <ChatInfo 
          chat={activeChat} 
          onBack={() => setShowChatInfo(false)} 
        />
      )}

      {showGroupInfo && activeChat &&(
        <GroupInfo 
          chat={activeChat}
          onBack={() => setShowGroupInfo(false)}
        />
      )}

      {showPinnedMessages && (
        <PinnedMessages 
          onBack={() => setShowPinnedMessages(false)}
          pinnedMessages={globalPinnedMessages}
          onMessageClick={(chatName, message) => {
            const targetChat = chats.find(chat => chat.name === chatName);
            if (targetChat) {
              setActiveChat(targetChat);
              setShowPinnedMessages(false);
              setActiveTab('chats');
              setTimeout(() => {
                document.getElementById(`msg-${message.id}`)?.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });
              }, 300);
            }
          }}
        />
      )}

      {showMyStatusViewer && (
        <div className="absolute inset-0 bg-black z-50">
          <MyStatusViewer 
            myStatuses={myStatuses}
            onBack={() => setShowMyStatusViewer(false)}
            onDeleteStatus={(statusIndex) => {
              const updatedStatuses = myStatuses.filter((_, index) => index !== statusIndex);
              setMyStatuses(updatedStatuses);
              if (updatedStatuses.length === 0) {
                setShowMyStatusViewer(false);
              }
            }}
            onViewerClick={(viewer) => {
              setActiveChat(viewer);
              setShowMyStatusViewer(false);
            }}
          />
        </div>
      )}

      {showAddMemberModal && (
        <div className="absolute inset-0 bg-white z-50" style={{ height: '600px' }}>
          <div className="bg-green-600 text-white px-4 py-3">
            <div className="flex items-center space-x-3">
              <button onClick={() => {
                setShowAddMemberModal(null);
                setSelectedContactsForAdd([]);
                setAddMemberSearchQuery('');
              }}>
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-medium">Add to {showAddMemberModal.name}</h1>
                <p className="text-sm text-green-100">{selectedContactsForAdd.length} selected</p>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                value={addMemberSearchQuery}
                onChange={(e) => setAddMemberSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto" style={{ height: 'calc(600px - 180px)' }}>
            {chats.filter(chat => {
              // Only show individual contacts (not groups)
              if (chat.isGroup) return false;
              
              // Filter by search query
              if (!chat.name.toLowerCase().includes(addMemberSearchQuery.toLowerCase())) return false;
              
              // Check if contact is already in the CURRENT category being edited
              if (showAddMemberModal.contacts.includes(chat.name)) return false;
              
              return true;
            }).map(chat => {
              const isSelected = selectedContactsForAdd.find(c => c.id === chat.id);
              
              // Check if contact is in another category
              const existingCategory = categories.find(cat => 
                cat.id !== showAddMemberModal.id && cat.contacts.includes(chat.name)
              );
              
              return (
                <div key={chat.id} 
                    onClick={() => {
                      if (existingCategory) {
                        alert(`${chat.name} is already in the '${existingCategory.name}' category. Remove from there first.`);
                        return;
                      }
                      handleContactSelection(chat);
                    }}
                    className={`flex items-center px-4 py-3 cursor-pointer ${
                      existingCategory ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}>
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-xl">
                    {chat.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${existingCategory ? 'text-gray-400' : 'text-gray-900'}`}>
                      {chat.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {existingCategory ? `In ${existingCategory.name}` : 'Available to add'}
                    </p>
                  </div>
                  {!existingCategory && (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                  )}
                </div>
              );
            })}
            
            {chats.filter(chat => 
              !chat.isGroup && 
              chat.name.toLowerCase().includes(addMemberSearchQuery.toLowerCase()) &&
              !showAddMemberModal.contacts.includes(chat.name)
            ).length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No available contacts to add</p>
                <p className="text-sm">Search for more contacts or they're already in categories</p>
              </div>
            )}
          </div>
          
          {selectedContactsForAdd.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <button 
                onClick={() => {
                  console.log('Adding members:', selectedContactsForAdd);
                  
                  setCategories(prevCategories => {
                    const updatedCategories = prevCategories.map(cat => 
                      cat.id === showAddMemberModal.id 
                        ? { ...cat, contacts: [...cat.contacts, ...selectedContactsForAdd.map(c => c.name)] }
                        : cat
                    );
                    return updatedCategories;
                  });
                  
                  setChats(prevChats => {
                    const updatedChats = prevChats.map(chat => 
                      selectedContactsForAdd.find(sc => sc.id === chat.id)
                        ? { ...chat, category: showAddMemberModal.id }
                        : chat
                    );
                    return updatedChats;
                  });
                  
                  setExpandedCategories(prev => ({
                    ...prev,
                    [showAddMemberModal.id]: true
                  }));
                  
                  setShowAddMemberModal(null);
                  setSelectedContactsForAdd([]);
                  setAddMemberSearchQuery('');
                }}
                className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold">
                Add Selected ({selectedContactsForAdd.length})
              </button>
            </div>
          )}
        </div>
      )}

      {showRemoveMemberModal && (
        <div className="absolute inset-0 bg-white z-50" style={{ height: '600px' }}>
          <div className="bg-green-600 text-white px-4 py-3">
            <div className="flex items-center space-x-3">
              <button onClick={() => {
                setShowRemoveMemberModal(null);
                setSelectedMembersForRemove([]);
              }}>
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-medium">Remove from {showRemoveMemberModal.name}</h1>
                <p className="text-sm text-green-100">{selectedMembersForRemove.length} selected</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto" style={{ height: 'calc(600px - 180px)' }}>
            {getChatsByCategory(showRemoveMemberModal.id).map(chat => {
              const isSelected = selectedMembersForRemove.find(c => c.id === chat.id);
              return (
                <div key={chat.id} 
                    onClick={() => {
                      const isAlreadySelected = selectedMembersForRemove.find(c => c.id === chat.id);
                      if (isAlreadySelected) {
                        setSelectedMembersForRemove(prev => prev.filter(c => c.id !== chat.id));
                      } else {
                        setSelectedMembersForRemove(prev => [...prev, chat]);
                      }
                    }}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-xl">
                    {chat.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{chat.name}</h3>
                  </div>
                  <div className={`w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                    isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-black'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
            {getChatsByCategory(showRemoveMemberModal.id).length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No members in this category</p>
              </div>
            )}
          </div>
          
          {selectedMembersForRemove.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <button 
                onClick={() => handleRemoveMembersFromCategory(showRemoveMemberModal.id, selectedMembersForRemove)}
                className="w-full bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600">
                Remove Selected ({selectedMembersForRemove.length})
              </button>
            </div>
          )}
        </div>
      )}

      {activeStatusViewer && (
        <div className="absolute inset-0 bg-black z-50">
          <StatusViewer
            status={activeStatusViewer}
            onBack={() => setActiveStatusViewer(null)}
            onViewed={() => setStatuses(p => p.map(s => s.id === activeStatusViewer.id ? { ...s, viewed: true } : s))}
          />
        </div>
      )}

      {showGlobalSearch && ( <GlobalSearch onBack={closeGlobalSearch} onChatClick={openChat} /> )}
      {showContactSelector && ( 
        <ContactSelector 
          onBack={() => {
            closeContactSelector();
            setContactSelectorMode('call');
            setContactSelectorCategory(null);
            setContactSelectorExistingMembers([]);
          }}
          onSelectContact={(contact) => { 
            if (contactSelectorMode === 'call' || activeTab === 'calls') {
              handleMakeCall(contact, "audio"); 
              closeContactSelector();
            } else if (contactSelectorMode === 'chat' || activeTab === 'chats') {
              setActiveChat(contact);
              closeContactSelector();
            }
          }}
          mode={contactSelectorMode}
          categoryName={contactSelectorCategory?.name}
          existingMembers={contactSelectorExistingMembers}
          onAddMembers={(selectedContacts) => {
            const duplicates = selectedContacts.filter(contact => {
              const existingCategory = categories.find(cat => 
                cat.contacts.includes(contact.name)
              );
              return existingCategory;
            });
            if (duplicates.length > 0) {
              alert(`${duplicates.map(d => d.name).join(', ')} already in other categories`);
              return;
            }
            setCategories(prev => 
              prev.map(cat => 
                cat.id === contactSelectorCategory.id 
                  ? { ...cat, contacts: [...cat.contacts, ...selectedContacts.map(c => c.name)] }
                  : cat
              )
            );
            // Update chats with category
            setChats(prevChats => 
              prevChats.map(chat => 
                selectedContacts.find(sc => sc.id === chat.id)
                  ? { ...chat, category: contactSelectorCategory.id }
                  : chat
              )
            );
            closeContactSelector();
            setContactSelectorMode('call');
            setContactSelectorCategory(null);
            setContactSelectorExistingMembers([]);
          }}
        /> 
      )}
      {showMyStatusManager && ( <MyStatusManager onBack={closeMyStatusManager} onStatusSent={handleStatusSent} hasStatus={userHasStatus} setUserHasStatus={setUserHasStatus} /> )}
      {showStatusSettings && ( <StatusSettings onBack={closeStatusSettings} /> )}
      {showStatusViews && ( <StatusViews onBack={closeStatusViews} /> )}
      {selectedStatusToView && ( <StatusViewer status={selectedStatusToView} onBack={() => setSelectedStatusToView(null)} /> )}
      {showSettings && ( <Settings onBack={closeSettings} /> )}
      {showStatusSearch && ( <StatusSearch onBack={closeStatusSearch} onStatusClick={(status) => { alert(`Viewing ${status.name}'s status`); closeStatusSearch(); }} /> )}

      {activeTab === "chats" && activeChat && !showChatInfo && !showGroupInfo && (
        <ChatWindow
          chat={{
            ...activeChat,
            pinnedMessages: chatPinnedMessages[activeChat.id] || [],
            setPinnedMessages: (pinnedMsgs) => {
              setChatPinnedMessages(prev => ({
                ...prev,
                [activeChat.id]: pinnedMsgs
              }));
            }
          }}
          onBack={() => {
            setActiveChat(null);
            setShowChatInfo(false);
            setShowGroupInfo(false);
          }}
          onHeaderClick={() => {
            console.log('Header clicked for:', activeChat.name, 'isGroup:', activeChat.isGroup);
            if (activeChat.isGroup) {
              setShowGroupInfo(true);
              setShowChatInfo(false);
            } else {
              setShowChatInfo(true);
              setShowGroupInfo(false);
            }
          }}
          onAvatarClick={handleAvatarClick}
          onMakeCall={handleMakeCall}
          onUpdateGlobalStarred={(messageData, action) => {
            if (action === 'add') {
              setGlobalStarredMessages(prev => {
                const exists = prev.some(item => 
                  item.chatName === messageData.chatName && 
                  item.message.id === messageData.message.id
                );
                if (!exists) {
                  return [...prev, messageData];
                }
                return prev;
              });
            } else if (action === 'remove') {
              setGlobalStarredMessages(prev => 
                prev.filter(item => 
                  !(item.chatName === messageData.chatName && 
                    item.message.id === messageData.message.id)
                )
              );
            }
          }}
          onUpdateGlobalPinned={(messageData, action) => {
            if (action === 'add') {
              setGlobalPinnedMessages(prev => {
                const exists = prev.some(item => 
                  item.chatName === messageData.chatName && 
                  item.message.id === messageData.message.id
                );
                if (!exists) {
                  return [...prev, messageData];
                }
                return prev;
              });
            } else if (action === 'remove') {
              setGlobalPinnedMessages(prev => 
                prev.filter(item => 
                  !(item.chatName === messageData.chatName && 
                    item.message.id === messageData.message.id)
                )
              );
            }
          }}
        />
      )}
      
      {selectedCategory && (
        <div className="absolute inset-0 bg-white z-20">
          <CategoryInfo 
            category={selectedCategory}
            onBack={goBackToCategories}
          />
        </div>
      )}

      {!showOverlay && !showSettings && (
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">WhatsApp</h1>
            <div className="flex items-center space-x-4 relative">
              <Search 
                className="w-5 h-5 cursor-pointer" 
                onClick={activeTab === 'chats' ? openGlobalSearch : 
                  activeTab === 'status' ? openStatusSearch : 
                  activeTab === 'calls' ? (() => setShowCallsSearch(true)) : 
                  openGlobalSearch}
                />
              <button 
                className="more-menu"
                onClick={() => {
                  console.log('More menu clicked, activeTab:', activeTab); // Add this for debugging
                  if (activeTab === 'chats') {
                    setShowChatsMenu(!showChatsMenu);
                  } else if (activeTab === 'categories') {
                    setShowCategoriesMenu(!showCategoriesMenu);
                  } else if (activeTab === 'status') {
                    setShowStatusMenu(!showStatusMenu);
                  } else if (activeTab === 'calls') {
                    setShowCallsMenu(!showCallsMenu);
                  }
                }}
              >
                <MoreVertical className="w-5 h-5 cursor-pointer" />
              </button>

              {showCategoriesMenu && activeTab === 'categories' && (
                <div className="absolute right-0 top-12 bg-gray-900 text-white rounded-lg shadow-lg p-2 w-48 z-50">
                  <button 
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
                    onClick={() => {
                      setShowCategoriesMenu(false);
                      openSettings();
                    }}
                  >
                    Settings
                  </button>
                </div>
              )}

              {showCallsMenu && activeTab === 'calls' && (
                <div className="more-menu absolute right-0 top-12 bg-gray-900 text-white rounded-lg shadow-lg p-2 w-48 z-50">
                  <button 
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
                    onClick={() => {
                      setShowCallsMenu(false);
                      setCallLogs([]); // Clear all call logs
                    }}
                  >
                    Clear call logs
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
                    onClick={() => {
                      setShowCallsMenu(false);
                      openSettings();
                    }}
                  >
                    Settings
                  </button>
                </div>
              )}

              {showStatusMenu && activeTab === 'status' && (
                <div className="more-menu absolute right-0 top-12 bg-gray-900 text-white rounded-lg shadow-lg p-2 w-48 z-50">
                  <button 
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
                    onClick={() => {
                      setShowStatusMenu(false);
                      setShowStatusSettings(true);
                    }}
                  >
                    Status privacy
                  </button>
                  <button 
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
                    onClick={() => {
                      setShowStatusMenu(false);
                      openSettings();
                    }}
                  >
                    Settings
                  </button>
                </div>
              )}

              {showChatsMenu && activeTab === 'chats' && (
                <div ref={menuRef}>
                  <ChatsMenu
                    onClose={closeChatsMenu}
                    onNewGroup={handleNewGroup}
                    onNewCategory={handleNewCategory}
                    onStarred={() => {
                      setShowStarredMessages(true);
                      closeChatsMenu();
                    }}
                    onPinned={() => {
                      setShowPinnedMessages(true);
                      closeChatsMenu();
                    }}
                    onSettings={openSettings}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!showOverlay && (
        <div className="flex bg-green-600">
          
          <button
            onClick={() => handleTabSwitch('chats')}
            className={`flex-1 py-3 px-2 text-center text-md flex items-center justify-center gap-2 ${
              activeTab === 'chats' 
                ? 'text-white font-extrabold border-b-2' 
                : 'text-gray-200 font-extrabold'
            }`}
          >
            Chats
            {unreadChatsCount > 0 && <span className="bg-white text-green-600 text-xs font-bold rounded-full flex items-center justify-center w-6 h-5">{unreadChatsCount}</span>}
          </button>
          <button
            onClick={() => handleTabSwitch('categories')}
            className={`flex-1 py-3 px-2 text-center text-md flex items-center justify-center gap-2 ${
              activeTab === 'categories' 
                ? 'text-white font-extrabold border-b-2' 
                : 'text-gray-200 font-extrabold'
            }`}
          >
            Categories
            {unreadCategoriesCount > 0 && <span className="bg-white text-green-600 text-xs font-bold rounded-full flex items-center justify-center w-6 h-5">{unreadCategoriesCount}</span>}
          </button>
          <button
            onClick={() => handleTabSwitch('status')}
            className={`flex-1 py-3 px-2 text-center text-md flex items-center justify-center gap-2 ${
              activeTab === 'status' 
                ? 'text-white font-extrabold border-b-2' 
                : 'text-gray-200 font-extrabold'
            }`}
          >
            Status
          </button>
          <button
            onClick={() => handleTabSwitch('calls')}
            className={`flex-1 py-3 px-2 text-center text-md flex items-center justify-center gap-2 ${
              activeTab === 'calls' 
                ? 'text-white font-extrabold border-b-2' 
                : 'text-gray-200 font-extrabold'
            }`}
          >
            Calls
          </button>
        </div>
      )}

      {!showOverlay && (
        <div className="flex-1 overflow-y-auto" style={{ height: '480px' }}>
          {activeTab === 'chats' && (
            <div className="h-full overflow-y-auto">
              {uncategorizedChats.map(chat => {
                const chatStatus = statuses.find(s => s.name === chat.name);
                return (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    status={chatStatus}
                    onAvatarClick={handleAvatarClick}
                    onChatClick={setActiveChat}
                    onMuteToggle={handleMuteToggle}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="h-full overflow-y-auto">
              {categories.map(category => {
                const categoryChats = getChatsByCategory(category.id);
                const totalUnread = getTotalUnreadForCategory(category.id);
                const isExpanded = !!expandedCategories[category.id];
                console.log(`Category ${category.name}: ${categoryChats.length} chats, expanded: ${isExpanded}`);

                return (
                  <div key={category.id} className="mb-1">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => toggleCategoryExpansion(category.id)}>
                      <div className="flex items-center space-x-3">
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {category.notifications ? (
                          totalUnread > 0 && (
                            <span className="bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center w-5 h-5">
                              {totalUnread}
                            </span>
                          )
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCategoryNotifications(category.id);
                            }}
                            className="p-1 rounded-full hover:bg-gray-200"
                          >
                            <BellOff size={16} className="text-gray-600" />
                          </button>
                        )}
                        <div className="relative">
                          <button 
                            onClick={(e) => handleCategorySettingsClick(e, category.id)} 
                            className="p-1 rounded-full hover:bg-gray-200"
                          >
                            <SettingsIcon size={16} className="text-gray-600" />
                          </button>
                                                    
                          {openCategorySettings === category.id && (
                            <div ref={categorySettingsMenuRef} className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                              <ul className="py-1">
                                <li>
                                  <button onClick={() => {
                                    // Use the updated categories state
                                    const updatedCategory = categories.find(cat => cat.id === category.id);
                                    setShowAddMemberModal(updatedCategory);
                                    setOpenCategorySettings(null);
                                  }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                    <UserPlus size={16} className="mr-2 text-green-500"/> Add Members
                                  </button>
                                </li>
                                <li>
                                  <button onClick={() => { 
                                    const updatedCategory = categories.find(cat => cat.id === category.id);
                                    setShowRemoveMemberModal(updatedCategory); 
                                    setOpenCategorySettings(null); 
                                  }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                    <UserMinus size={16} className="mr-2 text-red-500"/> Remove Members
                                  </button>
                                </li>
                                <li>
                                  <button onClick={() => handleToggleCategoryNotifications(category.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                    {category.notifications ? <BellOff size={16} className="mr-2 text-gray-600"/> : <Bell size={16} className="mr-2 text-green-500"/>}
                                    {category.notifications ? 'Mute Notifications' : 'Unmute Notifications'}
                                  </button>
                                </li>
                                <div className="border-t my-1"></div>
                                <li>
                                  <button onClick={() => handleRemoveCategory(category.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                                    <Trash2 size={16} className="mr-2"/>Remove Category
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="pl-4 ml-4 border-l-2 border-gray-200">
                        {categoryChats.length === 0 ? (
                          <div className="p-4 text-gray-500 text-sm">No members in this category</div>
                        ) : (
                          categoryChats.map(chat => (
                            <ChatItem 
                              key={chat.id} 
                              chat={chat} 
                              status={statuses.find(s => s.name === chat.name)} 
                              onAvatarClick={handleAvatarClick} 
                              onChatClick={(chat) => {
                                setActiveChat(chat);
                                setActiveTab('chats');
                              }} 
                              onMuteToggle={handleMuteToggle} 
                              onArchive={handleArchive} 
                              onDelete={handleDelete}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'status' && (
            <div className="relative h-full">
              <div className="h-full overflow-y-auto">   
                <div
                  onClick={() => {
                    if (myStatuses.length > 0) {
                      setShowMyStatusViewer(true);
                    } else {
                      setShowMyStatusManager(true);
                    }
                  }}
                >
                  <StatusItem status={statusData[0]} hasStatuses={myStatuses.length > 0} />
                </div> 
                <div className="px-4 py-1 mt-1">
                  <h3 className="text-sm font-medium text-gray-500">RECENT UPDATES</h3>
                </div>
                {statuses.slice(1).map((status) => (
                  <div key={status.id} onClick={() => setActiveStatusViewer(status)}>
                    <StatusItem status={status} />
                  </div>
                ))}
              </div>              
            </div>
          )}

          {activeTab === 'calls' && (
            <div className="h-full overflow-y-auto">
              {callLogs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-600">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <Phone size={40} />   {/* Increase size (e.g., 64px) */}
                    </div>
                    <p>No call logs yet</p>
                    <p className="text-sm">Make a call to see it here</p>
                  </div>
                </div>
              ) : (
                callLogs.map(call => (
                  <CallItem key={call.id} call={call} onMakeCall={handleMakeCall}/>
                ))
              )}
            </div>
          )}          
        </div>
      )}

      {!showOverlay && (
        <div className="absolute bottom-4 right-4">
          <div className="relative">
            <button 
              className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center"
              onClick={handleFloatingButtonClick}
            >
              {activeTab === 'chats' && <MessageCircle className="w-6 h-6 text-white" />}
              {activeTab === 'categories' && <Users className="w-6 h-6 text-white" />}
              {activeTab === 'status' && <Camera className="w-6 h-6 text-white" />}
              {activeTab === 'calls' && (
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              )}
            </button>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200">
              <span className="text-green-500 text-lg font-bold">+</span>
            </div>
          </div>
        </div>
      )}

      <NewCategoryModal 
        isOpen={showNewCategoryModal}
        onClose={() => setShowNewCategoryModal(false)}
        onCreate={handleCreateCategory}
      />
    </div>
  );
};

export default App;