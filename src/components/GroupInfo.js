// In GroupInfo.js, replace the entire component with this updated version:

import React, { useState } from 'react';
import { ArrowLeft, UserPlus, UserMinus, Search, UserLock } from 'lucide-react';
import ContactSelector from './ContactSelector.js';

const GroupInfo = ({ chat, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAddMembersSelector, setShowAddMembersSelector] = useState(false);
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'You', avatar: '👤', isAdmin: true },
    { id: 2, name: 'Mom', avatar: '👩‍💼', isAdmin: true },
    { id: 3, name: 'Dad', avatar: '👨‍🦳', isAdmin: false },
    { id: 4, name: 'Sister', avatar: '👩‍🎓', isAdmin: false },
    { id: 5, name: 'Uncle John', avatar: '👨‍🦲', isAdmin: false }
  ]);

  const filteredMembers = groupMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMakeAdmin = (memberId) => {
    setGroupMembers(prev => {
      const updated = prev.map(member => 
        member.id === memberId ? { ...member, isAdmin: true } : member
      );
      // Sort: You first, then admins, then regular members
      return updated.sort((a, b) => {
        if (a.name === 'You') return -1;
        if (b.name === 'You') return 1;
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return 0;
      });
    });
  };

  const handleRemoveUser = (memberId) => {
    const member = groupMembers.find(m => m.id === memberId);
    if (window.confirm(`Remove ${member.name} from group?`)) {
      setGroupMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  const handleAddMembers = (selectedContacts) => {
    // Check if any selected contacts are already in the group
    const alreadyMembers = selectedContacts.filter(contact => 
      groupMembers.some(member => member.name === contact.name)
    );
    
    if (alreadyMembers.length > 0) {
      const memberNames = alreadyMembers.map(member => member.name).join(', ');
      alert(`${memberNames} ${alreadyMembers.length === 1 ? 'is' : 'are'} already in ${chat.name}`);
      return;
    }
    
    const newMembers = selectedContacts.map(contact => ({
      ...contact,
      isAdmin: false
    }));
    
    setGroupMembers(prevMembers => [...prevMembers, ...newMembers]);
    setShowAddMembersSelector(false);
    
    alert(`Added ${newMembers.length} member(s) to ${chat.name}`);
  };

  if (showAddMembersSelector) {
    return (
      <ContactSelector 
        onBack={() => setShowAddMembersSelector(false)}
        onAddMembers={handleAddMembers}
        mode="addMember"
        categoryName={chat.name}
        existingMembers={groupMembers}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white p-1 rounded-full hover:bg-black/10">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Group Info</h1>
        </div>
      </div>

      {/* Main scrollable container */}
      <div className="flex-1 overflow-y-auto">
        {/* Group Profile Info */}
        <div className="p-6 text-center border-b">
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
            {chat.avatar}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{chat.name}</h2>
          <p className="text-gray-600 mt-1">Group · {groupMembers.length} members</p>
        </div>

        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            {showSearch ? (
              <input
                type="text"
                placeholder="Search members..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            ) : (
              <h3 className="text-sm font-medium text-gray-500">
                MEMBERS ({filteredMembers.length})
              </h3>
            )}
            
            {!showSearch && (
              <button 
                onClick={() => setShowSearch(true)}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <Search size={16} className="text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Fixed Add Members Button */}
        <div className="px-4 py-3">
          <button 
            className="flex items-center space-x-3 w-full  rounded-lg"
            onClick={() => setShowAddMembersSelector(true)}
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <UserPlus size={20} className="text-white" />
            </div>
            <span className="font-medium text-green-600">Add members</span>
          </button>
        </div>

        {/* Members List */}
        <div className="px-4">
          {filteredMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  {member.isAdmin && (
                    <p className="text-sm text-green-600 font-semibold">Group admin</p>
                  )}
                </div>
              </div>
              
              {member.name !== 'You' && (
                <div className="flex items-center space-x-2">
                  {!member.isAdmin && (
                    <button 
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      onClick={() => handleMakeAdmin(member.id)}
                      title="Make admin"
                    >
                      <UserLock size={16} />
                    </button>
                  )}
                  <button 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    onClick={() => handleRemoveUser(member.id)}
                    title="Remove user"
                  >
                    <UserMinus size={16} /> 
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;