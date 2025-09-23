import React, { useState,  useEffect, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Edit3, X, Trash2, MoreVertical } from 'lucide-react';

const Calendar = ({ onBack, birthdays, setBirthdays, userPhoto, onAvatarClick, onOpenSettings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePopup, setShowDatePopup] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [viewingNote, setViewingNote] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) { days.push(null); }
    for (let day = 1; day <= daysInMonth; day++) { days.push(day); }
    return days;
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  const formatDateKey = (day) => {
    if (!day) return null;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return `${year}-${month}-${day}`;
  };
  
  const getEventsForDay = (day) => {
    const dateKey = formatDateKey(day);
    return birthdays[dateKey] || [];
  };

  const handleSetMyBirthday = () => {
    const dateKey = formatDateKey(showDatePopup);
    const existingUserBirthdayKey = Object.keys(birthdays).find(key => 
      birthdays[key].some(person => person.id === 'user' && person.type === 'birthday')
    );
    
    let newBirthdays = { ...birthdays };

    if (existingUserBirthdayKey) {
      newBirthdays[existingUserBirthdayKey] = newBirthdays[existingUserBirthdayKey].filter(person => !(person.id === 'user' && person.type === 'birthday'));
      if (newBirthdays[existingUserBirthdayKey].length === 0) {
        delete newBirthdays[existingUserBirthdayKey];
      }
    }
    
    newBirthdays[dateKey] = [...(newBirthdays[dateKey] || []), { 
        id: 'user', 
        name: 'You', 
        avatar: userPhoto,
        type: 'birthday'
    }];
    
    setBirthdays(newBirthdays);
    setShowDatePopup(null);
  };

  const handleAddNote = () => {
    if (noteText.trim() === '') return;

    const dateKey = formatDateKey(showDatePopup);
    const newNote = {
      id: `note-${Date.now()}`,
      name: noteText,
      author: 'You',
      avatar: userPhoto,
      type: 'note'
    };

    setBirthdays(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newNote]
    }));

    setShowDatePopup(null);
    setNoteText('');
  };

  const handleDeleteNote = (noteId) => {
    let newBirthdays = { ...birthdays };
    let noteFoundAndDeleted = false;

    // Find the note across all dates and remove it
    for (const dateKey in newBirthdays) {
      const originalLength = newBirthdays[dateKey].length;
      newBirthdays[dateKey] = newBirthdays[dateKey].filter(event => event.id !== noteId);
      
      // If an item was removed, mark it and check if the date array is now empty
      if (newBirthdays[dateKey].length < originalLength) {
        noteFoundAndDeleted = true;
        if (newBirthdays[dateKey].length === 0) {
          delete newBirthdays[dateKey];
        }
        break; // Exit loop once note is found and deleted
      }
    }

    if (noteFoundAndDeleted) {
      setBirthdays(newBirthdays);
    }
    setViewingNote(null); // Close the popup
  };

  const userBirthdayExists = Object.values(birthdays).flat().some(p => p.id === 'user' && p.type === 'birthday');
  
  const renderAvatarStack = (eventList, position) => {
    const filteredEvents = eventList.filter(event => event.type === position);

    if (filteredEvents.length === 0) return null;

    const placementClass = position === 'birthday' ? 'top-1 left-1' : 'bottom-1 right-1';
      
    return (
      <div className={`absolute ${placementClass} flex`}>
        {filteredEvents.slice(0, 2).map((event, index) => (
          <div
            key={event.id}
            className={`relative w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer overflow-hidden ${event.type === 'note' ? 'bg-gray-200' : 'bg-gray-200'}`}
            style={{ marginLeft: index > 0 ? '-10px' : '0', zIndex: eventList.length - index }}
            onClick={(e) => {
              e.stopPropagation();
              if (event.type === 'birthday' && onAvatarClick) {
                onAvatarClick(event);
              }
              if (event.type === 'note') {
                setViewingNote(event);
              }
            }}
          >
            {typeof event.avatar === 'string' && event.avatar.length > 5 ? (
              <img src={event.avatar} alt={event.name} className="w-full h-full object-cover" />
            ) : (
              <span className={event.type === 'note' ? 'text-white' : ''}>{event.avatar}</span>
            )}

            {event.type === 'note' && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-px shadow">
                <Edit3 size={12} className="text-red-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const days = getDaysInMonth(currentDate);
  
  return (
    <div className={`h-full flex flex-col bg-white`}>
      <div className="bg-green-600 text-white px-4 py-3"> 
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-white"><ArrowLeft size={24} /></button>
            <h1 className="text-lg font-medium">Calendar</h1>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-white p-2 rounded-full hover:bg-black/10"
            >
              <MoreVertical size={20} />
            </button>
            
            {showMenu && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-gray-800 text-white rounded-md shadow-lg z-20">
                <button
                  className="w-full text-left px-4 py-3  text-sm"
                  onClick={() => {
                    onOpenSettings();
                    setShowMenu(false);
                  }}
                >
                  Calendar Privacy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateMonth(-1)} 
            disabled={currentDate.getMonth() === 0}
            className={`p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className={`text-lg font-semibold text-gray-600`}>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button 
            onClick={() => navigateMonth(1)} 
            disabled={currentDate.getMonth() === 11}
            className={`p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => <div key={day} className={`text-center text-xs font-medium py-2 text-gray-500`}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const eventList = getEventsForDay(day);
            return (
              <div
                key={index}
                className={`relative aspect-square flex items-start justify-end p-1 text-sm cursor-pointer rounded-lg border border-gray-200 ${!day ? 'invisible' : ''} hover:bg-gray-100 transition-colors`}
                onClick={() => day && setShowDatePopup(day)}
              >
                <span>{day}</span>
                {renderAvatarStack(eventList, 'birthday')}
                {renderAvatarStack(eventList, 'note')}
              </div>
            );
          })}
        </div>
      </div>

      {showDatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDatePopup(null)}>
          <div className="relative bg-white rounded-lg w-80 shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowDatePopup(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            <h3 className="font-semibold text-center mb-4">{months[currentDate.getMonth()]} {showDatePopup}, {currentDate.getFullYear()}</h3>
            <div className="space-y-3">
              <button onClick={handleSetMyBirthday} className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">{userBirthdayExists ? 'Update your birthday' : 'Set your birthday'}</button>
              <div className="text-sm">
                <p className="font-medium text-gray-700 mb-2">Something special today?</p>
                <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} maxLength="50" placeholder="Max 50 characters..." className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"/>
                <button onClick={handleAddNote} className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600">Add Note</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setViewingNote(null)}>
          <div className="relative bg-white rounded-lg w-80 shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewingNote(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X size={20}/></button>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                {typeof viewingNote.avatar === 'string' && viewingNote.avatar.length > 5 ? (
                  <img src={viewingNote.avatar} alt={viewingNote.author} className="w-full h-full object-cover" />
                ) : (
                  viewingNote.avatar
                )}
              </div>
              <div>
                <p className="font-semibold">{viewingNote.author}</p>
                <p className="text-gray-700">{viewingNote.name}</p>
              </div>
            </div>
            {/* Delete button only shows if you are the author */}
            {viewingNote.author === 'You' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDeleteNote(viewingNote.id)}
                  className="w-full flex items-center justify-center space-x-2 px-2 py-3 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;