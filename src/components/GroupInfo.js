import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Settings, Trash2 } from 'lucide-react';

const GroupInfo = ({ chat, onBack }) => {
  // Mock group members data
  const [groupMembers] = useState([
    { id: 1, name: 'You', avatar: '👤', isAdmin: true },
    { id: 2, name: 'Mom', avatar: '👩‍💼', isAdmin: false },
    { id: 3, name: 'Dad', avatar: '👨‍🦳', isAdmin: true },
    { id: 4, name: 'Sister', avatar: '👩‍🎓', isAdmin: false },
    { id: 5, name: 'Uncle John', avatar: '👨‍🦲', isAdmin: false }
  ]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">Group Info</h1>
        </div>
      </div>

      {/* Group Profile */}
      <div className="p-6 text-center border-b">
        <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
          {chat.avatar}
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{chat.name}</h2>
        <p className="text-gray-600 mt-1">Group · {groupMembers.length} members</p>
      </div>

      {/* Group Details */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">MEMBERS ({groupMembers.length})</h3>
            
            {groupMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    {member.isAdmin && (
                      <p className="text-sm text-gray-500">Group admin</p>
                    )}
                  </div>
                </div>
                
                {member.name !== 'You' && (
                  <div className="flex items-center space-x-2">
                    {!member.isAdmin && (
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        onClick={() => alert(`Make ${member.name} admin`)}
                      >
                        <Settings size={16} />
                      </button>
                    )}
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => alert(`Remove ${member.name} from group`)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">GROUP ACTIONS</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <UserPlus className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Add members</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;