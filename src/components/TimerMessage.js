import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

const TimerMessage = ({ onBack, onSetTimer }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  };

  const handleSetTimer = () => {
    if (selectedDate && selectedTime) {
      const timerDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const now = new Date();
      
      if (timerDateTime <= now) {
        alert('Please select a future date and time');
        return;
      }
      
      // Calculate time until timer (in hours)
      const hoursUntil = Math.ceil((timerDateTime - now) / (1000 * 60 * 60));
      
      if (hoursUntil > 24) {
        alert('Timer can only be set for up to 24 hours');
        return;
      }
      
      onSetTimer({
        scheduledFor: timerDateTime,
        hoursUntil: hoursUntil
      });
    } else {
      alert('Please select both date and time');
    }
  };

  const current = getCurrentDateTime();

  return (
    <div className="h-full flex flex-col bg-white">
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
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={current.date}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You can schedule messages for up to 24 hours in advance. The message will be sent automatically at the specified time.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
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
};

export default TimerMessage;