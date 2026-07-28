import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import VehicleCard from "../components/VehicleCard";
import SearchFilter from "../components/SearchFilter";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCompare } from "../context/CompareContext";

export default function VehiclesBrowse() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const { compareIds, clearCompare } = useCompare();

  function fetchVehicles(params = {}, targetPage = 1) {
    setLoading(true);
    api
      .get("/vehicles", { params: { ...params, page: targetPage } })
      .then((res) => {
        setVehicles(res.data.vehicles);
        setTotalPages(res.data.total_pages);
      })
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }

  function handleFilter(params) {
    setFilters(params);
    setPage(1);
    fetchVehicles(params, 1);
  }

  useEffect(() => {
    fetchVehicles(filters, page);
  }, [page]);

  return (
    <div className={`section-wrap py-section ${compareIds.length > 0 ? "pb-28" : ""}`}>
      <h1 className="mb-gutter-lg text-3xl">Browse cars</h1>

      <div className="grid gap-gutter lg:grid-cols-[340px_1fr]">
        <aside>
          <SearchFilter onFilter={handleFilter} />
        </aside>

        <div>
          {loading ? (
            <LoadingSpinner label="Loading cars..." />
          ) : vehicles.length === 0 ? (
            <div className="card p-section text-center text-brand-navy/60">No cars found.</div>
          ) : (
            <div className="grid gap-gutter sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-gutter flex items-center justify-center gap-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn-secondary py-2 text-sm disabled:opacity-40">
                Previous
              </button>
              <span className="text-sm text-brand-navy/60">Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-secondary py-2 text-sm disabled:opacity-40">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {compareIds.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-navy/10 bg-white/95 shadow-card backdrop-blur">
          <div className="section-wrap flex items-center justify-between gap-gutter py-3">
            <p className="text-sm font-medium text-brand-navy">
              {compareIds.length} car{compareIds.length > 1 ? "s" : ""} selected to compare
            </p>
            <div className="flex gap-3">
              <button onClick={clearCompare} className="btn-secondary py-2">Clear</button>
              <Link to="/compare" className="btn-primary py-2">Compare now</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}