import React from 'react';

const CallItem = ({ call, onMakeCall }) => {
  const getCallTypeIndicator = (type, duration) => {
    // Missed calls
    if (duration === null) {
      if (type === 'video') {
        return (
          <button 
            onClick={() => onMakeCall(call, 'video')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
        );
      } else {
        return (
          <button 
            onClick={() => onMakeCall(call, 'audio')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </button>
        );
      }
    }

    // Completed calls
    if (type === 'video') {
      return (
        <button 
          onClick={() => onMakeCall(call, 'video')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </button>
      );
    } else {
      return (
        <button 
          onClick={() => onMakeCall(call, 'audio')}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </button>
      );
    }
  };

  return (
    <div className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">
        {call.avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-medium text-gray-900">{call.name}</h3>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">{call.time}</p>
            {call.duration && (
              <>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-gray-500">{call.duration}</p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="ml-3">
        {getCallTypeIndicator(call.type, call.duration)}
      </div>
    </div>
  );
};

export default CallItem;