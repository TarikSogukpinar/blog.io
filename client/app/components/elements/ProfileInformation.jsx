import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { getUserInformation } from "@/app/utils/user";

export default function ProfileInformation() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserInformation();
      if (data.error) {
        setError(data.error);
      } else {
        setUserData({
          firstName: data.name.split(" ")[0] || "",
          lastName: data.name.split(" ")[1] || "",
          email: data.email,
          role: data.role,
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 ">
      <div className="text-center">
        <img
          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg mx-auto"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">{`${userData.firstName} ${userData.lastName}`}</h2>
        <p className="text-lg text-gray-600 mt-2">{userData.role}</p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) =>
                setUserData({ ...userData, firstName: e.target.value })
              }
              className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Time Zone
          </label>
          <select className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option>(GMT-05:00) Eastern Time (US & Canada)</option>
            <option>(GMT-06:00) Central Time (US & Canada)</option>
            <option>(GMT-07:00) Mountain Time (US & Canada)</option>
            <option>(GMT-08:00) Pacific Time (US & Canada)</option>
          </select>
        </div>
        <button className="w-full mt-6 px-4 py-2 bg-gray-950 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Save Changes
        </button>
      </form>
    </div>
  );
}
