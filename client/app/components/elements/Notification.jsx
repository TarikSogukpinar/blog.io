"use client";
import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";

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
    <div className="space-y-8 max-w-3xl mx-auto p-4">
      <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-4">
        <IoIosNotifications className="mr-2" /> Notification Settings
      </h3>
      <form className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-800">
            Email Notifications
          </span>
          <input
            type="checkbox"
            className="form-checkbox h-6 w-6 text-black rounded focus:ring-gray-500 focus:ring-2"
            checked={emailNotifications}
            onChange={handleEmailNotificationsChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-800">
            SMS Notifications
          </span>
          <input
            type="checkbox"
            className="form-checkbox h-6 w-6 text-black rounded focus:ring-gray-600 focus:ring-2"
            checked={smsNotifications}
            onChange={handleSmsNotificationsChange}
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 px-4 py-2 bg-gray-950 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
