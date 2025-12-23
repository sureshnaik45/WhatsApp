import React, { useState } from 'react';

const ChatPrivacy = ({ onBack }) => {
  const [screenshotPrivacy, setScreenshotPrivacy] = useState('everyone');

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">Chat Privacy</h1>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-1">Screenshot Privacy</h3>
          
          <div className="space-y-1">
            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="screenshotPrivacy"
                value="everyone"
                checked={screenshotPrivacy === 'everyone'}
                onChange={(e) => setScreenshotPrivacy(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">Everyone</span>
                <p className="text-sm text-gray-600">Allow screenshots from everyone</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="screenshotPrivacy"
                value="contacts"
                checked={screenshotPrivacy === 'contacts'}
                onChange={(e) => setScreenshotPrivacy(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">My Contacts</span>
                <p className="text-sm text-gray-600">Allow screenshots from contacts only</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="screenshotPrivacy"
                value="selected"
                checked={screenshotPrivacy === 'selected'}
                onChange={(e) => setScreenshotPrivacy(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">Selected Contacts</span>
                <p className="text-sm text-gray-600">Choose specific contacts</p>
              </div>
            </label>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default ChatPrivacy;