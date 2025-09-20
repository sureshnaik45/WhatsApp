import React, { useState } from 'react';

const NewCategoryModal = ({ isOpen, onClose, onCreate }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleCreate = () => {
    if (categoryName.trim()) {
      onCreate(categoryName.trim());
      setCategoryName('');
      onClose();
    }
  };

  const handleClose = () => {
    setCategoryName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Create New Category</h3>
        <input
          type="text"
          placeholder="Category name"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
        />
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          {categoryName.trim().length > 0 && (
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500"
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCategoryModal;