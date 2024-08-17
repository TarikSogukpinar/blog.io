"use client";
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function ChangePassword() {
  const [loading, setLoading] = useState(true);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-lg mx-auto p-6 ">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Change Account Password
      </h3>
      <form className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Current Password"
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            New Password
          </label>
          <input
            type="password"
            placeholder="New Password"
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm New Password"
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <button className="w-full py-3 bg-gray-950 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
          Change Password
        </button>
      </form>
    </div>
  );
}
