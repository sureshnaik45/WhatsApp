import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Settings, Bell, BellOff, Plus, Minus, Search, X, UserPlus, UserMinus, VolumeX, Volume2, Trash2 } from 'lucide-react';
import { chatsData } from '../data/chats.js';
import ChatItem from './ChatItem.js';

const CategoryChatWindow = ({setChats, onShowContactSelector}) => {
  const [expandedCategories, setExpandedCategories] = useState({ family: true, work: true });
  const [openSettingsMenu, setOpenSettingsMenu] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedMembersForRemove, setSelectedMembersForRemove] = useState([]);
  
  const [categories, setCategories] = useState([
    { id: 'family', name: 'Family', color: '#4CAF50', notifications: true, contacts: ['Mom', 'Dad', 'Uncle John'] },
    { id: 'work', name: 'Work', color: '#2196F3', notifications: true, contacts: ['Boss - Mike', 'Team Lead Sarah'] },
    { id: 'friends', name: 'Friends', color: '#FF9800', notifications: false, contacts: ['Alex Johnson', 'Emma Wilson', 'Tom Parker', 'Lisa Chen'] },
    { id: 'college', name: 'College', color: '#9C27B0', notifications: true, contacts: ['College Friends'] },
  ]);

  const [chats] = useState(chatsData);
  const settingsMenuRef = useRef(null);
  
  const [showAddMember, setShowAddMember] = useState(null);
  const [showRemoveMember, setShowRemoveMember] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setOpenSettingsMenu(null);
      }
    };
    if (openSettingsMenu) { document.addEventListener('mousedown', handleClickOutside); }
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, [openSettingsMenu]);

  const toggleCategoryExpansion = (categoryId) => setExpandedCategories(p => ({ ...p, [categoryId]: !p[categoryId] }));
  
  const getChatsByCategory = (categoryId) => {
    return chats.filter(chat => chat.category === categoryId);
  };  
  
  const getTotalUnreadForCategory = (category) => {
    if (!category.notifications) return 0;
    return getChatsByCategory(category.id).reduce((total, chat) => {
      if (chat.isMuted) return total;
      return total + chat.unread;
    }, 0);
  };

  const handleSettingsClick = (e, category) => {
    e.stopPropagation();
    setOpenSettingsMenu(openSettingsMenu?.id === category.id ? null : category);
  };
  
  const toggleNotifications = (categoryId) => {
    setCategories(p => p.map(c => c.id === categoryId ? { ...c, notifications: !c.notifications } : c));
    setOpenSettingsMenu(null);
  };
  
  const removeCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to remove this category?")) {
      setCategories(p => p.filter(c => c.id !== categoryId));
      setOpenSettingsMenu(null);
    }
  };
  
  // UI for Add Member screen
  if (showAddMember) {
    const category = showAddMember;
    
    const availableContacts = chatsData.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !category.contacts.includes(contact.name) &&
      !contact.isGroup
    );

    const handleContactSelect = (contact) => {
      const existingCategory = categories.find(cat => cat.contacts.includes(contact.name));

      if (existingCategory) {
        if (existingCategory.id === showAddMember.id) {
          alert(`${contact.name} is already in this category.`);
        } else {
          alert(`${contact.name} is already in the '${existingCategory.name}' category. Remove from there first.`);
        }
        return;
      }
      
      const isAlreadySelected = selectedContacts.find(c => c.id === contact.id);
      if (isAlreadySelected) {
        setSelectedContacts(prev => prev.filter(c => c.id !== contact.id));
      } else {
        setSelectedContacts(prev => [...prev, contact]);
      }
    };

    const handleAddSelected = () => {
      if (selectedContacts.length === 0) return;
      
      setCategories(prev => 
        prev.map(cat => 
          cat.id === showAddMember.id 
            ? { ...cat, contacts: [...cat.contacts, ...selectedContacts.map(c => c.name)] }
            : cat
        )
      );

      if (setChats) {
        setChats(prevChats => 
          prevChats.map(chat => 
            selectedContacts.find(sc => sc.id === chat.id)
              ? { ...chat, category: showAddMember.id }
              : chat
          )
        );
      }
      setShowAddMember(null);
      setSelectedContacts([]);
      setSearchQuery('');
    };

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowAddMember(null)} className="text-white p-1 rounded-full hover:bg-black/10">
              <X size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-medium">Add to {category.name}</h1>
              <p className="text-sm text-green-100">{selectedContacts.length} selected</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search contacts..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {availableContacts.map(contact => {
            const isSelected = selectedContacts.find(c => c.id === contact.id);
            return (
              <div key={contact.id} onClick={() => handleContactSelect(contact)} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-xl">{contact.avatar}</div>
                <div className="flex-1"><h3 className="font-medium">{contact.name}</h3></div>
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
          {availableContacts.length === 0 && (<div className="p-8 text-center text-gray-500"><p>No contacts available to add</p></div>)}
        </div>
        {selectedContacts.length > 0 && (
          <div className="p-4 bg-white border-t">
            <button onClick={handleAddSelected} className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600">
              Add Selected ({selectedContacts.length})
            </button>
          </div>
        )}
      </div>
    );
  }

  // UI for Remove Member screen with checkboxes
  if (showRemoveMember) {
    const category = showRemoveMember;
    
    const categoryChats = getChatsByCategory(category.id);
    
    const handleRemoveMember = (chat) => {
      const isSelected = selectedMembersForRemove.find(c => c.id === chat.id);
      if (isSelected) {
        setSelectedMembersForRemove(prev => prev.filter(c => c.id !== chat.id));
      } else {
        setSelectedMembersForRemove(prev => [...prev, chat]);
      }
    };

    const handleRemoveSelected = () => {
      if (selectedMembersForRemove.length === 0) return;
      
      if (window.confirm(`Remove ${selectedMembersForRemove.length} member${selectedMembersForRemove.length > 1 ? 's' : ''} from ${category.name}?`)) {
        setCategories(p => p.map(c => 
          c.id === category.id 
            ? { ...c, contacts: c.contacts.filter(name => 
                !selectedMembersForRemove.some(member => member.name === name)
              )}
            : c
        ));
        
        if (setChats) {
          setChats(prevChats => 
            prevChats.map(chat => 
              selectedMembersForRemove.some(member => member.id === chat.id)
                ? { ...chat, category: undefined }
                : chat
            )
          );
        }
        setShowRemoveMember(null);
      }
    };

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => setShowRemoveMember(null)} className="text-white p-1 rounded-full hover:bg-black/10">
              <X size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-medium">Remove from {category.name}</h1>
              <p className="text-sm text-green-100">{selectedMembersForRemove.length} selected</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {categoryChats.map(chat => {
            const isSelected = selectedMembersForRemove.find(c => c.id === chat.id);
            return (
              <div key={chat.id} onClick={() => handleRemoveMember(chat)} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-xl">{chat.avatar}</div>
                <div className="flex-1"><h3 className="font-medium">{chat.name}</h3></div>
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
          {categoryChats.length === 0 && (<div className="p-8 text-center text-gray-500"><p>No members in this category</p></div>)}
        </div>
        {selectedMembersForRemove.length > 0 && (
          <div className="p-4 bg-white border-t">
            <button onClick={handleRemoveSelected} className="w-full bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600">
              Remove Selected ({selectedMembersForRemove.length})
            </button>
          </div>
        )}
      </div>
    );
  }

  // Main Category List View
  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto">
        {categories.map(category => {
          const totalUnread = getTotalUnreadForCategory(category);
          const isExpanded = !!expandedCategories[category.id];
          const categoryChats = getChatsByCategory(category.id);

          return (
            <div key={category.id} className="mb-1">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => toggleCategoryExpansion(category.id)}>
                <div className="flex items-center space-x-3">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="font-medium text-gray-800">{category.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {totalUnread > 0 && category.notifications && (<span className="bg-green-500 text-white text-xs font-semibold rounded-full flex items-center justify-center w-5 h-5">{totalUnread}</span>)}
                  <div className="relative">
                    <button onClick={(e) => handleSettingsClick(e, category)} className="p-1 rounded-full hover:bg-gray-200">
                      <Settings size={16} className="text-gray-600" />
                    </button>
                    {openSettingsMenu?.id === category.id && (
                      <div ref={settingsMenuRef} className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                        <ul className="py-1">
                          <li>
                            <button onClick={() => { 
                              setShowAddMember(category);
                              setOpenSettingsMenu(null); 
                            }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                              <UserPlus size={16} className="mr-2 text-green-500"/> Add Members
                            </button>
                          </li>
                          <li><button onClick={() => { setShowRemoveMember(category); setOpenSettingsMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"><UserMinus size={16} className="mr-2 text-red-500"/> Remove Members</button></li>
                          <li><button onClick={() => toggleNotifications(category.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">{category.notifications ? <VolumeX size={16} className="mr-2 text-gray-600"/> : <Volume2 size={16} className="mr-2 text-green-500"/>}{category.notifications ? 'Mute Notifications' : 'Unmute Notifications'}</button></li>
                          <div className="border-t my-1"></div>
                          <li><button onClick={() => removeCategory(category.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"><Trash2 size={16} className="mr-2"/>Remove Category</button></li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className="pl-4">
                  {categoryChats.map(chat => (
                    <ChatItem 
                      key={chat.id} 
                      chat={chat} 
                      onChatClick={(chat) => console.log('Chat clicked:', chat)}
                      onMuteToggle={(chatId) => console.log('Mute toggled:', chatId)}
                      onArchive={(chatId) => console.log('Archived:', chatId)}
                      onDelete={(chatId) => console.log('Deleted:', chatId)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChatWindow;