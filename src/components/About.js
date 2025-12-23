import React from 'react';
import { ArrowLeft } from 'lucide-react';

const About = ({ onBack }) => {
  const aboutPoints = [
    "WhatsApp, Everyone. At the end of 2022, I expected some features in WhatsApp that would be amazing if they were added.",
    "The following are features I expected, and some of them later came to WhatsApp:",
    "During video calls, the option to change the background of the video",
    "Sharing 30-second clips of album or movie music in status updates",
    "Lists in WhatsApp, though my approach is different",
    "Status sharing functionality with various media formats",
    "The following are features that still haven't come to WhatsApp:",
    "A Categories tab where we can add important people. If any message is received from them, it goes there, and important persons' chats are not shown in the main chats tab.",
    "In the 'who viewed our status' section, we need a search icon for finding specific people",
    "In groups, for sent messages, message info should show the 'seen by' count, delivery and read timestamps, and a search icon for finding members.",
    "For received messages, we also need to show when the message was delivered to us and when it was read",
    "When sharing text as status, provide imported fonts options",
    "For profile photos, show when it was updated and who has seen it (for user's own profile). For others' profile pictures, show when they updated it and when we last saw it",
    "When sharing video as status, provide an option to extract audio from the video and share that audio as status",
    "Calendar - we can set our birthday, see others' birthdays, and update special days in our lives",
    "For backup, instead of backing up all chats, allow specific person's chat backup for specific time periods like 2023-2024",
    "In groups, allow hiding message sharing from some members. For identification, this feature should use an eye-off icon",
    "Setting a timer to share a message within 24 hours. For identification, this feature should use a clock icon for that message",
    "In status, add document sharing option. Currently, if we want to share documents to many people, we need to share individually or in groups, but not all people are present in groups.",
    "Not allowing screenshots taking anywhere in the WhatsApp, for chatwindow need to show screenshot privacy feature where we can set who can our chats screenshot like contacts, everyone, some specific persons",
    "When went to recent tabs we just need to show an blank window or else brand logo, as now we can see whats going in an app from recent tabs",
    "From thinking about these features, sketching on papers, in canva, finally it came here in the form of a basic webpage"    
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Version of WhatsApp</h2>
          <p className="text-gray-600">Version 1.0.0</p>
        </div>

        <div className="space-y-3">          
          {aboutPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div> 
      </div>
    </div>
  );
};

export default About;