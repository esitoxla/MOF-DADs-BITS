import React from 'react'
import { User, Mail, Phone } from "lucide-react";
import { useState } from 'react';
import { useEffect } from 'react';
import profile from "../assets/images/profile.1.png";
import { useSelector } from 'react-redux';

export default function Accounts() {

    const { authUser } = useSelector((store) => store.auth);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 w-full bg-white">
        <div className="md:w-1/3 p-8 ">
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
              className="px-3 py-2 ml-4 mt-6 bg-green-600 text-white font-medium rounded-md hover:text-sm cursor-pointer"
            >
              Upload Picture
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-6 shadow rounded-md md:w-2/3 ">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={authUser?.name}
                  //   onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={authUser?.email}
                  //   onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg "
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Designation
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={authUser?.designation}
                  //   onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Designation"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
