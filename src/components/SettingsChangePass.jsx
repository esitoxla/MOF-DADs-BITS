import React from "react";
import { CiLock } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, logoutUser, resetPasswordState } from "../store/features/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";



export default function SettingsChangePass() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { loading, error, passwordChanged, authUser } = useSelector(
     (state) => state.auth
   );


   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmNewPassword, setConfirmNewPassword] = useState("");

   const [showOldPassword, setShowOldPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = (e) => {
      e.preventDefault();

      if (!oldPassword || !newPassword || !confirmNewPassword) {
        return toast.error("All fields are required");
      }

      if (newPassword !== confirmNewPassword) {
        return toast.error("Passwords do not match");
      }

      // if (newPassword.length < 8) {
      //   return toast.error("Password must be at least 8 characters");
      // }

      dispatch(changePassword({ oldPassword, newPassword }));
    };

    useEffect(() => {
      dispatch(resetPasswordState());
    }, [dispatch]);


    useEffect(() => {
      if (error) {
        toast.error(error);
      }

      if (passwordChanged) {
        toast.success("Password changed successfully. Please log in again.");
        dispatch(logoutUser());
        navigate("/", { replace: true });
      }
    }, [error, passwordChanged, dispatch, navigate]);

    if (!authUser) return null;

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full bg-white">
      <div className="md:w-1/3 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Change Password
        </h2>

        <p className="text-gray-600">Enter a new password to reset old one</p>
      </div>

      <div className="bg-white border border-gray-300 p-6 shadow rounded-md md:w-2/3 ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
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
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
                
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-2 py-2 rounded-lg hover:opacity-90 transition md:w-[30%]"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
