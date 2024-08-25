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

        <div className="mb-6 border-b ">
          <div
            id="alert-5"
            className="flex items-center p-4 rounded-lg"
            role="alert"
          >
            <svg
              className="flex-shrink-0 w-4 h-4 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div className="ms-3 text-md font-medium text-gray-950 ">
              This dashboard still under development{" "}
              
            </div>
          </div>

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
