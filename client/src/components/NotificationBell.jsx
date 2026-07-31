import { useEffect, useRef, useState } from "react";
import api from "../api";

function timeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const ref = useRef(null);

  function toggleExpanded(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  }

  function load() {
    api.get("/notifications").then(res => {
      setItems(res.data.notifications);
      setUnreadCount(res.data.unread_count);
    }).catch(() => {});
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      await api.put("/notifications/read-all").catch(() => {});
      setUnreadCount(0);
      setItems(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.66V5a2 2 0 10-4 0v.34A6 6 0 006 11v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 overflow-hidden rounded-card bg-white text-brand-navy shadow-card">
          <div className="border-b border-brand-navy/10 px-4 py-2.5 text-sm font-semibold">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-brand-navy/50">No notifications yet.</p>
            ) : (
              items.map(n => {
                const isReceipt = n.type === "receipt";
                const isExpanded = expandedIds.has(n.id);
                return <div key={n.id} className={`border-b border-brand-navy/5 px-4 py-3 text-sm last:border-0 ${!n.is_read ? "bg-accent/5" : ""}`}>
                  <p className="font-medium">{n.title}</p>
                  {isReceipt && !isExpanded ? (
                    <button type="button" onClick={() => toggleExpanded(n.id)} className="mt-0.5 text-xs font-medium text-accent hover:underline">
                      View receipt
                    </button>
                  ) : (
                    <p className={`mt-0.5 whitespace-pre-line text-brand-navy/60 ${isReceipt ? "font-mono text-xs" : ""}`}>{n.message}</p>
                  )}
                  {isReceipt && isExpanded && <button type="button" onClick={() => toggleExpanded(n.id)} className="mt-1 text-xs font-medium text-accent hover:underline">
                      Collapse
                    </button>}
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-brand-navy/40">
                    <span>{timeAgo(n.created_at)}</span>
                    {n.simulated_email_sent && <span>&middot; Emailed</span>}
                    {n.simulated_sms_sent && <span>&middot; SMS sent</span>}
                  </div>
                </div>;
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
