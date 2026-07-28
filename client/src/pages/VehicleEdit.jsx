import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import VehicleForm from "../components/VehicleForm";
import LoadingSpinner from "../components/LoadingSpinner";

export default function VehicleEdit() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    api
      .get(`/vehicles/${id}`)
      .then((res) => {
        if (res.data.owner_id !== user?.id) {
          setForbidden(true);
        } else {
          setVehicle(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  async function handleSubmit(form) {
    await api.put(`/vehicles/${id}`, form);
    setTimeout(() => navigate("/dashboard"), 1000);
  }

  if (loading) return <LoadingSpinner label="Loading listing..." />;
  if (forbidden) return <p className="section-wrap py-section text-brand-navy/60">You don't own this listing.</p>;

  return (
    <div className="section-wrap max-w-2xl py-section">
      <h1 className="mb-gutter text-3xl">Edit listing</h1>
      <VehicleForm initialData={vehicle} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  );
}