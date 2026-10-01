import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../config/axios";

function RealisticBell({ className = "w-6 h-6" }) {
  const rawId = useId().replace(/:/g, "");
  const bodyId = `bell-body-${rawId}`;
  const shineId = `bell-shine-${rawId}`;
  const rimId = `bell-rim-${rawId}`;

  return (
    <svg
      viewBox="8 4 48 56"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={bodyId} x1="18" y1="8" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="18%" stopColor="#ffe082" />
          <stop offset="48%" stopColor="#f5c518" />
          <stop offset="78%" stopColor="#e09a12" />
          <stop offset="100%" stopColor="#b8750a" />
        </linearGradient>
        <radialGradient id={shineId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) rotate(20) scale(14 18)">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={rimId} x1="12" y1="44" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="40%" stopColor="#f5c518" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>

      <path
        d="M32 5.5c-1.7 0-3 1.2-3 2.8v1.1C20.2 11 14 17.6 14 26.2V36l-4.2 6.2A3 3 0 0 0 12.3 47h39.4a3 3 0 0 0 2.5-4.8L50 36V26.2c0-8.6-6.2-15.2-15-16.8V8.3c0-1.6-1.3-2.8-3-2.8z"
        fill={`url(#${bodyId})`}
      />
      <path
        d="M24.5 18c-3.2 3.4-5 7.2-5.2 11.6"
        stroke="#fff8e7"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <ellipse cx="27" cy="24" rx="7" ry="9" fill={`url(#${shineId})`} />
      <path
        d="M12 44.5h40c1.4 0 2.2 1.5 1.4 2.7l-1.2 1.8c-.7 1-1.8 1.6-3 1.6H14.8c-1.2 0-2.3-.6-3-1.6l-1.2-1.8c-.8-1.2 0-2.7 1.4-2.7z"
        fill={`url(#${rimId})`}
      />
      <circle cx="32" cy="54.5" r="3.4" fill="#a16207" />
      <circle cx="31" cy="53.4" r="1.1" fill="#ffe9a8" />
    </svg>
  );
}


const routeMap = {
  revenue: "/dashboard/revenue&cash/revenue",
  cash: "/dashboard/revenue&cash/cash",
  expenditure: "/dashboard/budget&reallocation/budget",
  reallocation: "/dashboard/budget&reallocation/reallocation",
};

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const intervals = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markAsRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    setOpen(false);
    const basePath = routeMap[notification.entityType];
    if (basePath) {
      navigate(`${basePath}?highlight=${notification.entityId}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-green-50 transition-colors"
        aria-label="Notifications"
      >
        <span className="relative inline-flex h-7 w-7">
          <RealisticBell className="h-7 w-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-yellow-600 px-0.5 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <RealisticBell className="w-5 h-5" />
              <span className="font-semibold text-gray-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">
                You're all caught up
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-green-50 transition-colors flex items-start gap-2 ${
                    !n.isRead ? "bg-green-50/50" : ""
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <span className="text-xs text-gray-400">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-green-600 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
