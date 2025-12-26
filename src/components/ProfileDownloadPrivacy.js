import React, { useState } from 'react';

const ProfileDownloadPrivacy = ({ onBack }) => {
  const [downloadPrivacy, setDownloadPrivacy] = useState('everyone');

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-lg font-medium">Profile Download Privacy</h1>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold mb-1">Who can download my profile?</h3>
          
          <div className="space-y-1">
            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="downloadPrivacy"
                value="everyone"
                checked={downloadPrivacy === 'everyone'}
                onChange={(e) => setDownloadPrivacy(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">Everyone</span>
                <p className="text-sm text-gray-600">Allow everyone to download</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="downloadPrivacy"
                value="contacts"
                checked={downloadPrivacy === 'contacts'}
                onChange={(e) => setDownloadPrivacy(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">My Contacts</span>
                <p className="text-sm text-gray-600">Allow contacts only</p>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="downloadPrivacy"
                value="mycontactsexcept"
                checked={downloadPrivacy === 'mycontactsexcept'}
                onChange={(e) => setDownloadPrivacy(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">Selected Contacts</span>
                <p className="text-sm text-gray-600">Choose specific contacts</p>
              </div>
            </label>
            <label className="flex items-center space-x-3 p-3 pb-2 pt-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="downloadPrivacy"
                value="nobody"
                checked={downloadPrivacy === 'nobody'}
                onChange={(e) => setDownloadPrivacy(e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <div>
                <span className="font-medium">Nobody</span>
                <p className="text-sm text-gray-600">Disable profile downloading</p>
              </div>
            </label>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default ProfileDownloadPrivacy;