import React, { useState } from 'react';
import CategoryChatWindow from './CategoryChatWindow.js';
import CategoryInfo from './CategoryInfo.js';

const CategoryDetail = ({ category, chats, onBack, setChats, setShowContactSelector, handleShowContactSelector }) => {
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);

  const handleHeaderClick = () => {
    setShowCategoryInfo(true);
  };

  const handleBackFromInfo = () => {
    setShowCategoryInfo(false);
  };

  if (showCategoryInfo) {
    return (
      <CategoryInfo 
        category={category}
        onBack={handleBackFromInfo}
      />
    );
  }

  return (
    <CategoryChatWindow 
      category={category}
      onBack={onBack}
      onHeaderClick={handleHeaderClick}
      setChats={setChats}
      onShowContactSelector={handleShowContactSelector}
    />
  );
};

export default CategoryDetail;