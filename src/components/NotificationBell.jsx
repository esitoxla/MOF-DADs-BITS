import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Bell } from "lucide-react";
import { api } from "../config/axios";


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
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-green-50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-green-800" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-green-800" />
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
