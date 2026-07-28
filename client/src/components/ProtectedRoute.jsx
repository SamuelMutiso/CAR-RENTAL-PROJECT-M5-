import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
export default function ProtectedRoute({
  children,
  requiredRole
}) {
  const {
    token,
    user,
    ready
  } = useAuth();
  const location = useLocation();
  if (!ready) {
    return <LoadingSpinner label="Loading..." />;
  }
  if (!token) {
    return <Navigate to="/login" state={{
      from: location
    }} replace />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}