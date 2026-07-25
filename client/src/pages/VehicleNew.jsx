import { useNavigate } from "react-router-dom";
import api from "../api";
import VehicleForm from "../components/VehicleForm";

export default function VehicleNew() {
  const navigate = useNavigate();

  async function handleSubmit(form) {
    await api.post("/vehicles", form);
    setTimeout(() => navigate("/dashboard"), 1200);
  }

  return (
    <div className="section-wrap max-w-2xl py-section">
      <h1 className="mb-gutter text-3xl">List your car</h1>
      <VehicleForm onSubmit={handleSubmit} submitLabel="Submit listing" />
    </div>
  );
}