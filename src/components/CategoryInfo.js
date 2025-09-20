import React, { useState } from 'react';
import { Search, MoreVertical, User, UserMinus, Crown } from 'lucide-react';

const CategoryInfo = ({ category, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = category.contacts.filter(contact =>
    contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMakeAdmin = (contact) => {
    alert(`Made ${contact} an admin`);
  };

  const handleRemoveUser = (contact) => {
    alert(`Removed ${contact} from category`);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="text-white hover:bg-green-700 p-1 rounded text-xl"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-medium">Category Info</h1>
          </div>
          <MoreVertical className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Category Profile */}
      <div className="p-6 text-center border-b">
        <div 
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: category.color }}
        >
          <span className="text-white font-bold text-4xl">
            {category.name.charAt(0)}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
        <p className="text-gray-600 mt-1">{category.contacts.length} members</p>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Description:</strong> This category contains your {category.name.toLowerCase()} contacts for better organization and communication.
          </p>
        </div>
      </div>

      {/* Search Members */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {filteredContacts.length} MEMBERS
          </h3>
        </div>
        
        {filteredContacts.map((contact, index) => (
          <div key={index} className="flex items-center px-4 py-3 hover:bg-gray-50">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">
              👤
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{contact}</h3>
              <p className="text-sm text-gray-600">
                {index === 0 ? 'Admin • Online' : 'Member • Last seen recently'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMakeAdmin(contact)}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
                title="Make Admin"
              >
                <Crown size={18} />
              </button>
              <button
                onClick={() => handleRemoveUser(contact)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                title="Remove User"
              >
                <UserMinus size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Add Member Option */}
        <div className="px-4 py-3 border-t mt-4">
          <button className="flex items-center space-x-3 text-green-600 hover:bg-green-50 p-2 rounded-lg w-full">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User size={24} className="text-green-600" />
            </div>
            <span className="font-medium">Add Member</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryInfo;