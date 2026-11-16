import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Bell, Volume2, VolumeX, X } from "lucide-react";
import { api } from "../config/axios";

const MUTE_KEY = "notifications:muted";
const POLL_MS = 45000;

let audioContext;
let chimeArmed = false;

function playNotificationSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;

  if (!audioContext) audioContext = new AudioCtx();
  if (audioContext.state === "suspended") return false;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, now);
  oscillator.frequency.exponentialRampToValueAtTime(660, now + 0.12);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.34);
  return true;
}

function requestNotificationSound() {
  if (playNotificationSound() || chimeArmed) return;

  chimeArmed = true;
  const unlock = () => {
    chimeArmed = false;
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
    const resume = audioContext?.resume() ?? Promise.resolve();
    resume
      .then(() => {
        if (localStorage.getItem(MUTE_KEY) === "1") return;
        playNotificationSound();
      })
      .catch(() => {});
  };

  window.addEventListener("pointerdown", unlock, true);
  window.addEventListener("keydown", unlock, true);
}

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

const APPROVAL_LISTS = ["/revenue", "/cash", "/expense", "/reallocation"];

export default function NotificationBell() {
  const role = useSelector((state) => state.auth.authUser?.role);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [attention, setAttention] = useState(null);
  const [muted, setMuted] = useState(
    () => localStorage.getItem(MUTE_KEY) === "1",
  );
  const dropdownRef = useRef(null);
  const unreadRef = useRef(null);
  const mutedRef = useRef(muted);
  const loginChimeRef = useRef(false);
  const attentionKindRef = useRef(null);
  const navigate = useNavigate();

  const dismissAttention = () => {
    attentionKindRef.current = null;
    setAttention(null);
  };

  const drawAttention = ({ title, detail, login = false, kind = "updates" }) => {
    if (attentionKindRef.current === "approval" && kind !== "approval") return;
    attentionKindRef.current = kind;
    setAttention({ title, detail });
    if (mutedRef.current) return;
    if (login) {
      if (loginChimeRef.current) return;
      loginChimeRef.current = true;
    }
    requestNotificationSound();
  };

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      const nextUnread = data.unreadCount ?? 0;
      const isFirstLoad = unreadRef.current === null;
      const hasNewUnread = !isFirstLoad && nextUnread > unreadRef.current;
      if (isFirstLoad && nextUnread > 0) {
        const latest = (data.data ?? []).find((item) => !item.isRead);
        drawAttention({
          login: true,
          title:
            nextUnread === 1
              ? "1 update is waiting for you"
              : `${nextUnread} updates are waiting for you`,
          detail: latest?.message || "Open the bell to see what came in.",
        });
      } else if (hasNewUnread) {
        const latest = (data.data ?? []).find((item) => !item.isRead);
        drawAttention({
          title: "Something new just came in",
          detail: latest?.message || "Open the bell to see it.",
        });
      }
      unreadRef.current = nextUnread;
      setNotifications(data.data);
      setUnreadCount(nextUnread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (role !== "approver") return undefined;

    let cancelled = false;
    (async () => {
      try {
        const responses = await Promise.all(
          APPROVAL_LISTS.map((path) => api.get(path)),
        );
        const waitingCount = responses.reduce((sum, { data }) => {
          const records = data?.data ?? [];
          return (
            sum + records.filter((record) => record.status === "Reviewed").length
          );
        }, 0);
        if (!cancelled && waitingCount > 0) {
          drawAttention({
            login: true,
            kind: "approval",
            title:
              waitingCount === 1
                ? "1 record needs your approval"
                : `${waitingCount} records need your approval`,
            detail: "Reviewed records are ready. Open the bell to take them.",
          });
        }
      } catch (err) {
        console.error("Failed to check records waiting for approval:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [role]);

  useEffect(() => {
    fetchNotifications();
    const pollId = window.setInterval(fetchNotifications, POLL_MS);
    window.addEventListener("notifications:refresh", fetchNotifications);
    return () => {
      window.clearInterval(pollId);
      window.removeEventListener("notifications:refresh", fetchNotifications);
    };
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
    unreadRef.current = 0;
  };

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadCount((prev) => {
        const next = Math.max(0, prev - 1);
        unreadRef.current = next;
        return next;
      });
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
            dismissAttention();
            return !prev;
          })
        }
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-amber-50 dark:hover:bg-white/10 ${
          attention ? "text-[#f97316]" : "text-[#e8b931]"
        }`}
        aria-label="Notifications"
      >
        {attention && (
          <span className="absolute inset-0 animate-ping rounded-xl bg-[#f97316]/30" />
        )}
        <Bell
          className={`relative h-5 w-5 ${attention ? "bell-wiggle" : ""}`}
          strokeWidth={1.75}
        />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#f97316] px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {attention && !open && (
        <div
          role="status"
          className="attention-pop absolute right-0 top-12 z-50 w-72 rounded-2xl border border-[#f6c453] bg-white p-4 shadow-[0_16px_40px_rgba(249,115,22,0.28)] dark:border-[#39FF88]/40 dark:bg-[#121b36]"
        >
          <span className="absolute -top-1.5 right-4 h-3 w-3 rotate-45 border-l border-t border-[#f6c453] bg-white dark:border-[#39FF88]/40 dark:bg-[#121b36]" />
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff4df] text-[#f97316] dark:bg-[#39FF88]/15 dark:text-[#39FF88]">
              <Bell className="h-4 w-4 bell-wiggle" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-[#e8fff3]">
                {attention.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-[#8b9bb0]">
                {attention.detail}
              </p>
              <button
                type="button"
                onClick={() => {
                  dismissAttention();
                  setOpen(true);
                  fetchNotifications();
                }}
                className="mt-3 cursor-pointer rounded-lg bg-[#166534] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#14532d] dark:bg-[#39FF88] dark:text-[#0B132B] dark:hover:bg-[#2eeb78]"
              >
                Show me
              </button>
            </div>
            <button
              type="button"
              onClick={dismissAttention}
              aria-label="Dismiss"
              className="cursor-pointer rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-[#e8fff3]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                title={muted ? "Unmute notifications" : "Mute notifications"}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-[#8b9bb0] dark:hover:bg-white/10 dark:hover:text-[#e8fff3]"
                aria-label={muted ? "Unmute notifications" : "Mute notifications"}
              >
                {muted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-green-700 hover:text-green-800 font-medium dark:text-[#39FF88] dark:hover:text-[#2eeb78]"
                >
                  Mark all read
                </button>
              )}
            </div>
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
