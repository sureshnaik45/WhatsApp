import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Calendar = ({ onBack, birthdays, setBirthdays, onDateClick, onAvatarClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showRemoveMenu, setShowRemoveMenu] = useState(null);
  const menuRef = useRef(null);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
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
    const month = currentDate.getMonth();
    return `${month}-${day}`;
  };
  
  const getBirthdaysForDay = (day) => {
    const dateKey = formatDateKey(day);
    return birthdays[dateKey] || [];
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowRemoveMenu(null);
      }
    };
    
    // Add event listener only when a menu is open
    if (showRemoveMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRemoveMenu]);
  
  const renderAvatarStack = (birthdayList, day) => {
    return (
      <div className="absolute -top-1 -right-1 flex">
        {birthdayList.slice(0, 2).map((person, index) => (
          <div
            key={person.id}
            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white border-2 border-white cursor-pointer"
            style={{ marginLeft: index > 0 ? '-8px' : '0', zIndex: birthdayList.length - index }}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Birthday person:', person.name);
            }}
          >
            {person.avatar}
          </div>
        ))}
        
        {/* Always show + icon for adding more birthdays */}
        <div
          className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white border-2 border-white cursor-pointer"
          style={{ marginLeft: birthdayList.length > 0 ? '-8px' : '0' }}
          onClick={(e) => {
            e.stopPropagation();
            onDateClick(formatDateKey(day));
          }}
        >
          <Plus size={12} />
        </div>
      </div>
    );
  };
  
  const days = getDaysInMonth(currentDate);
  
  return (
    <div className={`h-full flex flex-col bg-white`}>
      <div className="bg-green-600 text-white px-4 py-3"> 
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Calendar</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className={`text-sm font-medium mb-3 text-gray-500`}>
            ADD BIRTHDAY
          </h3>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateMonth(-1)}
            className={`p-2 rounded-full hover:bg-gray-100`}
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className={`text-lg font-semibold text-gray-600`}>
            {months[currentDate.getMonth()]}
          </h2>
          
          <button 
            onClick={() => navigateMonth(1)}
            className={`p-2 rounded-full hover:bg-gray-100`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className={`text-center text-xs font-medium py-2 text-gray-500`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const birthdayList = getBirthdaysForDay(day);
            const hasEvents = birthdayList.length > 0;
            
            return (
              <div
                key={index}
                className={`
                  relative aspect-square flex items-center justify-center text-sm cursor-pointer rounded-lg
                  ${!day ? 'invisible' : ''}
                  ${hasEvents ? 'bg-green-50' : ''}
                  ${hasEvents ? 'bg-green-50 hover:bg-gray-100' : 'hover:bg-gray-100'}
                  ${'text-gray-900'}
                `}
                onClick={() => day && onDateClick(formatDateKey(day))}
              >
                {day}
                {renderAvatarStack(birthdayList, day)}
              </div>
            );
          })}
        </div>

        {/* Upcoming Birthdays */}
        <div className="mt-8">
          <h3 className={`text-sm font-medium mb-3 text-gray-500`}>
            THIS MONTH'S BIRTHDAYS
          </h3>      

          {Object.entries(birthdays)
            .filter(([dateKey]) => {
              const [month] = dateKey.split('-').map(Number);
              return month === currentDate.getMonth(); // Remove year check
            })
            .sort(([a], [b]) => {
              const dayA = parseInt(a.split('-')[1]); // Change index to 1 for day
              const dayB = parseInt(b.split('-')[1]);
              return dayA - dayB;
            })
            .map(([dateKey, birthdayList]) => {
              const day = parseInt(dateKey.split('-')[1]); // Change index to 1
              return birthdayList.map((person, index) => (
                <div
                  key={`${dateKey}-${person.id}`}
                  className="relative flex items-center p-3 rounded-lg cursor-pointer mb-2 hover:bg-gray-50 bg-gray-50"
                  onClick={() => {
                    // Navigate to chat with this person
                    if (onAvatarClick) {
                      onAvatarClick(person);
                    }
                  }}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">
                    {person.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {months[currentDate.getMonth()]} {day}
                    </p>
                  </div>
                  {/* Three dots menu */}
                  
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRemoveMenu(prev => 
                          prev?.personId === person.id ? null : { dateKey, personId: person.id }
                        );
                      }}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      ⋯
                    </button>
                  
                  {showRemoveMenu?.personId === person.id && (
            <div ref={menuRef} className="absolute top-0 right-0 pt-2 bg-white rounded-lg shadow-xl border p-1 z-50">
              <button 
                className="w-full text-left px-3 py-2  text-red-600"
                onClick={(e) => {
                  // Remove birthday
                  e.stopPropagation();
                  setBirthdays(currentBirthdays => {
                    const updatedList = currentBirthdays[dateKey].filter(p => p.id !== person.id);
                    const newBirthdays = { ...currentBirthdays };
                    if (updatedList.length > 0) {
                      newBirthdays[dateKey] = updatedList;
                    } else {
                      delete newBirthdays[dateKey]; // Remove the date key if no birthdays are left on that day
                    }
                    return newBirthdays;
                  });
                  setShowRemoveMenu(null);
                }}
              >
                Remove Birthday
              </button>
            </div>
          )}
          
                </div>
              ));
            })
          }

          
          {Object.entries(birthdays).filter(([dateKey]) => {
            const [month] = dateKey.split('-').map(Number);
            return month === currentDate.getMonth();
          }).length === 0 && (
            <p className={`text-sm text-gray-500 mt-2`}>
              No birthdays this month
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;