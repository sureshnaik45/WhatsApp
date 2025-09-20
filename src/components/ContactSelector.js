import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { chatsData } from '../data/chats.js';

const ContactSelector = ({ 
  onBack, 
  onSelectContact, 
  mode = 'call', // 'call', 'chat', 'addMember'
  categoryName = '',
  existingMembers = [],
  onAddMembers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const getFilteredContacts = () => {
    let contacts = chatsData.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (mode === 'call' || mode === 'chat' || mode === 'birthday') {
      contacts = contacts.filter(chat => !chat.isGroup);
    } else if (mode === 'addMember') {
      contacts = contacts.filter(chat => !chat.isGroup);
    }

    return contacts;
  };

  const filteredContacts = getFilteredContacts();

  const handleContactClick = (contact) => {
    if (mode === 'addMember') {
      setSelectedContacts(prev => {
        const isSelected = prev.some(c => c.id === contact.id);
        if (isSelected) {
          return prev.filter(c => c.id !== contact.id);
        } else {
          return [...prev, contact];
        }
      });
    } else {
      onSelectContact(contact);
    }
  };

  const handleAddSelected = () => {
    if (selectedContacts.length > 0 && onAddMembers) {
      onAddMembers(selectedContacts);
    }
  };

  const getSubtitle = (contact) => {
    switch (mode) {
      case 'call': return 'Tap to call';
      case 'chat': return 'Tap to chat';
      case 'backup': return 'Tap to backup';
      case 'birthday': return 'Tap to add birthday';
      case 'addMember': return '';
      default: return 'Tap to call';
    }
  };

  const getHeaderTitle = () => {
    switch (mode) {
      case 'call': return 'Select Contact';
      case 'chat': return 'Select Contact';
      case 'backup': return 'Individual Backup';
      case 'birthday': return 'Add Birthday';
      case 'addMember': return `Add to ${categoryName}`;
      default: return 'Select Contact';
    }
  };

  const isSelected = (contact) => {
    return selectedContacts.some(c => c.id === contact.id);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white hover:bg-green-700 p-1 rounded">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-medium">{getHeaderTitle()}</h1>
            {mode === 'addMember' && selectedContacts.length > 0 && (
              <p className="text-sm text-green-200">{selectedContacts.length} selected</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleContactClick(contact)}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">
              {contact.avatar}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{contact.name}</h3>
              <p className="text-sm text-gray-600">{getSubtitle(contact)}</p>
            </div>
            {mode === 'addMember' && (
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isSelected(contact) ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}>
                {isSelected(contact) && <div className="w-3 h-3 bg-white rounded-full"></div>}
              </div>
            )}
          </div>
        ))}
      </div>

      {mode === 'addMember' && selectedContacts.length > 0 && (
        <div className="p-4 bg-white border-t">
          <button 
            onClick={handleAddSelected}
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            Add Selected ({selectedContacts.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactSelector;