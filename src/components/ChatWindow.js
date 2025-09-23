import React, { useEffect, useRef, useState } from 'react';
import { Plus, Phone, Video, ArrowLeft, MoreVertical, Pin, Search, X,
         Camera, Image, FileText, User, MapPin, Music, EyeOff, Timer, ChevronDown,
        StarOff, PinOff, CornerUpLeft, Star, AlertCircle, Copy, Trash2, Forward} from 'lucide-react';         
import MessageSelection from './MessageSelection.js';
import { groupMessages } from '../data/chats.js';
import TimerMessage from './TimerMessage.js';
import HideFromMessage from './HideFromMessage.js';

const ChatWindow = ({ chat, onBack, onHeaderClick, onAvatarClick, onMakeCall, onUpdateGlobalStarred, onUpdateGlobalPinned }) => {
  // Sample contacts for forwarding
  const [contacts] = useState([
    { id: 1, name: 'Alice Johnson', avatar: '👩' },
    { id: 2, name: 'Bob Smith', avatar: '👨' },
    { id: 3, name: 'Carol Davis', avatar: '👩‍💼' },
    { id: 4, name: 'David Wilson', avatar: '👨‍💻' },
    { id: 5, name: 'Eva Brown', avatar: '👩‍🎨' }
  ]);

  // message list (sample)
  const [messages, setMessages] = useState(() => {
    const defaultMessages = [
      { id: 1, text: 'Hey! How are you?', time: '2:30 PM', fromSelf: false, starred: false, status: 'delivered', avatar: chat.avatar, reactions: {}, readAt: 'Yesterday, 2:42 PM', deliveredAt: 'Yesterday, 2:30 PM', sender: chat.isGroup ? 'Mom' : null },
      { id: 2, text: "I'm doing great, thanks!", time: '2:32 PM', fromSelf: true, starred: true, status: 'read', reactions: {}, readAt: 'Today, 2:33 PM', deliveredAt: 'Today, 2:32 PM' },
      { id: 3, text: 'What are your plans for the weekend?', time: '2:35 PM', fromSelf: false, starred: false, status: 'delivered', avatar: chat.avatar, reactions: {}, readAt: 'Yesterday, 2:46 PM', deliveredAt: 'Yesterday, 2:35 PM', sender: chat.isGroup ? 'Dad' : null },
      { id: 4, text: 'Thinking of going to the beach', time: '2:40 PM', fromSelf: true, starred: false, status: 'sent', reactions: {}, readAt: 'Today, 2:49 PM', deliveredAt: 'Today, 2:40 PM' }
    ];

    // Helper function to remove duplicates by message ID
    const getUniqueMessages = (messageArray) => {
      return Array.from(new Map(messageArray.map(item => [item.id, item])).values());
    };

    if (chat.isGroup && groupMessages[chat.id]) {
      const groupMsgs = groupMessages[chat.id].map(msg => ({
        id: msg.id,
        text: msg.message,
        time: msg.time,
        fromSelf: msg.sender === 'You',
        starred: false,
        status: msg.fromSelf ? 'read' : 'delivered',
        reactions: {},
        readAt: null,
        deliveredAt: msg.time,
        sender: msg.sender,
        senderAvatar: msg.avatar
      }));
      // Combine and then filter for uniqueness
      return getUniqueMessages([...groupMsgs, ...defaultMessages]);
    }
    
    if (chat.backupMessages && chat.backupMessages.length > 0) {
      // Combine and then filter for uniqueness
      return getUniqueMessages([...chat.backupMessages, ...defaultMessages]);
    }
    
    return defaultMessages;
  });

  // lastSeen is computed once so input typing / re-render doesn't randomize it
  const [lastSeen] = useState(() => {
    const lastSeenTimes = [
      'last seen today at 2:30 PM',
      'last seen yesterday at 8:45 PM',
      'last seen 2 days ago',
      'online',
      'last seen a week ago'
    ];
    return lastSeenTimes[Math.floor(Math.random() * lastSeenTimes.length)];
  });

  // input & UI states
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [previewMeta, setPreviewMeta] = useState(null);
  const [isPreviewFull, setIsPreviewFull] = useState(false);
  const [contactWarning, setContactWarning] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showStarredMessages, setShowStarredMessages] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardingMessages, setForwardingMessages] = useState([]);
  const [messageInfo, setMessageInfo] = useState(null);
  const [showSelectMessages, setShowSelectMessages] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  // pinned stack (most recent pinned first)
  const [pinnedStack, setPinnedStack] = useState([]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if a menu is open and the click was not on a menu or a chevron button
      if (showMessageMenu && !event.target.closest('.message-menu') && !event.target.closest('.chevron-button')) {
        setShowMessageMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMessageMenu]); // Rerun this effect only when showMessageMenu changes


  // UI helpers: context menu and reaction picker
  const [contextMenu, setContextMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // reply flow
  const [replyTo, setReplyTo] = useState(null);

  // refs
  const fileCameraRef = useRef(null);
  const fileGalleryRef = useRef(null);
  const fileDocRef = useRef(null);
  const fileAudioRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const longPressTimer = useRef(null);

  const [pinnedIndex, setPinnedIndex] = useState(0);
  const [fullscreenFile, setFullscreenFile] = useState(null);
  const [showReactionDetails, setShowReactionDetails] = useState(null);
  const [showTimerMessage, setShowTimerMessage] = useState(false);
  const [showHideFromMessage, setShowHideFromMessage] = useState(false);
  const [timerSettings, setTimerSettings] = useState(null);
  const [hideFromSettings, setHideFromSettings] = useState(null);

  useEffect(() => {
    if (pinnedStack.length > 0) {
      setPinnedIndex(0);
    }
  }, [pinnedStack]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handlePinnedClick = () => {
    const target = pinnedStack[pinnedIndex];
    if (target) {
      document.getElementById(`msg-${target.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setPinnedIndex((pinnedIndex + 1) % pinnedStack.length);
    }
  };

  const timeNow = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getSenderInfo = (msg) => {
    if (!chat.isGroup || msg.fromSelf) return null;
    
    // Use the sender and senderAvatar from the message if available
    if (msg.sender && msg.senderAvatar) {
      return {
        name: msg.sender,
        avatar: msg.senderAvatar
      };
    }
    
    // Fallback to default mapping
    const groupMembers = {
      'Mom': '👩‍💼',
      'Dad': '👨‍🦳', 
      'Sister': '👩‍🎓',
      'Uncle John': '👨‍🦲',
      'Sarah': '👩‍💼',
      'Mike': '👨‍💼',
      'David': '👨‍💻',
      'Alex': '🧑‍💻',
      'Emma': '👩‍🎨',
      'Tom': '👨‍🎓',
      'Lisa': '👩‍🔬',
      'Sam': '😎',
      'Dave': '💪',
      'Emily': '👱‍♀️',
      'Designer Jane': '👩‍🎨'
    };
    
    return {
      name: msg.sender || 'Unknown',
      avatar: groupMembers[msg.sender] || '👤'
    };
  };

  // scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, pinnedStack]);

  // auto-focus input when replyTo is set
  useEffect(() => {
    if (replyTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyTo]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  const removeMessagesByIds = (ids) => {
    setMessages(prev => prev.filter(m => !ids.includes(m.id)));
  };

  // Check if messages can be starred/unstarred together
  const getStarState = (messageIds) => {
    const selectedMsgs = messages.filter(m => messageIds.includes(m.id));
    const starredCount = selectedMsgs.filter(m => m.starred).length;
    
    if (starredCount === 0) return 'canStar'; // All unstarred
    if (starredCount === selectedMsgs.length) return 'canUnstar'; // All starred
    return 'mixed'; // Mixed state - don't show star icon
  };

  // Check if messages can be pinned together
  const getPinState = (messageIds) => {
    const selectedMsgs = messages.filter(m => messageIds.includes(m.id));
    const pinnedCount = selectedMsgs.filter(m => pinnedStack.some(p => p.id === m.id)).length;
    
    if (pinnedCount === 0) return 'canPin'; // All unpinned
    if (pinnedCount === selectedMsgs.length) return 'canUnpin'; // All pinned
    return 'mixed'; // Mixed state - don't show pin icon
  };

  const checkIfBirthday = () => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    if (chat.name === 'Mom' && todayKey === '2024-8-17') {
      return true;
    }
    return false;
  };

  const isBirthday = checkIfBirthday();

  if (showTimerMessage) {
    return (
      <TimerMessage
        onBack={() => setShowTimerMessage(false)}
        onSetTimer={(timerData) => {
          setTimerSettings(timerData);
          setShowTimerMessage(false);
          inputRef.current?.focus();
        }}
      />
    );
  }

  if (showHideFromMessage) {
    const getGroupMembers = (chatId, chatName) => {
      const groupMemberMap = {
        4: [ // Family Group
          { id: 1, name: 'Mom', avatar: '👩‍💼' },
          { id: 2, name: 'Dad', avatar: '👨‍🦳' },
          { id: 3, name: 'Sister', avatar: '👩‍🎓' },
          { id: 4, name: 'Uncle John', avatar: '👨‍🦲' }
        ],
        6: [ // Work Team
          { id: 1, name: 'Sarah', avatar: '👩‍💼' },
          { id: 2, name: 'Mike', avatar: '👨‍💼' },
          { id: 3, name: 'David', avatar: '👨‍💻' }
        ],
        8: [ // College Friends
          { id: 1, name: 'Alex', avatar: '🧑‍💻' },
          { id: 2, name: 'Emma', avatar: '👩‍🎨' },
          { id: 3, name: 'Tom', avatar: '👨‍🎓' },
          { id: 4, name: 'Lisa', avatar: '👩‍🔬' }
        ],
        19: [ // Project Phoenix
          { id: 1, name: 'Mike', avatar: '👨‍💼' },
          { id: 2, name: 'Designer Jane', avatar: '👩‍🎨' }
        ],
        20: [ // Gaming Squad
          { id: 1, name: 'Tom', avatar: '👨‍🎓' },
          { id: 2, name: 'Alex', avatar: '🧑‍💻' },
          { id: 3, name: 'Sam', avatar: '😎' }
        ],
        23: [ // Weekend Plans
          { id: 1, name: 'Sam', avatar: '😎' },
          { id: 2, name: 'Emily', avatar: '👱‍♀️' },
          { id: 3, name: 'Dave', avatar: '💪' }
        ]
      };

      return groupMemberMap[chatId] || [
        { id: 1, name: 'Member 1', avatar: '👤' },
        { id: 2, name: 'Member 2', avatar: '👤' }
      ];
    };

    const dynamicGroupMembers = getGroupMembers(chat.id, chat.name);

    return (
      <HideFromMessage
        onBack={() => setShowHideFromMessage(false)}
        onSetHideFrom={(selectedMembers) => {
          setHideFromSettings(selectedMembers);
          setShowHideFromMessage(false);
          inputRef.current?.focus();
        }}
        groupMembers={dynamicGroupMembers}
      />
    );
  }

  const handleToggleStar = (ids) => {
    const starState = getStarState(ids);
    if (starState === 'canStar') {
      setMessages(prev => prev.map(m => {
        if (ids.includes(m.id)) {
          const starredMessage = { ...m, starred: true };
          // Add to global starred messages
          if (onUpdateGlobalStarred) {
            onUpdateGlobalStarred({
              chatName: chat.name,
              chatAvatar: chat.avatar,
              message: starredMessage
            }, 'add');
          }
          return starredMessage;
        }
        return m;
      }));
    } else if (starState === 'canUnstar') {
      setMessages(prev => prev.map(m => {
        if (ids.includes(m.id)) {
          const unstarredMessage = { ...m, starred: false };
          // Remove from global starred messages
          if (onUpdateGlobalStarred) {
            onUpdateGlobalStarred({
              chatName: chat.name,
              chatAvatar: chat.avatar,
              message: unstarredMessage
            }, 'remove');
          }
          return unstarredMessage;
        }
        return m;
      }));
    }
    setSelectedMessages([]);
  };

  // handle pin - pushes messages to pinned stack

  const handlePin = (ids, durationLabel) => {
    const pinState = getPinState(ids);
    if (pinState === 'canPin') {
      const msgsToPin = messages.filter(m => ids.includes(m.id));
      const pinnedMsgs = msgsToPin.map(msg => ({ ...msg, pinAt: Date.now(), pinDuration: durationLabel }));
      setPinnedStack(prev => [...pinnedMsgs, ...prev]);
      setPinnedIndex(0); // Reset to show the newly pinned message first
      
      // Add to global pinned messages
      if (onUpdateGlobalPinned) {
        pinnedMsgs.forEach(msg => {
          onUpdateGlobalPinned({
            chatName: chat.name,
            chatAvatar: chat.avatar,
            message: msg
          }, 'add');
        });
      }
    } else if (pinState === 'canUnpin') {
      setPinnedStack(prev => {
        const unpinnedMsgs = prev.filter(p => ids.includes(p.id));
        // Remove from global pinned messages
        if (onUpdateGlobalPinned) {
          unpinnedMsgs.forEach(msg => {
            onUpdateGlobalPinned({
              chatName: chat.name,
              chatAvatar: chat.avatar,
              message: msg
            }, 'remove');
          });
        }
        const newStack = prev.filter(p => !ids.includes(p.id));
        if (newStack.length > 0) {
          setPinnedIndex(0); // Reset index when unpinning
        }
        return newStack;
      });
    }
    setSelectedMessages([]);
  };

  // copy messages
  const handleCopy = (ids) => {
    const text = ids.map(id => messages.find(m => m.id === id)?.text).join('\n');
    navigator.clipboard.writeText(text);
    setSelectedMessages([]);
  };

  // forward messages
  const handleForward = (ids) => {
    const msgsToForward = messages.filter(m => ids.includes(m.id));
    setForwardingMessages(msgsToForward);
    setShowForwardModal(true);
    setSelectedMessages([]);
  };

  // Execute forward to selected contacts
  const executeForward = (contactIds) => {
    // In a real app, you'd send these messages to the selected contacts
    alert(`Forwarded ${forwardingMessages.length} message(s) to ${contactIds.length} contact(s)`);
    setShowForwardModal(false);
    setForwardingMessages([]);
  };

  // delete messages
  const handleDelete = (ids) => {
    removeMessagesByIds(ids);
    setSelectedMessages([]);
  };

  // reply to message
  const handleReplyTo = (id) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    setReplyTo({ id: msg.id, text: msg.text, fromSelf: msg.fromSelf });
    setShowAttachments(false);
    setContextMenu(null);
    setSelectedMessages([]);
  };

  // Show message info
  const handleMessageInfo = (id) => {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    setMessageInfo(msg);
    setSelectedMessages([]);
  };

  const handleBackFromSelection = () => {
  // if any selection UI is active, clear it and stay in chat window
    if (selectedMessages.length > 0 || showSelectMessages) {
      setSelectedMessages([]);
      setShowSelectMessages(false);
    } else {
      // no selection active — perform the original back action (go to chat list)
      onBack && onBack();
    }
  };

  // ---------- attachment handling ----------
  const handleAttachmentClick = (label) => {
    setContextMenu(null);
    switch (label) {
      case 'Timer':
        setShowTimerMessage(true);
        setShowAttachments(false);
        break;
      case 'Hide From':
        if (chat.isGroup) {
          setShowHideFromMessage(true);
          setShowAttachments(false);
        }
        break;
      case 'Camera': fileCameraRef.current?.click(); break;
      case 'Gallery': fileGalleryRef.current?.click(); break;
      case 'Document': fileDocRef.current?.click(); break;
      case 'Audio': fileAudioRef.current?.click(); break;
      case 'Contact':
        setContactWarning(true);
        setMessage('⚠️ Contact sharing not implemented');
        setTimeout(() => {
          setContactWarning(false);
          setMessage('');
        }, 3000);
        setShowAttachments(false);
        break;
      case 'Location':
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            addMessage({
              id: Date.now(),
              text: `📍 ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
              time: timeNow(),
              fromSelf: true,
              starred: false,
              status: 'sent',
              reactions: {},
              readAt: null,
              deliveredAt: `Today, ${timeNow()}`
            });
          });
        } else {
          alert('Location not available');
        }
        setShowAttachments(false);
        break;
      default:
        setShowAttachments(false);
    }
  };

  // file input handler
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      e.target.value = '';
      return;
    }
    const kind = file.type.startsWith('image/') ? 'image'
      : file.type.startsWith('video/') ? 'video'
      : file.type.startsWith('audio/') ? 'audio'
      : 'file';
    const url = URL.createObjectURL(file);
    setPreviewMeta({ url, file, kind, name: file.name, size: file.size });
    setShowAttachments(false);
    e.target.value = '';
  };

  // ---------- send handler ----------
  const handleSend = () => {
    // Validation for timer and hideFrom
    if ((timerSettings || hideFromSettings) && !message.trim() && !previewMeta) {
      alert('Please enter a message or select a file before setting timer or hide from options');
      return;
    }

    if (!message.trim() && !previewMeta) return;

    const newMsg = {
      id: Date.now(),
      text: message.trim() || (previewMeta ? previewMeta.name || 'Attachment' : ''),
      file: previewMeta?.url || null,
      fileKind: previewMeta?.kind || null,
      time: timeNow(),
      fromSelf: true,
      starred: false,
      status: 'sent',
      reactions: {},
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text } : null,
      isScheduled: !!timerSettings,
      scheduledFor: timerSettings?.scheduledFor || null,
      hiddenFrom: hideFromSettings || [],
      readAt: null,
      deliveredAt: `Today, ${timeNow()}`
    };

    addMessage(newMsg);

    // Reset all states
    setMessage('');
    setReplyTo(null);
    setTimerSettings(null);
    setHideFromSettings(null);
    if (previewMeta) {
      setTimeout(() => {
        try { URL.revokeObjectURL(previewMeta.url); } catch(e){}
      }, 5000);
    }
    setPreviewMeta(null);
    setIsPreviewFull(false);
  };

  const handleTouchStartOnMessage = (msg) => {
    longPressTimer.current = setTimeout(() => {
      setSelectedMessages([msg.id]);
    }, 600);
  };

  const handleTouchEndOnMessage = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // render helpers
  const renderTicks = (status) => {
    switch (status) {
      case 'sent':
        return (<svg className="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg>);
      case 'delivered':
        return (<div className="flex"><svg className="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg><svg className="w-4 h-4 -ml-1 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg></div>);
      case 'read':
        return (<div className="flex"><svg className="w-4 h-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg><svg className="w-4 h-4 -ml-1 text-blue-700" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg></div>);
      default:
        return null;
    }
  };

  const applyContextAction = (action) => {
    if (!contextMenu) return;
    const id = contextMenu.msgId;
    switch (action) {
      case 'reply': handleReplyTo(id); break;
      case 'star': handleToggleStar([id]); break;
      case 'pin': handlePin([id], '24h'); break;
      case 'copy': handleCopy([id]); break;
      case 'forward': handleForward([id]); break;
      case 'delete': handleDelete([id]); break;
      case 'info': handleMessageInfo(id); break;
      default: break;
    }
    setContextMenu(null);
  };

  const starredMessages = messages.filter(m => m.starred);

  return (
    <div className="h-full flex flex-col relative">
     
      {/* Hidden file inputs */}
      <input ref={fileCameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input ref={fileGalleryRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
      <input ref={fileDocRef} type="file" accept="*/*" onChange={handleFileSelect} className="hidden" />
      <input ref={fileAudioRef} type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />

      {isBirthday && (
        <div className="text-center text-gray-600 mb-3 text-sm">
          <p className="inline-block bg-yellow-200 px-3 py-2 rounded-full text-xs">
            🎉 Today is {chat.name}'s birthday!
          </p>
        </div>
      )}      

      {/* Header or MessageSelection */}
      {selectedMessages.length > 0 ? (
        <MessageSelection
          selectedMessages={selectedMessages}
          onBack={handleBackFromSelection}
          onStar={(ids) => handleToggleStar(ids)}
          onPin={(ids, duration) => handlePin(ids, duration)}
          onDelete={(ids) => handleDelete(ids)}
          onForward={(ids) => handleForward(ids)}
          onCopy={(ids) => handleCopy(ids)}
          onReply={(ids) => handleReplyTo(ids[0])}
          onInfo={(ids) => handleMessageInfo(ids[0])}
          getStarState={getStarState}
          getPinState={getPinState}
        />
      ) : ( 
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleBackFromSelection(); }}
              className="text-white p-1"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div 
              onClick={() => onAvatarClick && onAvatarClick(chat)} 
              className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl cursor-pointer"
            >
              {chat.avatar}
            </div>

            <div className="flex-1 cursor-pointer" onClick={onHeaderClick}>
              <h1 className="text-lg font-medium leading-tight">{chat.name}</h1>
              <p className="text-sm text-green-100 leading-tight">{lastSeen}</p>
            </div>

            <div className="flex items-center space-x-1">
              {!chat.isGroup && (
                <>
                  <button 
                    className="p-2 hover:bg-green-700 rounded-full"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onMakeCall && onMakeCall(chat, 'audio');
                    }}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </button>
                  
                  <button 
                    className="p-2 hover:bg-green-700 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      onMakeCall && onMakeCall(chat, 'video');
                    }}
                  >
                    <Video className="w-5 h-5 text-white" />
                  </button>
                </>
              )}                          
              
              <div className="relative">
                <button 
                  className="p-2 hover:bg-green-700 rounded-full" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMoreMenu(!showMoreMenu);
                  }}
                >
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
                
                {showMoreMenu && (
                  <div className="absolute right-0 top-12 bg-gray-900 text-white rounded-lg shadow-lg p-2 w-48 z-50">
                    <button 
                      className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
                      onClick={() => {
                        setShowStarredMessages(true);
                        setShowMoreMenu(false);
                      }}
                    >
                      Starred messages
                    </button>
                    {/* Only show on desktop/laptop */}
                    {!isMobile && (
                      <button 
                        className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
                        onClick={() => {
                          setShowSelectMessages(true);
                          setShowMoreMenu(false);
                        }}
                      >
                        Select messages
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pinned message bar */}
      {pinnedStack.length > 0 && (
        <div className="sticky top-0 bg-gray-200 border-b px-4 py-2 text-sm cursor-pointer flex items-center" onClick={handlePinnedClick}>
          <Pin className="w-4 h-4 text-gray-600 mr-2" />
          <span className="text-gray-700">
            You pinned {pinnedStack.length} - {pinnedIndex + 1}: {pinnedStack[pinnedIndex].file ? (
              <>a file{pinnedStack[pinnedIndex].text && `: ${pinnedStack[pinnedIndex].text.slice(0,30)}`}</>
            ) : (
              <>{pinnedStack[pinnedIndex].text.slice(0,30)}{pinnedStack[pinnedIndex].text.length > 30 ? '...' : ''}</>
            )}
          </span>
        </div>
      )}

      {/* Messages list */}
      <div className="flex-1 bg-gray-100 p-4 pt-1 overflow-y-auto">
        <div className="text-center text-gray-500 text-sm mt-1">
          <p className="inline-block py-2 rounded-lg">01 January 2022</p>
        </div>

        <div className="text-center text-gray-600 mb-3 text-sm">
          <p className="inline-block bg-yellow-200 px-3 py-2 rounded-full text-xs">
            🔒 Messages are end-to-end encrypted
          </p>
        </div>

        <div className="space-y-3">
          {messages.map(msg => {
            return (
              <div
                key={msg.id}
                id={`msg-${msg.id}`}
                className={`flex ${
                  msg.type === 'radio' || msg.type === 'system' 
                    ? 'justify-center' 
                    : msg.fromSelf 
                      ? 'justify-end' 
                      : 'justify-start'
                } relative group`}
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                onMouseEnter={() => !isMobile && setHoveredMessageId(msg.id)}
                onMouseLeave={() => !isMobile && setHoveredMessageId(null)}
                onTouchStart={() => isMobile && handleTouchStartOnMessage(msg)}
                onTouchEnd={() => isMobile && handleTouchEndOnMessage()}
              >
                {/* ✅ Checkbox for select-messages mode */}
                {showSelectMessages && (
                  <div className={`flex items-center ${msg.fromSelf ? 'order-last ml-3' : 'order-first mr-3'}`}>
                    <div
                      className={`w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                        selectedMessages.includes(msg.id)
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white border-gray-400'
                      }`}
                      onClick={() => {
                        setSelectedMessages(prev =>
                          prev.includes(msg.id)
                            ? prev.filter(i => i !== msg.id)
                            : [...prev, msg.id]
                        );
                      }}
                    >
                      {selectedMessages.includes(msg.id) && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                 {chat.isGroup && !msg.fromSelf && getSenderInfo(msg) && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xl mr-2 self-start flex-shrink-0">
                    {getSenderInfo(msg).avatar}
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg cursor-pointer relative break-words ${
                    msg.fromSelf ? 'bg-green-500 text-white rounded-br-sm order-2' : 'bg-white text-gray-800 border rounded-bl-sm order-2'
                  }`}
                  onClick={() => {
                    if (selectedMessages.length > 0) {
                      setSelectedMessages(prev =>
                        prev.includes(msg.id) ? prev.filter(i => i !== msg.id) : [...prev, msg.id]
                      );
                    }
                  }}
                >
                  {chat.isGroup && !msg.fromSelf && getSenderInfo(msg) && (
                    <div className="flex items-center mb-2">
                      
                      <span className="text-xs font-semibold text-green-700">
                        {getSenderInfo(msg).name}
                      </span>
                    </div>
                  )}

                  {/* Reply snippet */}
                  {msg.replyTo && (
                    <div className="border-l-4 border-green-300 pl-2 mb-1 text-xs text-gray-700 bg-white/20 rounded p-1">
                      {msg.replyTo.text}
                    </div>
                  )}

                  {/* File attachments */}
                  {msg.file && msg.fileKind === 'image' && (
                    <img
                      src={msg.file}
                      alt="sent"
                      className="rounded mb-1 max-h-40 object-cover cursor-pointer"
                      onClick={() => setFullscreenFile({ url: msg.file, kind: 'image' })}
                    />
                  )}
                  {msg.file && msg.fileKind === 'video' && (
                    <video
                      src={msg.file}
                      controls
                      className="rounded mb-1 max-h-40 object-cover cursor-pointer"
                      onClick={() => setFullscreenFile({ url: msg.file, kind: 'video' })}
                    />
                  )}
                  {msg.file && msg.fileKind && !['image','video'].includes(msg.fileKind) && (
                    <div className="mb-1 text-sm bg-gray-100 rounded p-2 text-gray-700">
                      📎 {msg.text}
                    </div>
                  )}

                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                  <div className="flex items-center justify-end space-x-1 mt-1">
                    {msg.starred && <span className="text-yellow-400 text-xs">⭐</span>}
                    <span className="text-xs opacity-75">{msg.time}</span>
                    {msg.fromSelf && (
                      <div className="flex items-center space-x-1">
                        {renderTicks(msg.status)}
                        {msg.isScheduled && <Timer size={12} className="text-gray-500" title="Scheduled message" />}
                        {msg.hiddenFrom && msg.hiddenFrom.length > 0 && <EyeOff size={12} className="text-gray-500" title="Hidden from some members" />}
                      </div>
                    )}
                  </div>
                  {!showSelectMessages && !isMobile && (hoveredMessageId === msg.id || showMessageMenu === msg.id) && (
                    <div className="absolute top-1 right-1 z-20">
                      <div className="relative">
                        {/* Button to toggle the menu */}
                        <button
                          className="chevron-button p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMessageMenu(showMessageMenu === msg.id ? null : msg.id);
                          }}
                        >
                          <ChevronDown size={18} className="text-gray-800" />
                        </button>

                        {/* Conditionally render the menu itself */}
                        {showMessageMenu === msg.id && (
                          <div 
                            className={`message-menu absolute bg-gray-800 text-white rounded-lg shadow-xl py-2 w-48 z-50 top-full mt-2 ${
                              msg.fromSelf ? 'right-0' : 'left-0'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-3 text-sm" onClick={() => { handleReplyTo(msg.id); setShowMessageMenu(null); }}>
                              <CornerUpLeft size={16} /><span>Reply</span>
                            </button>
                            
                            {/* UPDATED Star/Unstar button */}
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-3 text-sm" onClick={() => { handleToggleStar([msg.id]); setShowMessageMenu(null); }}>
                              {msg.starred ? (
                                <StarOff size={16} />
                              ) : (
                                <Star size={16} />
                              )}
                              <span>{msg.starred ? 'Unstar' : 'Star'}</span>
                            </button>

                            {/* UPDATED Pin/Unpin button */}
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-3 text-sm" onClick={() => { handlePin([msg.id], 'unlimited'); setShowMessageMenu(null); }}>
                              {pinnedStack.some(p => p.id === msg.id) ? (
                                <PinOff size={16} />
                              ) : (
                                <Pin size={16} />
                              )}
                              <span>{pinnedStack.some(p => p.id === msg.id) ? 'Unpin' : 'Pin'}</span>
                            </button>

                            {/* ... other buttons ... */}
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-3 text-sm" onClick={() => { handleMessageInfo(msg.id); setShowMessageMenu(null); }}>
                              <AlertCircle size={16} /><span>Message info</span>
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-3 text-sm" onClick={() => { handleCopy([msg.id]); setShowMessageMenu(null); }}>
                              <Copy size={16} /><span>Copy</span>
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-3 text-sm" onClick={() => { handleForward([msg.id]); setShowMessageMenu(null); }}>
                              <Forward size={16} /><span>Forward</span>
                            </button>
                            <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 flex items-center space-x-3 text-sm" onClick={() => { handleDelete([msg.id]); setShowMessageMenu(null); }}>
                              <Trash2 size={16} /><span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {Object.keys(msg.reactions).length > 0 && (
                  <div className={`absolute ${msg.fromSelf ? '-bottom-6 right-2' : '-bottom-6 left-2'} flex space-x-1`}>
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        className="bg-white border-2 border-gray-200 rounded-full px-2 py-1 text-xs flex items-center space-x-1 shadow-sm hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReactionDetails({ 
                            messageId: msg.id, 
                            emoji, 
                            count,
                            reactions: msg.reactions 
                          });
                        }}
                      >
                        <span>{emoji}</span>
                        <span className="font-medium text-gray-600">{count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white shadow-lg rounded border"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => applyContextAction('reply')}>Reply</button>
          <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => applyContextAction('star')}>Star / Unstar</button>
          <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => applyContextAction('pin')}>Pin</button>
          <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => applyContextAction('copy')}>Copy</button>
          <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => applyContextAction('forward')}>Forward</button>
          <button className="block px-4 py-2 text-left hover:bg-gray-100 w-full" onClick={() => applyContextAction('info')}>Info</button>
          <button className="block px-4 py-2 text-left text-red-600 hover:bg-gray-100 w-full" onClick={() => applyContextAction('delete')}>Delete</button>
        </div>
      )}

      {/* Preview above input */}
      {previewMeta && (
        <div className="px-3 pb-2">
          <div className="inline-block bg-gray-200 rounded-lg p-2 relative">
            {previewMeta.kind === 'image' && <img src={previewMeta.url} alt="preview" className="max-h-24 rounded-md object-cover" />}
            {previewMeta.kind === 'video' && <video src={previewMeta.url} className="max-h-24 rounded-md object-cover" />}
            {previewMeta.kind === 'file' && (
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📄</div>
                <div>
                  <div className="font-medium text-sm">{previewMeta.name}</div>
                  <div className="text-xs text-gray-600">{(previewMeta.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
              </div>
            )}
            <button onClick={() => setPreviewMeta(null)} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">✕</button>
          </div>
        </div>
      )}

      {/* Attachments menu */}
      {showAttachments && (
        <div className="attachments-menu absolute bottom-20 left-4 bg-gray-900 text-white rounded-lg shadow-lg p-2 w-52 space-y-1 z-40">
          {[
            { icon: Camera, label: 'Camera' },
            { icon: Image, label: 'Gallery' },
            { icon: FileText, label: 'Document' },
            { icon: User, label: 'Contact' },
            { icon: MapPin, label: 'Location' },
            { icon: Music, label: 'Audio' },
            { icon: Timer, label: 'Timer' },
            ...(chat.isGroup ? [{ icon: EyeOff, label: 'Hide From' }] : [])
          ].map((opt, idx) => (
            <button 
              key={idx} 
              className="flex items-center w-full px-3 py-2 hover:bg-gray-800 rounded" 
              onClick={() => handleAttachmentClick(opt.label)}
            >
              <opt.icon size={20} className="mr-3" />
              <span className="text-sm">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Reply preview */}
      {replyTo && (
        <div className="bg-gray-100 px-4 py-2 border-t border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs text-green-600 font-medium">Replying to {replyTo.fromSelf ? 'yourself' : chat.name}</div>
              <div className="text-sm text-gray-700 truncate">{replyTo.text}</div>
            </div>
            <button onClick={() => setReplyTo(null)} className="text-gray-500 ml-2">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {showSelectMessages ? (
        <div className="bg-white p-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setShowSelectMessages(false);
                  setSelectedMessages([]);
                }}
              >
                <X size={18} />
              </button>
              <span className="font-medium">
                {selectedMessages.length} selected
              </span>
            </div>
          </div>
        </div>
      ) : (
          <div className="bg-white p-3 border-t">
            <div className="flex items-center relative">
              <button
                className="absolute left-3 text-gray-500 hover:text-gray-700 z-10"
                onClick={() => setShowAttachments(!showAttachments)}
              >
                <Plus className="w-6 h-6" />
              </button>

              <input
                ref={inputRef}
                type="text"
                placeholder="Type a message"
                className="w-full pl-12 pr-12 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 resize-none overflow-y-auto"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setShowAttachments(false)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />

              {(message.trim() || previewMeta) && (
                <button
                  onClick={handleSend}
                  className="absolute right-3 text-green-500"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
      )}

      {/* Forward Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-96 max-h-96 overflow-hidden">
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Forward to</h3>
              <button onClick={() => setShowForwardModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-3">
                Forward {forwardingMessages.length} message{forwardingMessages.length > 1 ? 's' : ''}
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {contacts.map(contact => (
                  <label key={contact.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <input type="radio" className="rounded" />
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
                      {contact.avatar}
                    </div>
                    <span className="text-sm">{contact.name}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button 
                  onClick={() => setShowForwardModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => executeForward([1, 2])} // Demo: forward to first 2 contacts
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {messageInfo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-80 overflow-hidden">
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Message Info</h3>
              <button onClick={() => setMessageInfo(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-700">Message</div>
                <div className="text-gray-600">{messageInfo.text}</div>
              </div>
              
              {chat.isGroup ? (
                  messageInfo.fromSelf ? (
                  // If you SENT the message, show the "Seen by" list
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Seen by 3</span>
                      <button className="text-gray-500"><Search size={16} /></button>
                    </div>
                    {[
                      { name: 'Mom', avatar: '👩‍💼', time: 'Today, 2:33 PM', seenTime:'Today, 2:40 PM' },
                      { name: 'Dad', avatar: '👨‍🦳', time: 'Today, 2:35 PM', seenTime:'Today, 2:48 PM' },
                      { name: 'Sister', avatar: '👩‍🎓', time: 'Today, 2:40 PM', seenTime:'Today, 2:52 PM' }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center py-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm mr-3">{member.avatar}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{member.name}</div>
                          <div className="text-xs text-gray-500">Delivered at {member.time}</div>
                          <div className="text-xs text-gray-500">Seen at {member.seenTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // If you RECEIVED the message, show its delivery status
                  <>
                    {messageInfo.deliveredAt && (
                      <div className="flex items-center space-x-2">
                        <div className="flex"><svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg><svg className="w-4 h-4 -ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg></div>
                        <div className="text-sm text-gray-600">Delivered {messageInfo.deliveredAt}</div>
                      </div>
                    )}
                    {messageInfo.readAt && (
                      <div className="flex items-center space-x-2">
                        <div className="flex"><svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg><svg className="w-4 h-4 -ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg></div>
                        <div className="text-sm text-gray-600">Read {messageInfo.readAt}</div>
                      </div>
                    )}      
                  </>
                )
              ) : (
                <>
                  {messageInfo.deliveredAt && (
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg>
                        <svg className="w-4 h-4 -ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        Delivered {messageInfo.deliveredAt}
                      </div>
                    </div>
                  )}
                  {messageInfo.readAt && (
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg>
                        <svg className="w-4 h-4 -ml-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z"/></svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        Read {messageInfo.readAt}
                      </div>
                    </div>
                  )}      
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showReactionDetails && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-80 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{showReactionDetails.emoji}</span>
                  <span className="font-medium">
                    {showReactionDetails.count} reaction{showReactionDetails.count > 1 ? 's' : ''}
                  </span>
                </div>
                <button onClick={() => setShowReactionDetails(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Reaction tabs */}
            <div className="flex border-b">
              <button 
                className="flex-1 px-4 py-2 text-sm font-medium bg-green-50 text-green-600 border-b-2 border-green-500"
              >
                All {Object.values(showReactionDetails.reactions || {}).reduce((a, b) => a + b, 0)}
              </button>
              {Object.entries(showReactionDetails.reactions || {}).map(([emoji, count]) => (
                <button 
                  key={emoji}
                  className="px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-1"
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>
            
            <div className="p-4 max-h-64 overflow-y-auto">
              {/* Mock reaction users */}
              {[
                { name: 'You', avatar: '👤', time: '2:30 PM', canRemove: true, emoji: showReactionDetails.emoji },
                { name: 'Mom', avatar: '👩‍💼', time: '2:32 PM', canRemove: false, emoji: showReactionDetails.emoji }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      {user.canRemove && (
                        <p 
                          className="text-sm text-blue-600 cursor-pointer hover:underline"
                          onClick={() => {
                            // Remove user's reaction
                            setMessages(prev => prev.map(m => {
                              if (m.id === showReactionDetails.messageId) {
                                const updatedReactions = { ...m.reactions };
                                if (updatedReactions[user.emoji] > 1) {
                                  updatedReactions[user.emoji] -= 1;
                                } else {
                                  delete updatedReactions[user.emoji];
                                }
                                return { ...m, reactions: updatedReactions };
                              }
                              return m;
                            }));
                            setShowReactionDetails(null);
                          }}
                        >
                          Tap to remove
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{user.emoji}</span>
                    <span className="text-sm text-gray-500">{user.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showStarredMessages && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-96 max-h-96 overflow-hidden rounded-lg shadow-xl">
            <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-medium">Starred Messages</h3>
              <button onClick={() => setShowStarredMessages(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-80">
              {starredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">⭐</div>
                  <div>No starred messages yet</div>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {starredMessages.map(msg => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setShowStarredMessages(false);
                        document.getElementById(`msg-${msg.id}`)?.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'center' 
                        });
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <div className="text-sm text-gray-800">{msg.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen File Overlay */}
      {fullscreenFile && (
        <div className="fixed inset-0 bg-black flex flex-col z-50">
          <div className="p-3 flex justify-between items-center text-white">
            <button onClick={() => setFullscreenFile(null)}>
              <ArrowLeft size={24} />
            </button>
            <span>{chat.name}</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {fullscreenFile.kind === "image" && (
              <img
                src={fullscreenFile.url}
                alt="full"
                className="max-h-full max-w-full object-contain"
              />
            )}
            {fullscreenFile.kind === "video" && (
              <video
                src={fullscreenFile.url}
                controls
                className="max-h-full max-w-full"
              />
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ChatWindow;