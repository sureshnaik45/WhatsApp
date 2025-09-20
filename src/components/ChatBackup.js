import React from 'react';
import { ArrowLeft, Download, User } from 'lucide-react';

const ChatBackup = ({ onBack, onIndividualBackup, onGeneralBackup }) => {
  
  return (
    <div className={`h-full flex flex-col bg-white`}>
      {/* Header - Always green */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Chat Backup</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="mb-4">
            <h3 className={`text-sm font-medium mb-2 text-gray-500`}>BACKUP OPTIONS</h3>
          </div>
          
          {/* Back Up Button */}
          <div className="flex bg-white rounded-lg">
            <button 
              onClick={onIndividualBackup}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white m-2 p-3 rounded-lg font-medium text-center"
            >
              Individual Backup
            </button>

            <button 
              onClick={onGeneralBackup}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white m-2 p-3 rounded-lg font-medium text-center"
            >
              Back up
            </button>
            
          </div>

          {/* Backup Info Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900">Backup settings</h4>
            <p className="text-sm text-gray-600 mb-4">
              Back up your chats and media to your Google Account's storage. You can restore them on a new phone after you download WhatsApp on it.
            </p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div>Local: 2:18 am</div>
              <div>Last Backup: Never</div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-green-600 text-sm cursor-pointer hover:underline">
                Manage Google storage
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Google Account</div>
                <div className="text-sm text-gray-600">None selected</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Automatic backups</div>
                <div className="text-sm text-gray-600">Off</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900">Include videos</div>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-900">Back up using cellular</div>
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ChatBackup;