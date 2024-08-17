"use client";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { getUserSessions, terminateUserSession } from "@/app/utils/user";
import { VscVmActive } from "react-icons/vsc";

export default function Session() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await getUserSessions();
      if (data.error) {
        setError(data.error);
      } else {
        setSessions(data);
      }
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const handleTerminateSession = async (sessionId) => {
    const confirmation = confirm(
      "Are you sure you want to terminate this session?"
    );
    if (!confirmation) return;

    const result = await terminateUserSession(sessionId);
    if (result.error) {
      setError(result.error);
    } else {
      setSessions(sessions.filter((session) => session.id !== sessionId));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4">
      <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-1">
        <VscVmActive className="mr-2" /> Active Session
      </h3>
      <div className="rounded-lg p-6 mb-8 ">
        {sessions
          .filter((session) => session.isActive)
          .map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {session.ipAddress}
                </p>
                <p className="text-gray-600">{session.userAgent}</p>
                <p className="text-gray-600">
                  Last Active: {new Date(session.updatedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleTerminateSession(session.id)}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Terminate
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
