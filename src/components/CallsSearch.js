import React, { useState } from 'react';
import CallItem from './CallItem.js';
import { callsData } from '../data/calls.js';

const CallsSearch = ({ onBack, onMakeCall }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCalls = callsData.filter(call =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white hover:bg-green-700 p-1 rounded">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search calls..."
              className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {searchQuery.trim() === '' ? (
          <div>
            <div className="px-4 py-2 bg-gray-50">
              <span className="text-sm text-gray-600">All Calls</span>
            </div>
            {callsData.map(call => (
              <CallItem key={call.id} call={call} onMakeCall={onMakeCall} />
            ))}
          </div>
        ) : filteredCalls.length > 0 ? (
          <div>
            <div className="px-4 py-2 bg-gray-50">
              <span className="text-sm text-gray-600">
                {filteredCalls.length} call{filteredCalls.length !== 1 ? 's' : ''} found
              </span>
            </div>
            {filteredCalls.map(call => (
              <CallItem key={call.id} call={call} onMakeCall={onMakeCall} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Results Found</h3>
              <p>Try a different name</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallsSearch;