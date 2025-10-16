import React from "react";
import { TbFileAnalytics } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FaSackDollar } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import { NavLink } from "react-router";
import { LogOut } from "lucide-react";
import profile from "../assets/images/profile.1.jpg";
import { useNavigate } from "react-router";

export default function Sidebar({ toggleSidebar }) {

  const navigate = useNavigate();

  return (
    <>
      <div
        className="
         fixed top-0 left-0
         bg-gradient-to-r from-green-700 to-green-500 text-white
          border-r border-gray-200
          w-68 p-4 h-screen flex flex-col gap-6 py-6
           z-50 overflow-y-auto
      "
      >
        {/* Close button (mobile only) */}
        <div className=" flex justify-end">
          <button onClick={toggleSidebar} className="text-3xl text-white">
            <MdClose />
          </button>
        </div>

        <div className="flex gap-2 sm:gap-4 items-center">
          <div>
            <img
              src={profile}
              alt="Profile"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full"
            />
          </div>

          <div className="sm:block">
            <p className="font-medium">Nkumin Asaa Osei</p>
            <p>Budget Analyst</p>
          </div>
        </div>

        <div className="border-b p-0 border-gray-200 py-2"></div>

        <div className="flex flex-col gap-6 text-white cursor-pointer pt-4 py-2">
          <NavLink to="/dashboard" end>
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive ? "bg-green-50 text-gray-700 rounded" : "text-white"
                }`}
              >
                <span className="text-3xl">
                  <TbFileAnalytics />
                </span>
                <p>Analytics</p>
              </div>
            )}
          </NavLink>

          <NavLink to="budget">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive ? "bg-green-50 text-gray-700 rounded" : "text-white"
                }`}
              >
                <span className="text-3xl">
                  <FaSackDollar />
                </span>
                <p>Budget Expenditure</p>
              </div>
            )}
          </NavLink>

          <NavLink to="reports">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive ? "bg-green-50 text-gray-700 rounded" : "text-white"
                }`}
              >
                <span className="text-3xl">
                  <TbReport />
                </span>
                <p>Reports</p>
              </div>
            )}
          </NavLink>

          <NavLink to="/dashboard/settings">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive ? "bg-green-50 text-gray-700 rounded" : "text-white"
                }`}
              >
                <span className="text-3xl">
                  <IoSettingsOutline />
                </span>
                <p>Settings</p>
              </div>
            )}
          </NavLink>
        </div>

        <ul className="">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer font-medium bg-green-200 text-red-700 px-4 py-2 rounded">
            <LogOut size={18} /> Log Out
          </button>
        </ul>
      </div>
    </>
  );
}
