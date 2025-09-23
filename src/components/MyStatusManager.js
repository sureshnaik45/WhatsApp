import React, { useEffect, useRef, useState } from 'react';
import { X, Music, Type, FileText, Image, Video, Bell, BellOff, Download, Music4Icon } from 'lucide-react';
import TextStatusEditor from './TextStatusEditor.js';
import DeviceImages from './DeviceImages.js';

const MyStatusManager = ({ onBack, onStatusSent, hasStatus = false, setUserHasStatus }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showTrimmer, setShowTrimmer] = useState(false);
  const audioInputRef = useRef(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(30);
  const fileInputRef = useRef(null); // (legacy kept, not used for primary picks)
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isAudioValid, setIsAudioValid] = useState(false);
  const audioRef = useRef(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [caption, setCaption] = useState('');
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrimOption, setShowTrimOption] = useState(false);
  const [isVideoValid, setIsVideoValid] = useState(false);

  // New refs for direct pickers
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const musicInputRef = audioInputRef; // reuse existing audioInputRef for music
  const docInputRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      const wasPlaying = !videoRef.current.paused;
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      
      if (wasPlaying && videoRef.current.paused) {
        videoRef.current.play();
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setSelectedOption('images');
    }
  };

  const handleDocSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedDoc(file);
      setSelectedOption('documents');
    }
  };

  const handleAudioSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedAudio(file);
      setSelectedOption('music');
    }
  };
    
  useEffect(() => {
    if (selectedAudio) {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        const duration = audio.duration;
        if (duration > 480) {
          alert('Audio longer than 8 minutes is not allowed.');
          setSelectedAudio(null);
          setIsAudioValid(false);
          setSelectedOption(null);
        } else {
          setIsAudioValid(true);
          setShowTrimOption(duration > 30);
        }
      };
      audio.src = URL.createObjectURL(selectedAudio);
    }
  }, [selectedAudio]);

  useEffect(() => {
    if (selectedVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = video.duration;
        if (duration > 180) {
          alert('Video longer than 3 minutes is not allowed.');
          setSelectedVideo(null);
          setIsVideoValid(false);
          setSelectedOption(null);
        } else {
          setIsVideoValid(true);
          setShowTrimOption(duration > 30);
        }
      };
      video.src = URL.createObjectURL(selectedVideo);
    }
  }, [selectedVideo]);

  // When user selects a video file (direct pick)
  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedVideo(file);
      setSelectedOption('video');
    }
  };
  
  const handleDocSendStatus = () => {
    if (selectedDoc) {
      const statusData = {
        type: 'document',
        name: selectedDoc.name,
        size: selectedDoc.size,
        caption: caption.trim()
      };
      
      if (onStatusSent) onStatusSent(statusData);
      setCaption('');
      setSelectedDoc(null);
      setSelectedOption(null);
      if (onBack) onBack();
    }
  };

  const handleAudioSendStatus = () => {
    if (selectedAudio) {
      const statusData = {
        type: 'audio',
        media: URL.createObjectURL(selectedAudio),
        caption: caption.trim()
      };
      
      if (onStatusSent) onStatusSent(statusData);
      setCaption('');
      setSelectedAudio(null);
      setSelectedOption(null);
      if (onBack) onBack();
    }
  };

  const handleVideoSendStatus = () => {
      if (selectedVideo) {
        const statusData = {
          type: 'video',
          media: URL.createObjectURL(selectedVideo),
          caption: caption.trim()
        };
        
        if (onStatusSent) onStatusSent(statusData);
        setCaption('');
        setSelectedVideo(null); // clear video (fix: clear video instead of doc)
        setSelectedOption(null);
        if (onBack) onBack();
      }
  };

  // This resets everything when going back
  const handleBack = () => {
    setSelectedVideo(null);
    setCaption('');
    setSelectedOption(null);
    setSelectedDoc(null);
    setSelectedImage(null);
    setSelectedOption(null);
  };

  const handleShare = () => {
    alert(`Status shared successfully!`);
    if (onBack) onBack();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showTrimmer && selectedMedia) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowTrimmer(false)} className="text-white">
              <X size={24} strokeWidth={3} />
            </button>
            <h1 className="text-lg font-medium">Trim {selectedMedia.type}</h1>
            <button onClick={handleShare} className="text-white font-medium">Share</button>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">
              {selectedMedia.type === 'music' ? '🎵' : selectedMedia.thumbnail}
            </div>
            <h3 className="font-medium text-lg">{selectedMedia.name}</h3>
            {selectedMedia.artist && <p className="text-gray-600">{selectedMedia.artist}</p>}
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Start: {formatTime(trimStart)}</span>
              <span className="text-sm text-gray-600">End: {formatTime(trimEnd)}</span>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Start Time</label>
              <input
                type="range"
                min="0"
                max={Math.max(0, (selectedMedia.duration || 60) - 30)}
                value={trimStart}
                onChange={(e) => {
                  const start = parseInt(e.target.value);
                  setTrimStart(start);
                  setTrimEnd(start + 30);
                }}
                className="w-full"
              />
            </div>

            <p className="text-center text-green-600 font-medium">
              Duration: 30 seconds
            </p>
          </div>       
        </div>
      </div>
    );
  }

  // MUSIC: show preview only when an audio is selected and validated
  if (selectedOption === 'music') {
    if (selectedAudio && isAudioValid) {
      return (
        <div className="h-screen w-full flex flex-col bg-black">
          
          <div className="flex items-center justify-between p-4">
            <button onClick={() => {
              setSelectedAudio(null);
              setCaption('');
              setSelectedOption(null);
            }} className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-start mt-48 justify-center flex-1 space-y-6 px-4">
            <audio
              ref={audioRef}
              src={URL.createObjectURL(selectedAudio)}
              controls
              controlsList="nodownload noplaybackrate nofullscreen novolume"
              className="w-full max-w-md"
            />

            <div className="w-full bg-black bg-opacity-80 text-white px-4 py-5 space-y-5 absolute bottom-0 left-0 right-0">
              <div className="flex items-center bg-gray-800 rounded-full px-4 py-3">
                <input
                  type="text"
                  placeholder="Add caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm 
                            outline-none border-none focus:outline-none focus:ring-0 
                            focus:border-none focus-visible:outline-none"              />               
                  <button
                    onClick={handleAudioSendStatus}
                    className="ml-3 text-green-500 hover:text-green-400"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                    </svg>
                  </button>               
              </div>
            </div>           
          </div>
        </div>
      );
    }
    return null;
  }

  if (selectedOption === 'video') {
    if (selectedVideo && isVideoValid) {
      return (
        <div className="h-screen w-full flex flex-col bg-black">
          <div className="flex items-center justify-between p-4">
            <button onClick={handleBack} className="text-white p-2">
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={() => { alert('Audio extracted from video')}}
              className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-full"
            > 
              <span>Extract</span>
              <Music4Icon size={18} />
              <Download size={18}/>
            </button>

            <button onClick={toggleMute} className="text-white p-2">
              {isMuted ? <BellOff className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
            </button>
          </div>
          <div className="flex items-start mt-8 justify-center flex-1">
            <div className="relative">
              <video
                ref={videoRef}
                src={URL.createObjectURL(selectedVideo)}
                muted={isMuted}
                className="max-w-96 max-h-96 rounded-lg"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg cursor-pointer"
                onClick={togglePlay}
              >
                <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          {/* Caption Input */}
          <div className="w-full bg-black bg-opacity-80 text-white px-4 py-5 space-y-5 absolute bottom-0 left-0 right-0">
            <div className="flex items-center bg-gray-800 rounded-full px-4 py-3">
              <input
                type="text"
                placeholder="Add caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none border-none focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none"
              />            
              <button
                onClick={handleVideoSendStatus}
                className="ml-3 text-green-500 hover:text-green-400"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>             
            </div>
            {showTrimOption && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => alert('Trim 30s segment')}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
                >
                  Trim to 30s
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      );
    }
    return null;
  }

  if (selectedOption === 'documents') {
    return (
      <div className="h-screen w-full flex flex-col bg-black">
        {/* Hidden File Input */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setSelectedDoc(file);
              setSelectedOption('documents');
            }
          }}
          className="hidden"
        />

        {/* Header */}
        {selectedDoc && (
          <div className="flex items-center justify-between p-4">
            <button onClick={handleBack} className="text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Document not selected - show browse button */}
        {!selectedDoc && (
          <div className="h-full flex flex-col bg-white">
            <div className="bg-green-600 text-white px-4 py-3">
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedOption(null)} className="text-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                </button>
                <h1 className="text-lg font-medium">Select Document</h1>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={() => docInputRef.current?.click()}
                className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-800">Browse</span>
              </button>
            </div>
          </div>
        )}

        {/* Document Preview + Caption */}
        {selectedDoc && (
          <div className="flex items-start mt-32 justify-center flex-1">
            
              <div className="text-center">
                <div className="text-9xl mb-1">📄</div>
                <h3 className="font-medium text-gray-300 text-lg mb-2">{selectedDoc.name}</h3>
                <p className="text-gray-300 text-sm">{(selectedDoc.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            

              {/* Caption Input */}
              <div className="w-full bg-black bg-opacity-80 text-white px-4 py-5 space-y-5 absolute bottom-0 left-0 right-0">
                <div className="flex items-center bg-gray-800 rounded-full px-4 py-3">
                  <input
                    type="text"
                    placeholder="Add caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm 
                              outline-none border-none focus:outline-none focus:ring-0 
                              focus:border-none focus-visible:outline-none"
                  />                  
                  <button
                    onClick={handleDocSendStatus}
                    className="ml-3 text-green-500 hover:text-green-400"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                    </svg>
                  </button>                  
                </div>
              </div>
          </div>
        )}
      </div>
    );
  }

  if (selectedOption === 'images') {
    if (selectedImage) {
      return <DeviceImages selectedImage={selectedImage} onBack={handleBack} onStatusSent={onStatusSent} />;
    }  
    return null;
  }

  if (selectedOption === "text") {
    return (
      <TextStatusEditor onBack={() => setSelectedOption(null)} onStatusSent={onStatusSent}/>
    )
  }

  // Main Add Status View (unchanged styling) - direct pickers instead of intermediate pages
  if (!hasStatus && selectedOption === null) {
    return (
      <div className="h-full flex flex-col bg-white">
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioSelect}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoSelect}
          className="hidden"
        />
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleDocSelect}
          className="hidden"
        />
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-white">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" strokeWidth="3" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h1 className="text-lg font-medium">Select Status</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start items-center pt-4 pb-6 px-6">
       
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">            
            <button
              onClick={() => setSelectedOption('text')}
              className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Type className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-800">Text</span>
            </button>
 
            <button 
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center space-x-4 p-4 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100"
            >
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-800">Images</span>
            </button>   
            <button 
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center space-x-4 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
            >
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-800">Videos</span>
            </button>                                
            <button 
              onClick={() => musicInputRef.current?.click()}
              className="flex items-center space-x-4 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-800">Music</span>
            </button>                                  
          </div>
          <div className="grid grid-cols-1 mt-4 gap-4 w-full max-w-sm">
            <button 
              onClick={() => docInputRef.current?.click()}
              className="flex items-center  space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-800">Documents</span>
            </button>
          </div>

        </div>
      </div>
    );
  }
  return null;
};

export default MyStatusManager;
