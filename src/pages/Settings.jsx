import React from "react";
import { Link } from "react-router";
import { CiLock } from "react-icons/ci";
import profile from "../assets/images/profile.1.jpg";

export default function Settings() {
  return (
    <div className=" min-h-screen lg:p-8 p-4 sm:p-6 w-full">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Settings</h2>

      <div className="grid grid-cols-2 bg-white rounded shadow p-4">
        <div className="flex flex-col items-center gap-3 p-8 md:p-14">
          <div>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border border-gray-300">
              <img
                src={profile}
                alt="Profile"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full"
              />
            </div>

            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              // onChange={handleFileChange}
            />

            <button
              // onClick={triggerFileInput}
              // disabled={loading}
              className="px-3 py-2  bg-green-900 text-white font-medium rounded-md hover:text-sm cursor-pointer"
            >
              Upload Picture
            </button>
          </div>

          <div className="sm:block">
            <p className="font-medium">Nkumin Asaa Osei</p>
            <p>Budget Analyst</p>
          </div>
          
        </div>

        <div className="flex flex-col justify-center p-8 md:p-14 w-full">
          <h2 className="mb-3 text-4xl font-bold">Change Password</h2>

          <p className="font-light text-gray-400 mb-8">
            Enter a new password to reset old one
          </p>

          <form className="flex flex-col gap-4">
            <div className="flex items-center border rounded-lg px-3 py-2">
              <CiLock className="text-green-500 text-xl mr-2" />
              <input
                type="password"
                placeholder="Old Password"
                className="flex-1 outline-none bg-transparent"
                // value={oldPassword}
                // onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center border rounded-lg px-3 py-2">
              <CiLock className="text-green-500 text-xl mr-2" />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 outline-none bg-transparent"
                // value={newPassword}
                // onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center border rounded-lg px-3 py-2">
              <CiLock className="text-green-500 text-xl mr-2" />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="flex-1 outline-none bg-transparent"
                // value={confirmNewPassword}
                // onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
