import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { BadgeCheck, LogOut } from "lucide-react";
import { getUser, logoutUser } from "../store/features/authSlice";

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
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
          initials.length > 1 ? "text-sm" : ""
        }`}
        aria-label="Account menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-lg font-semibold text-gray-900">{authUser?.name}</p>
            {authUser?.designation ? (
              <p className="text-sm text-gray-500 mt-0.5">
                {authUser.designation}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={openSettings}
            className="w-full text-lg flex items-center gap-2 text-left px-4 py-2.5 text-gray-800 hover:bg-gray-50"
          >
            <BadgeCheck size={20} />
            Account
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 text-left px-4 py-2.5 ext-lg text-gray-800 hover:bg-gray-50 rounded-b-lg"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
