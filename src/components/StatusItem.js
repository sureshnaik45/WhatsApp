import React from 'react';
import { Plus } from 'lucide-react';

const StatusItem = ({ status, hasStatuses = false}) => {
  return (
    <div className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3 border-2 relative ${
        status.viewed ? 'border-gray-300' : 'border-green-500'
      }`}>
        {status.avatar}
        {status.isMyStatus && !hasStatuses && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <Plus size={10} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{status.name}</h3>
        <p className="text-sm text-gray-600">
          {status.isMyStatus ? (hasStatuses ? 'Tap to see status' : 'Tap to add status update') : status.time}
        </p>
      </div>
    </div>
  );
};

export default StatusItem;