import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

const TimerMessage = ({ onBack, onSetTimer }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [amPm, setAmPm] = useState('AM');

  const getCurrentDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    return {
      today: now.toISOString().split('T')[0],
      tomorrow: tomorrow.toISOString().split('T')[0],
      todayDisplay: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      tomorrowDisplay: tomorrow.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleTimeSelect = () => {
    const time24 = convertTo24Hour(selectedHour, selectedMinute, amPm);
    setSelectedTime(time24);
    setShowTimePicker(false);
  };

  const convertTo24Hour = (hour, minute, ampm) => {
    let hour24 = hour;
    if (ampm === 'PM' && hour !== 12) hour24 += 12;
    if (ampm === 'AM' && hour === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleSetTimer = () => {
    if (selectedDate && selectedTime) {
      const timerDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const now = new Date();
      
      if (timerDateTime <= now) {
        alert('Please select a future date and time');
        return;
      }
      
      const hoursUntil = Math.ceil((timerDateTime - now) / (1000 * 60 * 60));
      
      if (hoursUntil > 24) {
        alert('Timer can only be set for up to 24 hours');
        return;
      }
      
      onSetTimer({
        scheduledFor: timerDateTime,
        hoursUntil: hoursUntil,
        displayTime: `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${amPm}`
      });
    } else {
      alert('Please select both date and time');
    }
  };

  const current = getCurrentDateTime();

  return (
    <div className="h-full flex flex-col bg-white relative">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Schedule Message</h1>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="text-center">
            <Clock size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Schedule your message</h2>
            <p className="text-gray-600 text-sm">Set when you want your message to be sent (up to 24 hours)</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer bg-white"
                onClick={() => setShowCalendar(true)}
              >
                {selectedDate ? (
                  selectedDate === current.today ? current.todayDisplay : current.tomorrowDisplay
                ) : 'Select date'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <div 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer bg-white"
                onClick={() => setShowTimePicker(true)}
              >
                {selectedTime ? `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${amPm}` : 'Select time'}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You can schedule messages for up to 24 hours in advance. The message will be sent automatically at the specified time.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Calendar */}
      {showCalendar && (
        <div className="absolute inset-0 bg-white z-50">
          <div className="bg-green-600 text-white px-4 py-3">
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowCalendar(false)}>
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-medium">Select Date</h1>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <button
                className={`w-full p-4 border-2 rounded-lg text-left ${
                  selectedDate === current.today 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleDateSelect(current.today)}
              >
                <div className="font-medium">Today</div>
                <div className="text-sm text-gray-600">{current.todayDisplay}</div>
              </button>
              
              <button
                className={`w-full p-4 border-2 rounded-lg text-left ${
                  selectedDate === current.tomorrow 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleDateSelect(current.tomorrow)}
              >
                <div className="font-medium">Tomorrow</div>
                <div className="text-sm text-gray-600">{current.tomorrowDisplay}</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Time Picker */}
      {showTimePicker && (
        <div className="absolute inset-0 bg-white z-50">
          <div className="bg-green-600 text-white px-4 py-3">
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowTimePicker(false)}>
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-medium">Select Time</h1>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              {/* Hour Picker */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">Hour</div>
                <div className="w-24 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <div className="h-full overflow-y-scroll">
                    {Array.from({length: 12}, (_, i) => i + 1).map(hour => (
                      <button
                        key={hour}
                        className={`w-full py-2 text-center ${
                          selectedHour === hour ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedHour(hour)}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minute Picker */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">Minute</div>
                <div className="w-24 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <div className="h-full overflow-y-scroll">
                    {Array.from({length: 60}, (_, i) => i).filter(m => m % 5 === 0).map(minute => (
                      <button
                        key={minute}
                        className={`w-full py-2 text-center ${
                          selectedMinute === minute ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedMinute(minute)}
                      >
                        {minute.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AM/PM Picker */}
              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-600 mb-2">Period</div>
                <div className="space-y-2 space-x-1">
                  <button
                    className={`w-16 py-2 rounded ${
                      amPm === 'AM' ? 'bg-green-500 text-white' : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() => setAmPm('AM')}
                  >
                    AM
                  </button>
                  <button
                    className={`w-16 py-2 rounded ${
                      amPm === 'PM' ? 'bg-green-500 text-white' : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() => setAmPm('PM')}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleTimeSelect}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
            >
              Set Time
            </button>
          </div>
        </div>
      )}

      <div className="p-4 border-t mb-4">
        <button
          onClick={handleSetTimer}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
          disabled={!selectedDate || !selectedTime}
        >
          Set Timer
        </button>
      </div>
    </div>
  );
}

export default TimerMessage;