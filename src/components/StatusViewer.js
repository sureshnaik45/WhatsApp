import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const StatusViewer = ({ status, onBack, onViewed }) => {
  const [showViewers, setShowViewers] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onBack(); // Auto-close after 5s
    }, 5000);

    return () => clearTimeout(timer);
  }, [onBack]);

  useEffect(() => {
    if (status && !status.viewed) {
      onViewed(); // mark this status as seen once opened
    }
  }, [status, onViewed]);

  if (!status) return null;

  const viewers = [
    { id: 1, name: "You", avatar: "📱", seenAt: "3:25 PM" },
    { id: 2, name: "Mom", avatar: "👩‍💼", seenAt: "3:20 PM" },
    { id: 3, name: "Dad", avatar: "👨‍🦳", seenAt: "3:15 PM" },
    { id: 4, name: "Alex Johnson", avatar: "🧑‍💻", seenAt: "2:45 PM" },
  ];

  const filteredViewers = viewers.filter((viewer) =>
    viewer.name.toLowerCase().includes(replyText.toLowerCase())
  );

  if (showViewers) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-green-600 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowViewers(false)}
              className="text-white"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeWidth="3"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <h1 className="text-lg font-medium">Seen by {viewers.length}</h1>
            <Search className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        <div className="px-4 py-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search viewers..."
            className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredViewers.map((viewer) => (
            <div
              key={viewer.id}
              className="flex items-center px-4 py-3 hover:bg-gray-50"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl mr-3">
                {viewer.avatar}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{viewer.name}</h3>
                <p className="text-sm text-gray-600">Seen at {viewer.seenAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black relative">
      {/* Status Header */}
      <div className="bg-black bg-opacity-80 text-white px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          {/* Left: Back + Avatar + Info */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-white hover:bg-gray-800 p-2 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeWidth="3"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl`}
              >
                {status.avatar}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">{status.name}</h3>
                <p className="text-xs text-green-200">{status.time}</p>
              </div>
            </div>
          </div>

          {/* Right: Three Dots */}
          <button className="text-white hover:text-gray-400 p-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 w-full bg-gray-600 rounded-full overflow-hidden">
          <div className="h-full bg-gray-300 animate-progress"></div>
        </div>
      </div>

      {/* Status Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-80 h-80 bg-gray-700 rounded-2xl flex items-center justify-center text-8xl mb-4">
            🌅
          </div>
        </div>
      </div>

      {/* Caption & Reply */}
      <div className="bg-black bg-opacity-80 text-white px-4 py-5 space-y-5">
        <p className="text-center text-white text-base">
          Beautiful sunset today!
        </p>

        <div className="flex items-center bg-gray-800 rounded-full px-4 py-3">
          <input
            type="text"
            placeholder="Reply to status..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none border-none focus:outline-none focus:ring-0"
          />

          {replyText.trim().length !== 0 && (
            <button className="ml-3 text-green-500 hover:text-green-400">
              <svg
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusViewer;