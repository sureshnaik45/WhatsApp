import React from 'react';
import { ArrowLeft } from 'lucide-react';

const About = ({ onBack }) => {
  const aboutPoints = [
    "Hello Everyone. Back in late 2022, I envisioned several features for WhatsApp that I believed would significantly enhance the user experience (if added).",
    "The following are features I anticipated, some of which have since been introduced to WhatsApp recently:",
    "Video Call Backgrounds: The option to change or blur the background during active video calls.",
    "Audio Status: Sharing 30-second music clips or audio notes directly in status updates.",
    "Chat Organization: While WhatsApp later added 'Lists', my 'Categories' feature offers a distinct approach to isolating important chats.",
    "Media Status: Enhanced sharing capabilities for various media formats, including audio and documents.",
    "The following are innovative features I developed that are still not available in WhatsApp:",
    "Categories Tab: A dedicated tab for 'Important' people. Messages from these contacts are routed here, keeping the main chat list clutter-free.",
    "Status Viewer Search: A search icon in the status view to find specific people by name instead of scrolling through the viewer list.",
    "Advanced Group Message Info: For sent messages, view detailed 'Seen By' counts, delivery/read timestamps, and search for specific members who read it.",
    "Received Message Details: View the exact time a received message was delivered to your device versus when you actually read it.",
    "Custom Fonts for Status: Access to a wide range of imported fonts when sharing text-based statuses.",
    "Profile Insights: View timestamps of when contacts updated their profile pictures. For your own profile, see who viewed it and when you last updated it.",
    "Profile Download Privacy: Control exactly who is allowed to download your profile picture (Everyone, Contacts, or Nobody).",
    "Audio Extraction: The ability to extract audio from a video file and share just the audio track as a status update.",
    "Integrated Calendar: Set birthdays, add notes for special days, and manage event privacy. Birthdays are displayed with a unique indicator on the calendar grid.",
    "Selective Chat Backup: Backup chats for specific contacts or within a defined date range (e.g., 2023-2024) instead of a forced global backup.",
    "Hidden Group Messages: The ability to hide specific messages in a group from selected members, identified by a privacy 'eye-off' icon.",
    "Scheduled Messages: Set a timer to send a message automatically within a 24-hour window, marked with a distinct clock icon.",
    "Document Status Sharing: Share PDF or TXT files as status updates, allowing contacts to open and view documents directly from the status.",
    "Screenshot Privacy: Granular privacy controls to allow or block screenshots in chat windows for specific contacts or everyone.",
    "Recent Apps Privacy: Displays a blank screen or logo when the app is viewed in the phone's 'Recent Apps' switcher to prevent data snooping.",
    "Message Pinning with Duration: Pin messages for specific durations (24 hours, 1 week, Lifetime) which auto-unpin when the time expires.",
    "Message Range Filter: A search tool to filter and view messages within a specific start and end date range.",
    "Need to implement features related to notifications.",
    "From conceptualizing these features on paper to designing them in Canva in late 2022, this journey has culminated in the creation of this basic webpage/MVP in 2025."
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