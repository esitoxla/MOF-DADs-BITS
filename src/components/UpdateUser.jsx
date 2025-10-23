import React from 'react'
import { NavLink } from "react-router";
import { useNavigate } from "react-router";

export default function UpdateUser({ isOpen, onClose }) {
    if (!isOpen) return null;
//   const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-xs transition-all duration-300"
        onClick={onClose} // closes modal when background is clicked
      ></div>

      <div className="relative flex flex-col m-6 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <button
          onClick={onClose}
          className="absolute top-3 right-6 text-gray-500 hover:text-black cursor-pointer"
        >
          ✕
        </button>

        <div className="flex flex-col justify-center py-4 px-4 md:px-8 w-full">
          <span className="mb-6 text-2xl font-semibold">Update user</span>

          <form className="space-y-8">
            {/* First row: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                />
              </div>
            </div>

            {/* Second row: Password & Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                />
              </div>
            </div>

            {/* Third row: Role & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  placeholder="Enter role"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Fourth row: Organization & Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Enter organization"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Enter designation"
                  className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
                />
              </div>
            </div>

            {/* Submit row */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
