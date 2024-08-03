"use client";
import React, { useState } from "react";

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleEmailNotificationsChange = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleSmsNotificationsChange = () => {
    setSmsNotifications(!smsNotifications);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Notification Settings
      </h3>
      <form className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={emailNotifications}
            onChange={handleEmailNotificationsChange}
          />
          <span className="ml-2 text-gray-700">Email Notifications</span>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={smsNotifications}
            onChange={handleSmsNotificationsChange}
          />
          <span className="ml-2 text-gray-700">SMS Notifications</span>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-gray-950 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
