"use client";
import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { getUserSessions } from "@/app/utils/user";
import { useParams, usePathname } from "next/navigation";
// useRouter hook'unu import edin

export default function Session() {
  const params = useParams();
  const { id } = params;

  console.log(params, 'params id')

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // userId mevcut değilse bekleyin

    const fetchSessions = async () => {
      const data = await getUserSessions(id); // userId'yi API isteğine gönderin
      if (data.error) {
        setError(data.error);
      } else {
        setSessions(data);
      }
      setLoading(false);
    };

    fetchSessions();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
        Active Session
      </h3>
      <div className="rounded-lg p-6 mb-8 bg-white shadow-lg">
        {sessions
          .filter((session) => session.current)
          .map((session) => (
            <div key={session.id}>
              <p className="text-xl font-semibold text-gray-800">
                {session.device}
              </p>
              <p className="text-gray-600">{session.location}</p>
              <p className="text-gray-600">Last Active: {session.lastActive}</p>
            </div>
          ))}
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
        Previous Sessions
      </h3>
      <div className="space-y-6">
        {sessions
          .filter((session) => !session.current)
          .map((session) => (
            <div
              key={session.id}
              className="rounded-lg p-6 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <p className="text-xl font-semibold text-gray-800">
                {session.device}
              </p>
              <p className="text-gray-600">{session.location}</p>
              <p className="text-gray-600">Last Active: {session.lastActive}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
