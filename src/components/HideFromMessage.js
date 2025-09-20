import React, { useState } from 'react';
import { ArrowLeft, EyeOff } from 'lucide-react';

const HideFromMessage = ({ onBack, onSetHideFrom, groupMembers = [] }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleMemberToggle = (member) => {
    setSelectedMembers(prev => 
      prev.includes(member) 
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  const handleSetHideFrom = () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member to hide from');
      return;
    }
    onSetHideFrom(selectedMembers);
  };

  // Mock group members if not provided
  const members = groupMembers.length > 0 ? groupMembers : [
    { id: 1, name: 'Mom', avatar: '👩‍💼' },
    { id: 2, name: 'Dad', avatar: '👨‍🦳' },
    { id: 3, name: 'Sister', avatar: '👩‍🎓' },
    { id: 4, name: 'Uncle John', avatar: '👨‍🦲' }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Hide From</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="text-center mb-6">
            <EyeOff size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Hide message from</h2>
            <p className="text-gray-600 text-sm">Select members who won't see this message</p>
          </div>

          <div className="space-y-2">
            {members.map(member => (
              <div 
                key={member.id}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                onClick={() => handleMemberToggle(member)}
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                </div>
                <div className={`w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                  selectedMembers.includes(member) ? 'bg-green-500 border-green-500' : 'bg-white border-black'
                }`}>
                  {selectedMembers.includes(member) && (
                    <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleSetHideFrom}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium"
          disabled={selectedMembers.length === 0}
        >
          Hide Selected ({selectedMembers.length})
        </button>
      </div>
    </div>
  );
};

export default HideFromMessage;