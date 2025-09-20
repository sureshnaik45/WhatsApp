import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const DeviceImages = ({ onBack, onStatusSent }) => {
  const fileInputRef = useRef(null);
  const hasOpened = useRef(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    if (fileInputRef.current && !hasOpened.current) {
      fileInputRef.current.click();
      hasOpened.current = true;
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    } else {
      onBack(); // gracefully exit if user cancels
    }
  };

  const handleSendStatus = () => {
    if (selectedImage) {
      const statusData = {
        type: 'image',
        media: URL.createObjectURL(selectedImage),
        caption: caption.trim()
      };
      
      if (onStatusSent) onStatusSent(statusData);
      onBack();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-black">
      {/* Hidden File Input */}
      <input
        type="file"
        accept=".png,.jpg,.jpeg"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      {selectedImage && (
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Image Preview + Caption */}
      {selectedImage && (
        <div className="flex items-start mt-20 justify-center flex-1">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="max-w-80 max-h-80 object-contain rounded-lg"
          />

          {/* Caption Input */}
          <div className="w-full bg-black bg-opacity-80 text-white px-4 py-5 space-y-5 absolute bottom-0 left-0 right-0">
            <div className="flex items-center bg-gray-800 rounded-full px-4 py-3">
              <input
                type="text"
                placeholder="Add caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm 
                           outline-none border-none focus:outline-none focus:ring-0 
                           focus:border-none focus-visible:outline-none"
              />             
              <button
                onClick={handleSendStatus}
                className="ml-3 text-green-500 hover:text-green-400"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>          
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceImages;
