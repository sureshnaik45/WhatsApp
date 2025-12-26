import React from 'react';
import { Lock, Download, MessageSquare, Calendar } from 'lucide-react';

const PrivacyMenu = ({ onBack, onOpenStatusPrivacy, onOpenChatPrivacy, onOpenProfileDownloadPrivacy, onOpenCalendarPrivacy }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">Privacy</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-500 font-medium px-2">Who can see my personal info</p>
          
          <div 
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={onOpenStatusPrivacy}
          >
            <Lock className="w-6 h-6 mr-4 text-gray-600" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Status privacy</h3>
              <p className="text-sm text-gray-600">Select who can see your status updates</p>
            </div>
            <span className="text-gray-400">➜</span>
          </div>

          <div 
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={onOpenChatPrivacy}
          >
            <MessageSquare className="w-6 h-6 mr-4 text-gray-600" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Chat privacy</h3>
              <p className="text-sm text-gray-600">Screenshot settings</p>
            </div>
            <span className="text-gray-400">➜</span>
          </div>

          <div 
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={onOpenProfileDownloadPrivacy}
          >
            <Download className="w-6 h-6 mr-4 text-gray-600" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Profile download privacy</h3>
              <p className="text-sm text-gray-600">Control who can download your profile</p>
            </div>
            <span className="text-gray-400">➜</span>
          </div>

          <div 
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={onOpenCalendarPrivacy}
          >
            <Calendar className="w-6 h-6 mr-4 text-gray-600" />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Calendar privacy</h3>
              <p className="text-sm text-gray-600">Manage visibility of your birthdays</p>
            </div>
            <span className="text-gray-400">➜</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyMenu;