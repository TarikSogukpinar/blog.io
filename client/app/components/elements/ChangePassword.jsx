"use client";
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { changePassword } from "@/app/utils/user";

export default function ChangePassword({ userId }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await changePassword(userId, currentPassword, newPassword);
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Change Account Password
      </h3>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      <form className="space-y-6" onSubmit={handlePasswordChange}>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Current Password
          </label>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            required
            onChange={(e) => setCurrentPassword(e.target.value)}
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
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
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
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gray-950 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          disabled={loading}
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
