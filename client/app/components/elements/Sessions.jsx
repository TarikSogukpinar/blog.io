"use client";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { VscVmActive } from "react-icons/vsc";
import Cookies from "js-cookie";
import axios from "axios";
import { getUserSessions } from "@/app/utils/user";
import ConfirmationModal from "./ConformationModal";

export default function Session({ userId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getUserSessions();

        if (Array.isArray(data)) {
          setSessions(data);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Unexpected data format received.");
        }
      } catch (err) {
        setError("An error occurred while retrieving sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  const handleTerminateSession = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/sessions/${selectedSessionId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("JWT")}`,
          },
        }
      );

      if (response.status === 200) {
        setSessions(
          sessions.filter((session) => session.id !== selectedSessionId)
        );
      } else {
        setError("The session could not be terminated.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while ending the session.");
    } finally {
      setShowModal(false);
    }
  };

  const openModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4">
      <h3 className="flex items-center text-2xl font-semibold text-gray-900 mb-1">
        <VscVmActive className="mr-2" /> Active Sessions
      </h3>
      <div className="rounded-lg p-6 mb-8">
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
                onClick={() => openModal(session.id)}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Terminate
              </button>
            </div>
          ))}
      </div>

      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleTerminateSession}
      />
    </div>
  );
}
