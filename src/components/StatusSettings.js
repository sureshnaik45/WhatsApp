import React, { useState } from 'react';

const StatusSettings = ({ onBack }) => {
  const [shareWith, setShareWith] = useState('everyone');
  const [allowDownload, setAllowDownload] = useState(true);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">Status Privacy</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-1">Share Status With</h3>
          
          <div className="space-y-1">
            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="shareWith"
                value="everyone"
                checked={shareWith === 'everyone'}
                onChange={(e) => setShareWith(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">Everyone</span>
                <p className="text-sm text-gray-600">Share with all contacts</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="shareWith"
                value="contacts"
                checked={shareWith === 'contacts'}
                onChange={(e) => setShareWith(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">My Contacts</span>
                <p className="text-sm text-gray-600">Share with contacts only</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="shareWith"
                value="selected"
                checked={shareWith === 'selected'}
                onChange={(e) => setShareWith(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">Selected Contacts</span>
                <p className="text-sm text-gray-600">Choose specific contacts</p>
              </div>
            </label>
          </div>
        </div>

        <div className="border-t pt-5">
          <h3 className="text-lg font-semibold mb-1">Download Settings</h3>
          
          <label className="flex items-center justify-between p-3 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <span className="font-medium">Allow Download</span>
              <p className="text-sm text-gray-600">Let others download your status</p>
            </div>
            <div className="relative">
              
              <div 
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  allowDownload ? 'bg-green-500' : 'bg-gray-300'
                }`}
                onClick={() => setAllowDownload(!allowDownload)}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    allowDownload ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StatusSettings;