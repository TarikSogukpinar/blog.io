"use client";
import React, { useState, useEffect } from "react";
import {
  FaDatabase,
  FaCloud,
  FaServer,
  FaExclamationTriangle,
} from "react-icons/fa"; // İkonları import edin
import LoadingSpinner from "../elements/LoadingSpinner";
import { GrStatusGood, GrInProgress } from "react-icons/gr"; // Yeni ikon eklendi

export default function HealthPage() {
  const [systemStatus, setSystemStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allSystemsOperational, setAllSystemsOperational] = useState(true); // Yeni state

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        // Simulate fetching system status from an API
        const fetchedSystemStatus = [
          {
            name: "Database",
            status: 200, // API'den gelen HTTP status kodu
            icon: <FaDatabase size={30} />,
          },
          {
            name: "API Gateway",
            status: 200, // API'den gelen HTTP status kodu
            icon: <FaCloud size={30} />,
          },
          {
            name: "Cache Server",
            status: 503, // API'den gelen HTTP status kodu
            icon: <FaServer size={30} />,
          },
          {
            name: "Third-Party API",
            status: 500, // API'den gelen HTTP status kodu
            icon: <FaExclamationTriangle size={30} />,
          },
        ];

        const updatedSystemStatus = fetchedSystemStatus.map((system) => {
          // Eğer sistem 200 döndürmüyorsa allSystemsOperational false yap
          if (system.status !== 200) {
            setAllSystemsOperational(false);
          }
          return {
            ...system,
            statusText: system.status === 200 ? "Operational" : "Down",
            color: system.status === 200 ? "bg-green-900" : "bg-red-500",
          };
        });

        setSystemStatus(updatedSystemStatus);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch system status");
        setLoading(false);
      }
    };

    fetchSystemStatus();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center">
      <div className="relative isolate">
        <div
          className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu  blur-3xl lg:ml-24 xl:ml-48"
          aria-hidden="true"
        ></div>
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                {/* Durum mesajı */}
                <div
                  className={`flex items-center justify-center p-4 text-2xl rounded-lg ${
                    allSystemsOperational
                      ? "text-green-800 bg-gray-50"
                      : "text-yellow-800 bg-yellow-50"
                  }`}
                  role="alert"
                >
                  {!allSystemsOperational ? (
                    <>
                      <GrStatusGood size={30} />
                      <span className="font-medium ml-2 mr-2">
                        All Systems Operational
                      </span>
                    </>
                  ) : (
                    <>
                      <GrInProgress size={30} />
                      <span className="font-medium ml-2 mr-2">
                        Şuanda araştırıyoruz...
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-10 flex flex-col items-center gap-x-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {systemStatus.map((system, index) => (
                      <div
                        key={index}
                        className={`${system.color} text-white text-2xl font-semibold p-4 rounded-lg text-center transition duration-300 ease-in-out flex items-center justify-center space-x-3`}
                      >
                        {system.icon} {/* İkonu ekleyin */}
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            {system.name}
                          </h2>
                          <p>{system.statusText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
