import React, { useState } from 'react';
import { FileText, Image } from 'lucide-react';
import TextStatusEditor from './TextStatusEditor';
import ImageStatusEditor from './ImageStatusEditor'; // if you have one

const StatusSelector = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <div className="p-6">
      {!selectedOption && (
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedOption('text')}
            className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-gray-800">Text</span>
          </button>

          <button
            onClick={() => setSelectedOption('images')}
            className="flex items-center space-x-4 p-4 bg-pink-50 border border-pink-200 rounded-lg hover:bg-pink-100"
          >
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            <span className="font-medium text-gray-800">Images</span>
          </button>
        </div>
      )}
      {selectedOption === 'text' && (
        <TextStatusEditor onBack={() => setSelectedOption(null)} />
      )}

      {selectedOption === 'images' && (
        <ImageStatusEditor onBack={() => setSelectedOption(null)} />
      )}
    </div>
  );
};

export default StatusSelector;
