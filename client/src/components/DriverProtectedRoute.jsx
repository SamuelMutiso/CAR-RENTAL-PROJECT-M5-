import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function DriverProtectedRoute({
  children
}) {
  const {
    driverToken
  } = useAuth();
  if (!driverToken) {
    return <Navigate to="/driver-login" replace />;
  }
  return children;
}