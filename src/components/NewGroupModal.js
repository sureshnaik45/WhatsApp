import React, { useState } from 'react';
import { ArrowLeft, Users, Search, Check } from 'lucide-react';
import { chatsData } from '../data/chats.js';

const NewGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState(1); // 1: Add participants, 2: Group info
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');

  const getFilteredContacts = () => {
    return chatsData.filter(chat => 
      !chat.isGroup && 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleContactToggle = (contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.id === contact.id);
      return isSelected ? prev.filter(c => c.id !== contact.id) : [...prev, contact];
    });
  };

  const handleNext = () => {
    if (selectedContacts.length > 0) setStep(2);
  };

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      const newGroup = {
        id: Date.now(),
        name: groupName.trim(),
        message: `You created group "${groupName.trim()}"`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        avatar: '👥',
        isGroup: true,
        isMuted: false,
        members: ['You', ...selectedContacts.map(c => c.name)],
        description: groupDescription.trim() || 'No description',
      };
      onCreate(newGroup);
      // Reset all states and close
      setStep(1);
      setSelectedContacts([]);
      setGroupName('');
      setGroupDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedContacts([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {step === 1 ? (
        <>
          <div className="bg-green-600 text-white px-4 py-3">
            <div className="flex items-center space-x-3">
              <button onClick={handleClose} className="text-white p-1"><ArrowLeft size={24} /></button>
              <div>
                <h1 className="text-lg font-medium">New Group</h1>
                <p className="text-sm text-green-100">Add participants</p>
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
            {getFilteredContacts().map(contact => {
              const isSelected = selectedContacts.some(c => c.id === contact.id);
              return (
                <div key={contact.id} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => handleContactToggle(contact)}>
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">{contact.avatar}</div>
                  <div className="flex-1"><h3 className="font-medium text-gray-900">{contact.name}</h3></div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                </div>
              );
            })}
          </div>
          {selectedContacts.length > 0 && (
            <div className="p-4 bg-white">
              <button onClick={handleNext} className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg ml-auto hover:bg-green-600">
                <ArrowLeft size={24} className="transform rotate-180" />
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="bg-green-600 text-white px-4 py-3">
            <div className="flex items-center space-x-3">
              <button onClick={() => setStep(1)} className="text-white p-1"><ArrowLeft size={24} /></button>
              <h1 className="text-lg font-medium">New Group</h1>
            </div>
          </div>
          <div className="flex-1 p-6 bg-gray-50">
            <div className="text-center mb-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center"><Users size={48} className="text-gray-500" /></div>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Group name" className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-green-500" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              <input type="text" placeholder="Group description (optional)" className="w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-green-500" value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} />
            </div>
          </div>
          {groupName.trim() && (
            <div className="p-4 bg-white">
              <button onClick={handleCreateGroup} className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg ml-auto hover:bg-green-600">
                <Check size={24} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewGroupModal;