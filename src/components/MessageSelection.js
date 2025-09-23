import React, { useEffect, useRef, useState } from 'react';
import { CornerUpLeft, Star, ArrowLeft, Pin, AlertCircle, Copy, Trash2, Forward, PinOff, StarOff } from 'lucide-react';

const MessageSelection = ({
  selectedMessages,
  onBack,
  onStar,
  onPin,
  onDelete,
  onForward,
  onCopy,
  onInfo,
  onReply,
  getStarState,
  getPinState
}) => {
  const [showPinOptions, setShowPinOptions] = useState(false);
  const pinOptionsRef = useRef(null);

  const isSingleSelected = selectedMessages.length === 1;

  // Get star and pin states
  const starState = getStarState(selectedMessages);
  const pinState = getPinState(selectedMessages);

  const handleStarClick = () => {
    if (onStar) {
      onStar(selectedMessages);
      onBack(); // Close selection UI after operation
    }
  };

  const handlePinClick = (duration) => {
    if (onPin) {
      onPin(selectedMessages, duration);
      setShowPinOptions(false);
      onBack(); // Close selection UI after operation
    }
  };

  const handleCopyClick = () => {
    if (onCopy) {
      onCopy(selectedMessages);
      onBack(); // Close selection UI after operation
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(selectedMessages);
      onBack(); // Close selection UI after operation
    }
  };

  const handleForwardClick = () => {
    if (onForward) {
      onForward(selectedMessages);
      onBack(); // Close selection UI after operation
    }
  };

  const handleReplyClick = () => {
    if (onReply) {
      onReply(selectedMessages);
      onBack(); // Close selection UI after operation
    }
  };

  const handleInfoClick = () => {
    if (onInfo) {
      onInfo(selectedMessages);
      onBack(); // Close selection UI after operation
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pinOptionsRef.current && !pinOptionsRef.current.contains(event.target)) {
        setShowPinOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-green-600 text-white px-5 py-3">
      <div className="flex items-center justify-between">
        {/* Left side: Back + Count */}
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <span className="text-lg font-medium">{selectedMessages.length}</span>
        </div>

        {/* Right side: Action icons */}
        <div className="flex items-center space-x-2">
          {/* Reply - only for single selection */}
          {isSingleSelected && (
            <button
              onClick={handleReplyClick}
              className="text-white hover:bg-green-700 p-2 rounded flex items-center justify-center"
            >
              <CornerUpLeft size={20} strokeWidth={2} />
            </button>
          )}

          {/* Star - only show if not mixed state */}
          {starState !== 'mixed' && (
            <button
              onClick={handleStarClick}
              className="text-white hover:bg-green-700 p-2 rounded flex items-center justify-center"
            >
              {starState === 'canUnstar' ? (
                <StarOff size={20} strokeWidth={2} />
              ) : (
                <Star size={20} strokeWidth={2} />
              )}
            </button>
          )}

          {/* Pin - only show if not mixed state */}         
          {pinState !== 'mixed' && (
            <div ref={pinOptionsRef} className="relative">
              <button 
                className="text-white hover:bg-green-700 p-2 rounded flex items-center justify-center" 
                onClick={(e) => {
                  e.stopPropagation();
                  // If the message can be unpinned, unpin it immediately.
                  if (pinState === 'canUnpin') {
                    handlePinClick(null); // Pass null for duration to signify unpin
                  } else {
                  // Otherwise, show the duration options.
                    setShowPinOptions(!showPinOptions);
                  }
                }}
              >
                {/* Conditionally render Pin or PinOff icon */}
                {pinState === 'canUnpin' ? (
                  <PinOff size={20} strokeWidth={2} />
                ) : (
                  <Pin size={20} strokeWidth={2} />
                )}
              </button>
              
              {showPinOptions && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border py-2 w-48 z-50">
                  <div className="px-3 py-1 text-xs text-gray-500 font-medium border-b border-gray-100 mb-1">Pin for</div>
                  {[
                    { label: '24 hours', value: '24h' },
                    { label: '1 week', value: '1w' },
                    { label: '1 month', value: '1m' },
                    { label: 'Unlimited', value: 'unlimited' }
                  ].map(option => (
                    <button
                      key={option.value}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-gray-700"
                      onClick={() => handlePinClick(option.label)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info - only for single selection */}
          {isSingleSelected && (
            <button
              onClick={handleInfoClick}
              className="text-white hover:bg-green-700 p-2 rounded flex items-center justify-center"
            >
              <AlertCircle size={20} strokeWidth={2} />
            </button>
          )}

          {/* Copy */}
          <button
            onClick={handleCopyClick}
            className="text-white hover:bg-green-700 p-2 rounded flex items-center justify-center"
          >
            <Copy size={20} strokeWidth={2} />
          </button>

          {/* Delete */}
          <button
            onClick={handleDeleteClick}
            className="text-white hover:bg-green-700 p-2 rounded flex items-center justify-center"
          >
            <Trash2 size={20} strokeWidth={2} />
          </button>

          {/* Forward */}
          <button
            onClick={handleForwardClick}
            className="text-white hover:bg-green-700 p-2 rounded flex items-center justify-center"
          >
            <Forward size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageSelection;