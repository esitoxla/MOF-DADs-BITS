import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Bell } from "lucide-react";
import { api } from "../config/axios";


export function refreshNotifications() {
  window.dispatchEvent(new Event("notifications:refresh"));
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
    window.addEventListener("notifications:refresh", fetchNotifications);
    return () =>
      window.removeEventListener("notifications:refresh", fetchNotifications);
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
        onClick={() =>
          setOpen((prev) => {
            if (!prev) fetchNotifications();
            return !prev;
          })
        }
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#e8b931] transition-colors hover:bg-amber-50 dark:hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#f97316] px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 z-50 dark:border-[#39FF88]/30 dark:bg-[#121b36]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#39FF88]/20">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#e8b931] dark:text-[#39FF88]" strokeWidth={1.75} />
              <span className="font-semibold text-gray-800 dark:text-[#e8fff3]">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5 dark:bg-[#39FF88] dark:text-[#0B132B]">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-green-700 hover:text-green-800 font-medium dark:text-[#39FF88] dark:hover:text-[#2eeb78]"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8 dark:text-[#8b9bb0]">
                You're all caught up
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-green-50 transition-colors flex items-start gap-2 dark:border-[#39FF88]/15 dark:hover:bg-[#39FF88]/10 ${
                    !n.isRead ? "bg-green-50/50 dark:bg-[#39FF88]/10" : ""
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-[#e8fff3]">{n.message}</p>
                    <span className="text-xs text-gray-400 dark:text-[#8b9bb0]">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-green-600 flex-shrink-0 dark:bg-[#39FF88]" />
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
