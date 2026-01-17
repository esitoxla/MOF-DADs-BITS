import React from "react";
import { User, Mail, Phone } from "lucide-react";
import { useState, useRef } from "react";
import { useEffect } from "react";
import profile from "../assets/images/profile.1.png";
import { useSelector, useDispatch } from "react-redux";
import {
  uploadAvatar,
  removeProfilePic,
} from "../store/features/authSlice";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

export default function Accounts() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { authUser, loading } = useSelector((store) => store.auth);

  const [preview, setPreview] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const hasAvatar = !!authUser?.avatarUrl;

  //Decide which image to show
  const avatarSrc = preview || authUser?.avatarUrl || profile; // fallback default image

  const removeAvatar = () => {
    setShowMenu(false);
    dispatch(removeProfilePic()).unwrap(); // backend PATCH
    toast.success("Profile picture removed!");
  };

  //Handles file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file");
    }

    // show preview immediately
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await dispatch(uploadAvatar(formData)).unwrap();
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err);
      setPreview(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 w-full bg-white">
        <div className="md:w-1/3 p-8 ">
          <div className="relative inline-block">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border border-gray-300">
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hidden input */}
            <input
              ref={fileInputRef}
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Upload / Change button */}

            <button
              onClick={() => setShowMenu((prev) => !prev)}
              disabled={loading}
              className="cursor-pointer px-4 py-2 mt-4 ml-4 bg-green-600 text-white font-medium rounded-md hover:opacity-90"
            >
              Edit Profile
            </button>

            {/* Dropdown – only if user already has avatar */}
            {showMenu && (
              <div className="relative mt-2 w-44 bg-white border-2 border-green-50 rounded-lg shadow-lg z-50">
                {/* Always show upload/change */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    fileInputRef.current.click();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-green-100"
                >
                  {hasAvatar ? "Change profile" : "Upload profile"}
                </button>

                {/* Show remove ONLY if user already has avatar */}
                {hasAvatar && (
                  <button
                    onClick={removeAvatar}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Remove profile
                  </button>
                )}
              </div>
            )}
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
                  defaultValue={authUser?.name || ""}
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
                  defaultValue={authUser?.email || ""}
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
                  defaultValue={authUser?.designation || ""}
                  //   onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Designation"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Sidebar preview={preview} />
    </div>
  );
}
