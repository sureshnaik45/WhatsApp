import React, { useState } from 'react';
import { Search, Eye } from 'lucide-react';

const StatusViews = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const viewers = [
    { id: 1, name: 'Mom', avatar: '👩‍💼', seenAt: '2:45 PM' },
    { id: 2, name: 'Dad', avatar: '👨‍🦳', seenAt: '2:30 PM' },
    { id: 3, name: 'Alex Johnson', avatar: '🧑‍💻', seenAt: '1:55 PM' },
    { id: 4, name: 'Emma Wilson', avatar: '👩‍🎨', seenAt: '1:20 PM' },
    { id: 5, name: 'Boss - Mike', avatar: '👨‍💼', seenAt: '12:45 PM' },
    { id: 6, name: 'Tom Parker', avatar: '👨‍🎓', seenAt: '11:30 AM' }
  ];

  const filteredViewers = viewers.filter(viewer =>
    viewer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="flex-1">
            <h1 className="text-lg font-medium">Status Views</h1>
            <p className="text-sm text-green-100">{viewers.length} views</p>
          </div>
          <Search className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search viewers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Viewers List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2 mb-3">
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {filteredViewers.length} of {viewers.length} viewers
            </span>
          </div>
        </div>

        {filteredViewers.length > 0 ? (
          filteredViewers.map(viewer => (
            <div key={viewer.id} className="flex items-center px-4 py-3 hover:bg-gray-50">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">
                {viewer.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{viewer.name}</h3>
                <p className="text-sm text-gray-600">Seen at {viewer.seenAt}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No viewers found for "{searchQuery}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusViews;