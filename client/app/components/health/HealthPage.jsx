"use client";
import React, { useState, useEffect } from "react";
import {
  FaDatabase,
  FaCloud,
  FaServer,
  FaExclamationTriangle,
} from "react-icons/fa";
import LoadingSpinner from "../elements/LoadingSpinner";
import { GrStatusGood, GrInProgress } from "react-icons/gr";
import { SiNestjs } from "react-icons/si";
import { DiRedis } from "react-icons/di";

export default function HealthPage() {
  const [systemStatus, setSystemStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allSystemsOperational, setAllSystemsOperational] = useState(true);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await fetch(
          `https://blog.tariksogukpinar.dev/api/v1/health`
        );
        const data = await response.json();

        const fetchedSystemStatus = [
          {
            name: "Database",
            status: data.details.database.status === "up" ? 200 : 500,
            icon: <FaDatabase size={50} />,
          },
          {
            name: "API Gateway",
            status: 200,
            icon: <FaCloud size={50} />,
          },
          {
            name: "NestJS API",
            status: data.details["nestjs-docs"].status === "up" ? 200 : 500,
            icon: <SiNestjs size={50} />,
          },
          {
            name: "Cache Server",
            status: data.details["nestjs-docs"].status === "up" ? 200 : 500,
            icon: <DiRedis size={50} />,
          },
        ];

        const updatedSystemStatus = fetchedSystemStatus.map((system) => {
          if (system.status !== 200) {
            setAllSystemsOperational(false);
          }
          return {
            ...system,
            statusText: system.status === 200 ? "Operational" : "Down",
            textColor:
              system.status === 200 ? "text-green-600" : "text-red-600",
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-2xl">{error}</p>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="relative isolate w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-center w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 pt-8 sm:pt-24 lg:pt-8">
            <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
              <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                <div
                  className={`flex items-center justify-center p-6 text-3xl sm:text-4xl rounded-lg ${
                    allSystemsOperational ? "text-green-800" : "text-yellow-800"
                  }`}
                  role="alert"
                >
                  {allSystemsOperational ? (
                    <>
                      <GrStatusGood size={50} className="sm:size-70" />
                      <span className="ml-4 font-bold text-xl sm:text-2xl">
                        All Systems Operational
                      </span>
                    </>
                  ) : (
                    <>
                      <GrInProgress size={50} className="sm:size-70" />
                      <span className="ml-4 font-bold text-xl sm:text-2xl">
                        We are currently investigating...
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-10 sm:mt-16 flex flex-col items-center gap-x-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                    {systemStatus.map((system, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center justify-center space-x-3 text-center`}
                      >
                        {system.icon} {/* İkonu ekleyin */}
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                            {system.name}
                          </h2>
                          <p
                            className={`text-lg sm:text-2xl font-semibold ${system.textColor}`}
                          >
                            {system.statusText}
                          </p>
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
