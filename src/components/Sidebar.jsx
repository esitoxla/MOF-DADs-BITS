import React from "react";
import { useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { ArrowLeftRight, Banknote, ChartLine, Receipt, Wallet } from "lucide-react";
import { TbReport } from "react-icons/tb";
import { TbUsersPlus } from "react-icons/tb";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/features/authSlice";
import logo from "../assets/images/logo.jpeg";

function SidebarLink({ to, end, icon: Icon, children }) {
  return (
    <NavLink to={to} end={end} className="relative block">
      {({ isActive }) => (
        <>
          <span
            className={`pointer-events-none absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#89c05b] dark:bg-[#39FF88] ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          />
          <div
            className={`mx-3 flex h-9 items-center gap-2.5 rounded-full px-3 text-lg font-medium py-6 ${
              isActive
                ? "bg-[#2f5c4c] text-white dark:bg-[#39FF88] dark:text-[#0B132B]"
                : "text-white/75 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <Icon
              size={18}
              className={`shrink-0 ${
                isActive ? "text-[#89c05b] dark:text-[#0B132B]" : ""
              }`}
            />
            <span className="truncate">{children}</span>
          </div>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();

  const { authUser } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(getUser()); // automatically fetch user from cookie if valid
  }, [dispatch]);

  return (
    <>
      <div className="flex h-full w-full flex-col overflow-y-auto border-r border-[#0f4231] bg-[#0f4231] text-white dark:border-[#39FF88]/30 dark:bg-[#0B132B]">
        <div className="flex min-h-20 shrink-0 items-center gap-2.5 px-3 pt-6 pb-3">
          <img
            src={logo}
            alt="Republic of Ghana"
            className="h-10 w-auto shrink-0"
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[15px] font-bold tracking-wide">BITS</p>
            <p className="text-[11px] font-medium leading-snug text-white/80">
              Budget Implementation System
            </p>
          </div>
        </div>

        <div className="mx-4 border-b border-white/40 dark:border-[#39FF88]/40"></div>

        <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto py-10">
          <SidebarLink to="/dashboard" end icon={ChartLine}>
            Analytics
          </SidebarLink>
          <SidebarLink to="/dashboard/revenue&cash/revenue" icon={Banknote}>
            IGF Revenue Collection
          </SidebarLink>
          <SidebarLink to="/dashboard/revenue&cash/cash" icon={Wallet}>
            Cash Position
          </SidebarLink>
          <SidebarLink to="/dashboard/budget&reallocation/budget" icon={Receipt}>
            DADs Expenditure
          </SidebarLink>
          <SidebarLink
            to="/dashboard/budget&reallocation/reallocation"
            icon={ArrowLeftRight}
          >
            Reallocation
          </SidebarLink>
          <SidebarLink to="/dashboard/reports" icon={TbReport}>
            Reports
          </SidebarLink>
          {authUser?.role === "admin" && (
            <SidebarLink to="/dashboard/users" icon={TbUsersPlus}>
              Console
            </SidebarLink>
          )}
          <SidebarLink to="/dashboard/settings" icon={IoSettingsOutline}>
            Settings
          </SidebarLink>
        </nav>
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
