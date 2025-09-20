import React from 'react';
import { ArrowLeft } from 'lucide-react';

const About = ({ onBack }) => {
  const aboutPoints = [
    "WhatsApp Clone - A modern messaging application built with React",
    "Features real-time messaging with end-to-end encryption simulation",
    "Supports multiple media types: text, images, videos, audio, and documents",
    "Organized chat categories for better conversation management",
    "Status sharing functionality with various media formats",
    "Group chat capabilities with admin controls",
    "Voice and video calling interface simulation",
    "Message reactions and emoji support",
    "Pin important messages for quick access",
    "Star messages to save them for later",
    "Forward messages to multiple contacts",
    "Search functionality across all conversations",
    "Dark and light theme support",
    "Birthday calendar integration for contacts",
    "Individual and bulk chat backup options",
    "Privacy-focused design with screen protection",
    "Responsive design for mobile and desktop",
    "WhatsApp-like user interface and experience",
    "Contact management and profile customization",
    "Built with modern web technologies and best practices"
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium">About</h1>
        </div>
      </div>

      {/* About Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl text-white mx-auto mb-4">
            💬
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Clone</h2>
          <p className="text-gray-600">Version 1.0.0</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Features</h3>
          
          {aboutPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Technology Stack</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
            <div>• React.js</div>
            <div>• Tailwind CSS</div>
            <div>• Lucide Icons</div>
            <div>• JavaScript ES6+</div>
            <div>• HTML5 & CSS3</div>
            <div>• Local Storage</div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>© 2024 WhatsApp Clone Project</p>
          <p>Built for educational purposes</p>
        </div>
      </div>
    </div>
  );
};

export default About;