import React, { useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import ChatBackup from './ChatBackup.js';

const ChatSettings = ({ onBack, onIndividualBackup }) => {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'background', 'gallery', 'chatBackup'

  if (currentView === 'chatBackup') {
    return (
      <ChatBackup 
        onBack={() => setCurrentView('main')}
        onIndividualBackup={onIndividualBackup}
        onGeneralBackup={() => {
          alert('General backup started! This would backup all chats.');
        }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Chats</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div>
          <h3 className="text-sm font-medium mb-2 px-2 text-gray-500">BACKUP</h3>
          <div 
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => setCurrentView('chatBackup')}
          >
            <Download className="w-6 h-6 mr-4 text-gray-600" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Chat Backup</h3>
              <p className="text-sm text-gray-500">Backup and export your chats</p>
            </div>
            <span className="text-2xl font-light text-gray-400">›</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;