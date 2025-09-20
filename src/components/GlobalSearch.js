import React, { useState } from 'react';
import ChatItem from './ChatItem.js';
import { chatsData } from '../data/chats.js';

const GlobalSearch = ({ onBack, onChatClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chatsData.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search Header */}
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
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery.trim() === '' ? (
          <div>
            <div className="px-4 py-2 bg-gray-50">
              <span className="text-sm text-gray-600">All Chats</span>
            </div>
            {chatsData.map(chat => (
              <div key={chat.id} onClick={() => onChatClick(chat)}>
                <ChatItem chat={chat} />
              </div>
            ))}
          </div>
        ) : filteredChats.length > 0 ? (
          <div>
            <div className="px-4 py-2 bg-gray-50">
              <span className="text-sm text-gray-600">
                {filteredChats.length} result{filteredChats.length !== 1 ? 's' : ''} found
              </span>
            </div>
            {filteredChats.map(chat => (
              <div key={chat.id} onClick={() => onChatClick(chat)}>
                <ChatItem chat={chat} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">❌</div>
              <p>No results found for "{searchQuery}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;