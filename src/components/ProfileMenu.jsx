import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { BadgeCheck, ChevronDown, LogOut } from "lucide-react";
import { getUser, logoutUser } from "../store/features/authSlice";

const roleLabels = {
  admin: "Admin",
  data_entry: "Data entry",
  approver: "Approver",
  reviewer: "Reviewer",
};

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authUser } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nameParts = (authUser?.name || "").trim().split(/\s+/).filter(Boolean);
  const initials =
    nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : (nameParts[0]?.[0] || "?").toUpperCase();

  const roleLabel =
    authUser?.designation || roleLabels[authUser?.role] || "User";

  const openSettings = () => {
    setOpen(false);
    navigate("/dashboard/settings");
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    setOpen(false);
    dispatch(logoutUser());
    navigate("/", { replace: true });
    toast.success("Logout successful");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl py-1 pl-1 pr-1 hover:bg-gray-50 dark:hover:bg-white/10"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#166534] text-sm font-semibold text-white dark:bg-[#39FF88] dark:text-[#0B132B]">
          {initials}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-[9.5rem] truncate text-sm font-semibold leading-tight text-gray-900 dark:text-white">
            {authUser?.name || "Account"}
          </span>
          <span className="block max-w-[9.5rem] truncate text-xs leading-tight text-gray-500 dark:text-gray-400">
            {roleLabel}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 dark:border-[#39FF88]/30 dark:bg-[#121b36]">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-[#39FF88]/20">
            <p className="text-lg font-semibold text-gray-900 dark:text-[#e8fff3]">{authUser?.name}</p>
            {authUser?.designation ? (
              <p className="text-sm text-gray-500 mt-0.5 dark:text-[#a9b8c9]">
                {authUser.designation}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={openSettings}
            className="w-full text-lg flex items-center gap-2 text-left px-4 py-2.5 text-gray-800 hover:bg-gray-50 dark:text-[#e8fff3] dark:hover:bg-[#39FF88]/10"
          >
            <BadgeCheck size={20} />
            Account
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-left px-4 py-2.5 ext-lg text-gray-800 hover:bg-gray-50 rounded-b-lg dark:text-[#e8fff3] dark:hover:bg-[#39FF88]/10"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
