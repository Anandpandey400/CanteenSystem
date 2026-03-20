import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  allowedRoles?: string[];
};

export default function RequireRole({ allowedRoles }: Props) {
  const { isAuthenticated, isLoading, role } = useAuth();

  // ⏳ wait until auth is restored
  if (isLoading) return null;

  // ❌ not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ❌ role not allowed
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    console.log("data", allowedRoles, role);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
