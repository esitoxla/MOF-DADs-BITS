import React from "react";
import { CiLock } from "react-icons/ci";

export default function SettingsChangePass() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full bg-white">
      <div className="md:w-1/3 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Change Password
        </h2>

        <p className="text-gray-600">Enter a new password to reset old one</p>
      </div>

      <div className="bg-white border border-gray-300 p-6 shadow rounded-md md:w-2/3 ">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Old Password
            </label>
            <div className="relative">
              <CiLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="Old Password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                // value={oldPassword}
                // onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              New Password
            </label>
            <div className="relative">
              <CiLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                // value={newPassword}
                // onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Confirm New Password
            </label>
            <div className="relative">
              <CiLock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                // value={confirmNewPassword}
                // onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-2 py-2 rounded-lg hover:opacity-90 transition md:w-[30%]"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
