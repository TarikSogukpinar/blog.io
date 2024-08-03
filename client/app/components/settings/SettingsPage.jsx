"use client";
import React, { useState } from "react";
import ProfileInformation from "../elements/ProfileInformation";
import ChangePassword from "../elements/ChangePassword";
import Session from "../elements/Sessions";
import Notification from "../elements/Notification";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Settings</h2>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`text-gray-500 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`text-gray-500 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent"
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`text-gray-500 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sessions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent"
              }`}
            >
              Sessions
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`text-gray-500 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notifications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent"
              }`}
            >
              Notifications Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "profile" && <ProfileInformation />}
          {activeTab === "password" && <ChangePassword />}
          {activeTab === "sessions" && <Session />}
          {activeTab === "notifications" && <Notification />}
        </div>
      </div>
    </div>
  );
}
