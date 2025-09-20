import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { statusData } from '../data/status.js';

const StatusSearch = ({ onBack, onStatusClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStatuses = statusData.filter(status =>
    status.name.toLowerCase().includes(searchQuery.toLowerCase()) && !status.isMyStatus
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search Header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search status updates..."
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
              <span className="text-sm text-gray-600">All Status Updates</span>
            </div>
            {statusData.filter(status => !status.isMyStatus).map(status => (
              <div
                key={status.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onStatusClick(status)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 border-2 ${
                  status.viewed ? 'border-gray-300' : 'border-green-500'
                }`}>
                  {status.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{status.name}</h3>
                  <p className="text-sm text-gray-600">{status.time}</p>
                </div>
                {!status.viewed && (
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        ) : filteredStatuses.length > 0 ? (
          <div>
            <div className="px-4 py-2 bg-gray-50">
              <span className="text-sm text-gray-600">
                {filteredStatuses.length} status update{filteredStatuses.length !== 1 ? 's' : ''} found
              </span>
            </div>
            {filteredStatuses.map(status => (
              <div 
                key={status.id} 
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onStatusClick(status)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 border-2 ${
                  status.viewed ? 'border-gray-300' : 'border-green-500'
                }`}>
                  {status.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{status.name}</h3>
                  <p className="text-sm text-gray-600">{status.time}</p>
                </div>
                {!status.viewed && (
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Results Found</h3>
              <p>Try a different name or keyword</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusSearch;
