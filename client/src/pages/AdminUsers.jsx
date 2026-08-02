import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import usePolling from "../hooks/usePolling";
export default function AdminUsers() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  function load(showSpinner = true) {
    if (showSpinner) setLoading(true);
    api.get("/admin/users", {
      params: {
        page
      }
    }).then(res => {
      setUsers(res.data.users);
      setTotalPages(res.data.total_pages);
    }).finally(() => {
      if (showSpinner) setLoading(false);
    });
  }
  useEffect(() => load(), [page]);
  // Live-update: keeps this list current if another admin makes a change.
  usePolling(() => load(false), 5000);
  async function toggleBan(user) {
    try {
      await api.put(`/admin/users/${user.id}`, {
        is_banned: !user.is_banned
      });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not update user");
    }
  }
  async function remove(user) {
    if (!confirm(`Delete ${user.email}? This also deletes their listings and bookings.`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete user");
    }
  }
  if (loading) return <LoadingSpinner label="Loading users..." />;
  return <div className="section-wrap py-section">
      <h1 className="mb-gutter-lg text-3xl">Manage users</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-navy/5 text-xs uppercase text-brand-navy/60">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Banned</th>
              <th className="px-4 py-3">Listings</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/10">
            {users.map(u => {
              const isSelf = currentAdmin && u.id === currentAdmin.id;
              const isOwner = u.vehicle_count > 0;
              const protectedUser = isSelf || isOwner;
              return <tr key={u.id}>
                <td className="px-4 py-3">
                  {u.email}
                  {isSelf && <span className="ml-2 rounded-full bg-brand-navy/10 px-2 py-0.5 text-[11px] font-medium">You</span>}
                  {isOwner && !isSelf && <span className="ml-2 rounded-full bg-brand-navy/10 px-2 py-0.5 text-[11px] font-medium">Owner</span>}
                </td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">{u.is_banned ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{u.vehicle_count}</td>
                <td className="px-4 py-3">{u.booking_count}</td>
                <td className="space-x-2 px-4 py-3">
                  {!u.is_banned && protectedUser ? <span className="text-brand-navy/30">Protected</span> : <button onClick={() => toggleBan(u)} className="text-accent hover:underline">
                      {u.is_banned ? "Unban" : "Ban"}
                    </button>}
                  {!protectedUser && <button onClick={() => remove(u)} className="text-red-600 hover:underline">Delete</button>}
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && <div className="mt-gutter flex items-center justify-center gap-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn-secondary py-2 text-sm disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm text-brand-navy/60">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-secondary py-2 text-sm disabled:opacity-40">
            Next
          </button>
        </div>}
    </div>;
}
