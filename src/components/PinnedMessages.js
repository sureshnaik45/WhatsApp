import React from 'react';
import { ArrowLeft, Pin } from 'lucide-react';

const PinnedMessages = ({ onBack, pinnedMessages, onMessageClick }) => {
  
  return (
    <div className={`h-full flex flex-col 'bg-white`}>
      {/* Header - Always green */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Pinned Messages</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {pinnedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <Pin size={64} className="text-gray-400 mb-4" />
            <h3 className={`text-lg font-medium mb-2 text-gray-900`}>
              No pinned messages
            </h3>
            <p className={`text-sm text-center text-gray-500 `}>
              Tap and hold on any message to pin it, so you can quickly access it later.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {pinnedMessages.map((item, index) => (
              <div
                key={`${item.chatName}-${item.message.id}-${index}`}
                className={`p-4 cursor-pointer border-b hover:bg-gray-50 border-gray-200`}
                onClick={() => onMessageClick(item.chatName, item.message)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                    {item.chatAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium text-gray-900`}>
                        {item.chatName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs text-gray-500`}>
                          {item.message.time}
                        </span>
                      </div>
                    </div>
                    <div className={`text-sm text-gray-700`}>
                      {item.message.fromSelf ? 'You: ' : ''}
                      {item.message.text}
                    </div>
                    {item.message.file && (
                      <div className="mt-2">
                        <div className={`text-xs text-gray-500`}>
                          📎 {item.message.fileKind || 'Attachment'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PinnedMessages;