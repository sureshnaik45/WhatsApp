import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const DateRangePicker = ({ onClose, onApply }) => {
  const [currentViewDate, setCurrentViewDate] = useState(new Date()); // For navigating months
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to get days array for the grid
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) { days.push(null); }
    for (let day = 1; day <= daysInMonth; day++) { 
      days.push(new Date(year, month, day)); 
    }
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentViewDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const handleDateClick = (date) => {
    if (isFutureDate(date)) return;

    // Reset logic if both are already selected or clicking backwards
    if ((startDate && endDate) || (startDate && date < startDate)) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    // Set Start Date
    if (!startDate) {
      setStartDate(date);
      return;
    }

    // Set End Date (must be after start date)
    if (date > startDate) {
      setEndDate(date);
    } else if (isSameDay(date, startDate)) {
      // If clicking the same day, toggle it off or keep as start?
      // Let's reset if clicking same day to allow re-selection
      setStartDate(date);
      setEndDate(null);
    }
  };

  const handleApply = () => {
    if (!startDate || !endDate) {
      alert('Please select a date range (Start and End date)');
      return;
    }
    onApply({ start: startDate, end: endDate, order: sortOrder });
  };

  const days = getDaysInMonth(currentViewDate);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-80 overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header - Matches your Calendar.js style */}
        <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <h3 className="font-medium flex items-center gap-2">
            <CalendarIcon size={20} /> Select Range
          </h3>
          <button onClick={onClose} className="hover:bg-green-700 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigateMonth(-1)} 
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-md font-semibold text-gray-800">
              {months[currentViewDate.getMonth()]} {currentViewDate.getFullYear()}
            </h2>
            <button 
              onClick={() => navigateMonth(1)} 
              disabled={currentViewDate.getMonth() === new Date().getMonth() && currentViewDate.getFullYear() === new Date().getFullYear()} // Disable next month if it's strictly future, though days handle disable too
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-xs font-medium py-1 text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-6">
            {days.map((date, index) => {
              if (!date) return <div key={index} />;
              
              const isDisabled = isFutureDate(date);
              const isStart = isSameDay(date, startDate);
              const isEnd = isSameDay(date, endDate);
              const isInRange = startDate && endDate && date > startDate && date < endDate;

              let bgClass = "bg-white hover:bg-gray-100 text-gray-700";
              
              if (isDisabled) {
                bgClass = "text-gray-300 cursor-not-allowed bg-gray-50";
              } else if (isStart || isEnd) {
                bgClass = "bg-green-500 text-white font-bold hover:bg-green-600";
              } else if (isInRange) {
                bgClass = "bg-green-100 text-green-800";
              }

              return (
                <div
                  key={index}
                  onClick={() => !isDisabled && handleDateClick(date)}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200 cursor-pointer ${bgClass}`}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>

          {/* Sort & Info */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Start: {startDate ? startDate.toLocaleDateString() : '-'}</span>
              <span className="text-gray-500">End: {endDate ? endDate.toLocaleDateString() : '-'}</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Sort Order</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  className={`flex-1 py-1.5 text-sm rounded-md transition-all ${
                    sortOrder === 'asc' 
                      ? 'bg-white text-green-600 shadow-sm font-medium' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSortOrder('asc')}
                >
                  Oldest First
                </button>
                <button
                  className={`flex-1 py-1.5 text-sm rounded-md transition-all ${
                    sortOrder === 'desc' 
                      ? 'bg-white text-green-600 shadow-sm font-medium' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setSortOrder('desc')}
                >
                  Newest First
                </button>
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors shadow-sm ${
                startDate && endDate 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Show Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;