import React from "react";
import { useEffect } from "react";
import { TbFileAnalytics } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { ArrowLeftRight, Banknote, Receipt, Wallet } from "lucide-react";
import { TbReport } from "react-icons/tb";
import { TbUsersPlus } from "react-icons/tb";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/features/authSlice";

export default function Sidebar() {
  const dispatch = useDispatch();

  const { authUser } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(getUser()); // automatically fetch user from cookie if valid
  }, [dispatch]);

  return (
    <>
      <div
        className="
         h-full w-full
         bg-[#0c1e2e] text-white
          border-r border-[#0c1e2e]
          p-4 flex flex-col py-6
          overflow-y-auto
      "
      >
        <div className="px-1">
          <p className="font-bold text-xl leading-snug">
            BITS
          </p>
          <p className="text-sm font-semibold mt-1 tracking-wide">
            Budget Implementation System
          </p>
        </div>

        <div className="border-b border-white/40 my-4"></div>

        <div className="flex min-h-0 flex-1 flex-col justify-evenly text-md font-semibold text-white cursor-pointer">
          <NavLink to="/dashboard" end>
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive
                    ? "bg-[#0f9b80] text-white rounded-lg"
                    : "text-white rounded-lg hover:bg-white/10"
                }`}
              >
                <span className="text-3xl">
                  <TbFileAnalytics />
                </span>
                <p>Analytics</p>
              </div>
            )}
          </NavLink>

          <NavLink to="/dashboard/revenue&cash/revenue">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive
                    ? "bg-[#0f9b80] text-white rounded-lg"
                    : "text-white rounded-lg hover:bg-white/10"
                }`}
              >
                <span className="text-3xl">
                  <Banknote />
                </span>
                <p>IGF Revenue Collection</p>
              </div>
            )}
          </NavLink>

          <NavLink to="/dashboard/revenue&cash/cash">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive
                    ? "bg-[#0f9b80] text-white rounded-lg"
                    : "text-white rounded-lg hover:bg-white/10"
                }`}
              >
                <span className="text-3xl">
                  <Wallet />
                </span>
                <p>Cash Position</p>
              </div>
            )}
          </NavLink>

          <NavLink to="/dashboard/budget&reallocation/budget">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive
                    ? "bg-[#0f9b80] text-white rounded-lg"
                    : "text-white rounded-lg hover:bg-white/10"
                }`}
              >
                <span className="text-3xl">
                  <Receipt />
                </span>
                <p>DADs Expenditure</p>
              </div>
            )}
          </NavLink>

          <NavLink to="/dashboard/budget&reallocation/reallocation">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive
                    ? "bg-[#0f9b80] text-white rounded-lg"
                    : "text-white rounded-lg hover:bg-white/10"
                }`}
              >
                <span className="text-3xl">
                  <ArrowLeftRight />
                </span>
                <p>Reallocation</p>
              </div>
            )}
          </NavLink>

          <NavLink to="/dashboard/reports">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive
                    ? "bg-[#0f9b80] text-white rounded-lg"
                    : "text-white rounded-lg hover:bg-white/10"
                }`}
              >
                <span className="text-3xl">
                  <TbReport />
                </span>
                <p>Reports</p>
              </div>
            )}
          </NavLink>

          {authUser?.role === "admin" && (
            <NavLink to="/dashboard/users">
              {({ isActive }) => (
                <div
                  className={`flex gap-2 items-center px-4 py-2 ${
                    isActive
                      ? "bg-[#0f9b80] text-white rounded-lg"
                      : "text-white rounded-lg hover:bg-white/10"
                  }`}
                >
                  <span className="text-3xl">
                    <TbUsersPlus />
                  </span>
                  <p>Console</p>
                </div>
              )}
            </NavLink>
          )}

          <NavLink to="/dashboard/settings">
            {({ isActive }) => (
              <div
                className={`flex gap-2 items-center px-4 py-2 ${
                  isActive
                    ? "bg-[#0f9b80] text-white rounded-lg"
                    : "text-white rounded-lg hover:bg-white/10"
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
      </div>

      {/* <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#16a34a",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
          },
          error: {
            style: { background: "#dc2626" },
          },
        }}
      /> */}
    </>
  );
}
