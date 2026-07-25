import { useEffect, useState } from "react";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  function load() {
    setLoading(true);
    api.get("/admin/contact-messages").then(res => setMessages(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function markRead(id, isRead) {
    await api.put(`/admin/contact-messages/${id}`, {
      is_read: isRead
    });
    load();
  }
  async function remove(id) {
    await api.delete(`/admin/contact-messages/${id}`);
    load();
  }
  if (loading) return <LoadingSpinner label="Loading messages..." />;
  const unreadCount = messages.filter(m => !m.is_read).length;
  return <div className="section-wrap py-section">
      <h1 className="mb-gutter-lg text-3xl">
        Contact messages
        {unreadCount > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-semibold text-amber-800">
            {unreadCount} unread
          </span>}
      </h1>

      {messages.length === 0 ? <div className="card p-section text-center text-brand-navy/60">No messages yet.</div> : <div className="space-y-gutter">
          {messages.map(m => <div key={m.id} className={`card p-gutter ${m.is_read ? "" : "border-l-4 border-accent"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{m.full_name}</p>
                  <p className="text-sm text-brand-navy/60">{m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-brand-navy/50">{new Date(m.created_at).toLocaleString()}</span>
                  <button onClick={() => markRead(m.id, !m.is_read)} className="text-accent hover:underline">
                    {m.is_read ? "Mark unread" : "Mark read"}
                  </button>
                  <button onClick={() => remove(m.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-brand-navy/80">{m.message}</p>
            </div>)}
        </div>}
    </div>;
}
