import React, { useState, useRef } from 'react';
import { X, Type, Palette, Upload } from 'lucide-react';

const TextStatusEditor = ({ onBack, onStatusSent }) => {
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#128C7E');
  const [bgImage, setBgImage] = useState(null);
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState(28);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [showFontOptions, setShowFontOptions] = useState(false);
  const [showBgOptions, setShowBgOptions] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const fileInputRef = useRef(null);

  const fonts = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Times', value: '"Times New Roman", serif' },
    { name: 'Courier', value: '"Courier New", monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Comic Sans', value: '"Comic Sans MS", cursive' },
    { name: 'Impact', value: 'Impact, sans-serif' }
  ];

  const backgroundColors = [
    '#128C7E', '#075E54', '#25D366', '#34B7F1',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#9B59B6', '#E74C3C', '#F39C12', '#27AE60',
    '#3498DB', '#8E44AD', '#E67E22', '#2ECC71',
    '#000000', '#2C3E50', '#95A5A6', '#ECF0F1'
  ];

  const defaultBackgrounds = [
    {
      name: 'Sunset',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      emoji: '🌅'
    },
    {
      name: 'Ocean',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
      emoji: '🌊'
    },
    {
      name: 'Mountains',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
      emoji: '🏔️'
    },
    {
      name: 'Forest',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
      emoji: '🌲'
    },
    {
      name: 'Beach',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop',
      emoji: '🏖️'
    },
    {
      name: 'City',
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop',
      emoji: '🌆'
    }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBgImage(e.target.result);
        setBgColor(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendStatus = () => {
    if (text.trim()) {
      const statusData = {
        type: 'text',
        text: text.trim(),
        backgroundColor: bgColor,
        backgroundImage: bgImage,
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        textColor,
        timestamp: new Date()
      };
      if (onStatusSent) onStatusSent(statusData);
      onBack();
    }
  };

  return (
    <div 
      className="h-screen w-full relative flex items-center justify-center"
      style={{
        backgroundColor: bgImage ? 'transparent' : bgColor,
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      )}

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <button 
          onClick={onBack} 
          className="text-white p-2 bg-black bg-opacity-30 rounded-full hover:bg-opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-3">
          {/* Font Options */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowFontOptions(!showFontOptions);
                setShowBgOptions(false);
              }}
              className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            >
              <Type size={20} />
            </button>
            
            {showFontOptions && (
              <div className="absolute top-12 right-0 bg-gray-100 rounded-lg shadow-xl border border-gray-600 p-3 w-64 max-h-72 overflow-y-auto z-30">
                {/* From Device Button */}
                <button className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg mb-3 hover:bg-gray-600 transition-colors">
                  Import From Device
                </button>                
                <div className="flex justify-center space-x-2 mb-3">                                  
                  <button
                    onClick={() => {
                      setShowFontOptions(false);
                      setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold');
                    }}
                    className={`px-3 py-2 w-1/3 rounded font-bold text-sm ${
                      fontWeight === 'bold'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => { setShowFontOptions(false);  setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}}
                    className={`px-3 py-2 w-1/3 rounded italic text-sm ${
                      fontStyle === 'italic'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    I
                  </button>                                
                </div>                
                <div className="space-y-1">
                  {fonts.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => {
                        setFontFamily(font.value);
                        setShowFontOptions(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        fontFamily === font.value 
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-600 hover:text-gray-200' 
                          : 'text-gray-600 hover:bg-gray-600 hover:text-gray-200'
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Background Options */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowBgOptions(!showBgOptions);
                setShowFontOptions(false);
              }}
              className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            >
              <Palette size={20} />
            </button>
            
            {showBgOptions && (
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border p-4 w-80 max-h-80 overflow-y-auto z-30">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Colors</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {backgroundColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setBgColor(color);
                          setBgImage(null);
                          setShowBgOptions(false);
                        }}
                        className={`w-8 h-8 rounded-full border-2 ${
                          bgColor === color && !bgImage ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Images</h4>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {defaultBackgrounds.map((bg, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setBgImage(bg.url);
                          setBgColor(null);
                          setShowBgOptions(false);
                        }}
                        className={`h-16 rounded-lg border-2 overflow-hidden ${
                          bgImage === bg.url ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'
                        }`}
                        style={{
                          backgroundImage: `url(${bg.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
                          <span className="text-white text-lg">{bg.emoji}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowBgOptions(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-600 hover:bg-gray-50"
                  >
                    <Upload size={16} />
                    <span className="text-sm">Upload Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Text Input Area */}
      <div className="w-full max-w-sm px-8 relative z-10 flex items-center justify-center min-h-[200px]">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a status..."
          className="w-full bg-transparent border-none outline-none resize-none text-center placeholder-white placeholder-opacity-70 flex items-center justify-center"
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            color: textColor,
            fontWeight,
            fontStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          
          maxLength={300}
        />
      </div>
      

      {/* Send Button */}
      {text.trim() && (
        <div className="absolute bottom-20 right-4 z-20">
          <button 
            onClick={handleSendStatus}
            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default TextStatusEditor;