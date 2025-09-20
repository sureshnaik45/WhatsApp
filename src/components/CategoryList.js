import React from 'react';

const CategoryList = ({ categories, onCategoryClick, onCreateCategory, getTotalUnread }) => {
  return (
    <div>
      {/* Category items - like chats page */}
      <div>
        {categories.map(category => {
          const totalUnread = getTotalUnread(category.id);
          
          return (
            <div 
              key={category.id} 
              className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => onCategoryClick(category)}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3"
                   style={{ backgroundColor: category.color }}>
                <span className="text-white font-bold text-lg">
                  {category.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 truncate">{category.name}</h3>
                  <span className="text-xs text-gray-500">
                    {category.contacts.length} contacts
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {totalUnread > 0 ? `${totalUnread} unread messages` : 'No new messages'}
                </p>
              </div>
              {totalUnread > 0 && (
                <div className="ml-3">
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {totalUnread}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;