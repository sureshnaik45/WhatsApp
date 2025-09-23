import React from 'react';
import { ArrowLeft} from 'lucide-react';

const ChatBackup = ({ onBack, onIndividualBackup, onGeneralBackup }) => {
  
  return (
    <div className={`h-full flex flex-col bg-white`}>

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

          </div>          
        </div>
      </div>
    </div>
  );
};

export default ChatBackup;