import { useEffect, useState } from "react";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
export default function AdminDriverApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  function load() {
    setLoading(true);
    api.get("/admin/driver-applications", {
      params: {
        page
      }
    }).then(res => {
      setApplications(res.data.applications);
      setTotalPages(res.data.total_pages);
    }).finally(() => setLoading(false));
  }
  useEffect(load, [page]);
  async function setStatus(id, status) {
    await api.put(`/admin/driver-applications/${id}`, {
      status
    });
    load();
  }
  async function downloadCv(id, filename) {
    const res = await api.get(`/admin/driver-applications/${id}/cv`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "cv";
    link.click();
    window.URL.revokeObjectURL(url);
  }
  const statusStyle = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-700"
  };
  if (loading) return <LoadingSpinner label="Loading applications..." />;
  return <div className="section-wrap py-section">
      <h1 className="mb-gutter-lg text-3xl">Chauffeur applications</h1>

      {applications.length === 0 ? <div className="card p-section text-center text-brand-navy/60">No applications yet.</div> : <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-navy/5 text-xs uppercase text-brand-navy/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">License</th>
                <th className="px-4 py-3">Wants to drive</th>
                <th className="px-4 py-3">CV</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy/10">
              {applications.map(a => <tr key={a.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{a.full_name}</p>
                    <p className="text-xs text-brand-navy/50">ID: {a.id_number}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{a.email}</p>
                    <p className="text-xs text-brand-navy/50">{a.phone}</p>
                  </td>
                  <td className="px-4 py-3">{a.license_number}</td>
                  <td className="px-4 py-3">{a.preferred_category}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => downloadCv(a.id, a.cv_original_name)} className="text-accent hover:underline">
                      Download
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="space-x-2 px-4 py-3">
                    {a.status !== "approved" && <button onClick={() => setStatus(a.id, "approved")} className="text-accent hover:underline">Approve</button>}
                    {a.status !== "rejected" && <button onClick={() => setStatus(a.id, "rejected")} className="text-red-600 hover:underline">Reject</button>}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}

      {totalPages > 1 && <div className="mt-gutter flex items-center justify-center gap-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn-secondary py-2 text-sm disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm text-brand-navy/60">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-secondary py-2 text-sm disabled:opacity-40">
            Next
          </button>
        </div>}

      <p className="mt-gutter text-xs text-brand-navy/50">
        Approving an application here doesn't automatically add them as a bookable chauffeur -
        add them to the Driver table (server/seed.py or a future /drivers admin form) once
        you've set their rate.
      </p>
    </div>;
}
