import React from 'react';
import { User, Bell, Lock, Palette, HelpCircle, Info, CalendarHeart } from 'lucide-react';

const Settings = ({ onBack, userPhoto, onOpenChatSettings, onOpenCalendar, onOpenProfile, onOpenAbout }) => {

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">Settings</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4 space-y-4">
          <div 
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={onOpenProfile}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-4">
              {typeof userPhoto === 'string' && userPhoto.length === 2 ? (
                userPhoto
              ) : userPhoto ? (
                <img src={userPhoto} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-sm text-gray-600">John Doe</h3>
              <p className="text-sm text-gray-600">Hey there! I am using WhatsApp.</p>
            </div>
            <span className="text-gray-400">➜</span>
          </div>
          <hr className=" border-gray-200" />

          {/* Settings Options */}
          {[
            { icon: User, label: 'Account', description: 'Security notifications, change number' },
            { icon: Lock, label: 'Privacy', description: 'Block contacts, disappearing messages' },
            { icon: Bell, label: 'Notifications', description: 'Message, group & call tones' },
            { icon: Palette, label: 'Chats', description: 'Chat backup' },
            { icon: CalendarHeart, label: 'Calendar', description: 'Add birthdays, special days' },
            { icon: HelpCircle, label: 'Help', description: 'Help center, contact us, privacy policy' },
            { icon: Info, label: 'About', description: 'Version info and terms of service' }
          ].map((item, index) => (
            <div 
              key={index}
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => {
                if (item.label === 'Chats') {
                  onOpenChatSettings();
                } else if (item.label === 'Calendar') {
                  onOpenCalendar();
                } else if (item.label === 'About') {
                  onOpenAbout();
                }
              }}
            >
              <item.icon className="w-6 h-6 mr-4 text-gray-600" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <span className="text-gray-400">➜</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;