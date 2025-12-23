import React, { useMemo, useEffect, useState, useRef } from 'react';
import { ArrowLeft, Search, Trash2, MoreVertical, Eye, X } from 'lucide-react';

const statusViewers = {
  0:[
    { id: 1, name: 'Mom', avatar: '👩‍💼', viewedAt: '2:25 PM' },
    { id: 2, name: 'Boss - Mike', avatar: '👨‍💼', viewedAt: '2:17 PM' },
    { id: 3, name: 'Alex Johnson',  avatar: '🧑‍💻', viewedAt: '2:55 PM' },
    { id: 4, name: 'Emma Wilson', avatar: '👩‍🎨', viewedAt: '1:18 PM' },
    { id: 5, name: 'Tom Parker', avatar: '👨‍🎓', viewedAt: '3:09 PM' }
  ],
  1:[
    { id: 1, name: 'Mom', avatar: '👩‍💼', viewedAt: '2:25 PM' },
    { id: 2, name: 'Boss - Mike', avatar: '👨‍💼', viewedAt: '2:17 PM' },
    { id: 3, name: 'Alex Johnson',  avatar: '🧑‍💻', viewedAt: '2:55 PM' },
    { id: 4, name: 'Emma Wilson', avatar: '👩‍🎨', viewedAt: '1:18 PM' },
    { id: 5, name: 'Tom Parker', avatar: '👨‍🎓', viewedAt: '3:09 PM' }
  ],
  2:[
    { id: 1, name: 'Mom', avatar: '👩‍💼', viewedAt: '2:25 PM' },
    { id: 2, name: 'Boss - Mike', avatar: '👨‍💼', viewedAt: '2:17 PM' },
    { id: 3, name: 'Alex Johnson',  avatar: '🧑‍💻', viewedAt: '2:55 PM' },
    { id: 4, name: 'Emma Wilson', avatar: '👩‍🎨', viewedAt: '1:18 PM' },
    { id: 5, name: 'Tom Parker', avatar: '👨‍🎓', viewedAt: '3:09 PM' }
  ]
};

const MyStatusViewer = ({ myStatuses, onBack, onDeleteStatus, onViewerClick }) => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState({});
  const audioRefs = useRef({});
  const currentViewers = useMemo(() => {
    return statusViewers[currentStatusIndex] || [];
  }, [ currentStatusIndex]);

  const filteredViewers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return currentViewers;

    return currentViewers.filter((viewer) =>
      viewer.name?.toLowerCase().includes(query)
    );
  }, [searchQuery, currentViewers]);

  // Get duration based on status type
  const getStatusDuration = (status) => {
    if (!status) return 5000;
    if (status.type === 'audio' || status.type === 'video') {
      return 30000; // 30 seconds
    }
    return 5000; // 5 seconds for text, image, document
  };

  useEffect(() => {
    if (isPaused) return;
    
    const currentStatus = myStatuses[currentStatusIndex];
    if (!currentStatus) return;
    
    const duration = getStatusDuration(currentStatus);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (duration / 100);
        const newProgress = prev + increment;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    const timer = setTimeout(() => {
      if (currentStatusIndex < myStatuses.length - 1) {
        setCurrentStatusIndex(currentStatusIndex + 1);
      } else {
        onBack();
      }
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [currentStatusIndex, myStatuses, onBack, isPaused]);

  // Safety check for undefined myStatuses
  if (!myStatuses || myStatuses.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <p>No statuses available</p>
      </div>
    );
  }

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 60000);
    
    if (diff < 1) return 'now';
    if (diff < 60) return `${diff}m ago`;
    
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleStatusNavigation = (direction) => {
    if (direction === 'next' && currentStatusIndex < myStatuses.length - 1) {
      setCurrentStatusIndex(currentStatusIndex + 1);
    } else if (direction === 'prev' && currentStatusIndex > 0) {
      setCurrentStatusIndex(currentStatusIndex - 1);
    }
    setShowViewers(false);
    setSearchQuery('');
  };

  const handleDeleteStatus = () => {
    try {
      if (onDeleteStatus && currentStatusIndex >= 0 && currentStatusIndex < myStatuses.length) {
        onDeleteStatus(currentStatusIndex);
        setShowViewers(false);
        setIsPaused(false);
      }
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  const renderStatusContent = (status) => {
    if (!status) {
      return (
        <div className="flex items-center justify-center h-full bg-black text-white text-xl">
          Loading status...
        </div>
      );
    }

    switch (status.type) {
      case 'text':
        return (
          <div 
            className="flex items-center justify-center h-full p-8"
            style={{
              backgroundColor: status.backgroundImage ? 'transparent' : status.backgroundColor,
              backgroundImage: status.backgroundImage ? `url(${status.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {status.backgroundImage && (
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            )}
            <div 
              className="relative z-10 text-center"
              style={{
                fontFamily: status.fontFamily,
                fontSize: `${status.fontSize}px`,
                color: status.textColor,
                fontWeight: status.fontWeight,
                fontStyle: status.fontStyle
              }}
            >
              {status.text}
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="flex items-center justify-center h-full bg-black">
            <img 
              src={status.media} 
              alt="Status" 
              className="max-w-full max-h-full object-contain"
            />
            {status.caption && (
              <div className="absolute bottom-20 left-0 right-0 text-center text-white text-lg bg-black bg-opacity-50 p-2">
                {status.caption}
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="flex items-center justify-center h-full bg-black">
            <video 
              src={status.media} 
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay
              muted
            />
            {status.caption && (
              <div className="absolute bottom-20 left-0 right-0 text-center text-white text-lg bg-black bg-opacity-50 p-2">
                {status.caption}
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center justify-center h-full bg-black">
            <div className="text-center text-white">
              <div className="text-9xl mb-4">🎵</div>
              
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={() => {
                    const audio = audioRefs.current[currentStatusIndex];
                    if (audio) {
                      if (audioPlaying[currentStatusIndex]) {
                        audio.pause();
                        setAudioPlaying(prev => ({ ...prev, [currentStatusIndex]: false }));
                      } else {
                        audio.play();
                        setAudioPlaying(prev => ({ ...prev, [currentStatusIndex]: true }));
                      }
                    }
                  }}
                  className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30"
                >
                  {audioPlaying[currentStatusIndex] ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
              </div>

              <audio 
                ref={el => audioRefs.current[currentStatusIndex] = el}
                src={status.media}
                onPlay={() => setAudioPlaying(prev => ({ ...prev, [currentStatusIndex]: true }))}
                onPause={() => setAudioPlaying(prev => ({ ...prev, [currentStatusIndex]: false }))}
                onEnded={() => setAudioPlaying(prev => ({ ...prev, [currentStatusIndex]: false }))}
                className="hidden"
              />
            </div>
            {status.caption && (
              <div className="absolute bottom-20 left-0 right-0 text-center text-white text-lg bg-black bg-opacity-50 p-2">
                {status.caption}
              </div>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="flex items-center justify-center h-full bg-black">
            <div className="text-center text-white">
              <div className="text-9xl mb-4">📄</div>
              <button 
                onClick={(e) => {e.stopPropagation(); window.open(status.media, '_blank')}}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg relative z-50"
              >
                Open Doc
              </button>
            </div>
            {status.caption && (
              <div className="absolute bottom-20 left-0 right-0 text-center text-white text-lg bg-black bg-opacity-50 p-2">
                {status.caption}
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full bg-black text-white text-xl">
            Status content
          </div>
        );
    }
  };

  if (showViewers) {
    return (
      <div className="h-screen bg-black relative">
        {/* Main status content in background */}
        <div className="h-full relative opacity-30">
          {renderStatusContent(myStatuses[currentStatusIndex])}
        </div>
        
        {/* Bottom sliding panel with dark theme */}
        <div className="absolute bottom-0 left-0 right-0 bg-black rounded-t-lg shadow-lg z-40" style={{ height: '70%' }}>
          {/* Header */}
          <div className="bg-green-500 px-4 py-3 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center space-x-3 flex-1">
              {isSearchOpen ? (
                <input
                  type="text"
                  placeholder="Search viewers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1 bg-green-600 text-white rounded-md outline-none placeholder-white/70"
                  autoFocus
                />
              ) : (
                <span className="text-white font-medium">Seen by {currentViewers.length}</span>
              )}
              <button
                onClick={() => {
                  if (isSearchOpen) {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  } else {
                    setIsSearchOpen(true);
                  }
                }}
                className="text-white hover:text-black transition-colors"
              >
                <Search size={18} />
              </button>
              {/* Eye & Delete icons grouped with spacing */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowViewers(false);
                    setIsPaused(false);
                  }}
                  className="text-white hover:text-black transition-colors"
                >
                  <X size={18} />
                </button>

                <button
                  onClick={handleDeleteStatus}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="h-full overflow-y-auto pt-3 bg-black">
            {filteredViewers.length > 0 ? (
              filteredViewers.map((viewer) => (
                <div
                  key={viewer.id}
                  onClick={() => {
                    setShowViewers(false);
                    if (onViewerClick) {
                      onViewerClick(viewer);
                    }
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg mr-3">
                    {viewer.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-sm">{viewer.name}</h3>
                    <p className="text-xs text-gray-400">{viewer.viewedAt}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-4 text-gray-500 text-sm">
                {searchQuery ? 'No matching viewers found' : 'No viewers yet'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative">
      {/* Status Progress Indicators - thicker bars */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex space-x-1">
          {myStatuses.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-600 rounded overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ease-linear ${
                  index === currentStatusIndex ? 'bg-white' : index < currentStatusIndex ? 'bg-white' : 'bg-gray-600'
                }`}
                style={{
                  width: index === currentStatusIndex ? `${Math.min(progress, 100)}%` : index < currentStatusIndex ? '100%' : '0%'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header Controls */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="text-white">
            <p className="font-medium">My Status</p>
            <p className="text-sm opacity-75">
              {getRelativeTime(myStatuses[currentStatusIndex]?.timestamp)}
            </p>
          </div>
        </div>
        
        <button className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Navigation Areas */}
      <div className="absolute inset-0 flex">
        <button 
          className="flex-1 z-10"
          onClick={() => handleStatusNavigation('prev')}
          disabled={currentStatusIndex === 0}
        />
        <button 
          className="flex-1 z-10"
          onClick={() => handleStatusNavigation('next')}
          disabled={currentStatusIndex === myStatuses.length - 1}
        />
      </div>

      {/* Status Content */}
      <div className="h-full relative">
        {renderStatusContent(myStatuses[currentStatusIndex])}
      </div>

      {/* Bottom Eye Icon - smaller and centered */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <button 
          onClick={() => {
            setShowViewers(true);
            setIsPaused(true);
          }}
          className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 transition-all shadow-lg"
        >
          <Eye size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default MyStatusViewer;