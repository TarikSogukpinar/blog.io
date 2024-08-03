import React from "react";

export default function ProfileInformation() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <img
          className="w-24 h-24 object-cover rounded-full border-4 border-white mx-auto"
          src="https://via.placeholder.com/150"
          alt="Profile"
        />
        <h2 className="text-2xl font-semibold text-gray-900 mt-2">John Doe</h2>
        <p className="text-gray-600">Software Developer</p>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              placeholder="John"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            placeholder="john.doe@example.com"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Time Zone</label>
          <select className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option>(GMT-05:00) Eastern Time (US & Canada)</option>
            <option>(GMT-06:00) Central Time (US & Canada)</option>
            <option>(GMT-07:00) Mountain Time (US & Canada)</option>
            <option>(GMT-08:00) Pacific Time (US & Canada)</option>
          </select>
        </div>
        <button className="w-full px-4 py-2 bg-gray-950 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Save Changes
        </button>
      </form>
    </div>
  );
}
