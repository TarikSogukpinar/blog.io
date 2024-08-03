import React from "react";

// Örnek oturum verisi
const sessions = [
  {
    id: 1,
    device: "Chrome on Windows 10",
    location: "New York, USA",
    lastActive: "2023-08-01 10:00 AM",
    current: true,
  },
  {
    id: 2,
    device: "Safari on iOS",
    location: "San Francisco, USA",
    lastActive: "2023-07-28 02:00 PM",
    current: false,
  },
  {
    id: 3,
    device: "Firefox on Linux",
    location: "Berlin, Germany",
    lastActive: "2023-07-20 09:00 AM",
    current: false,
  },
  // Diğer oturumlar...
];

export default function Session() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Active Session
      </h3>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        {sessions
          .filter((session) => session.current)
          .map((session) => (
            <div key={session.id}>
              <p className="text-gray-700 font-medium">{session.device}</p>
              <p className="text-gray-500">{session.location}</p>
              <p className="text-gray-500">Last Active: {session.lastActive}</p>
            </div>
          ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Previous Sessions
      </h3>
      <div className="space-y-4">
        {sessions
          .filter((session) => !session.current)
          .map((session) => (
            <div
              key={session.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-gray-700 font-medium">{session.device}</p>
              <p className="text-gray-500">{session.location}</p>
              <p className="text-gray-500">Last Active: {session.lastActive}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
