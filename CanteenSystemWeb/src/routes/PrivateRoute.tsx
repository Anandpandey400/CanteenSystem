import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullScreenLoader from "../components/FullScreenLoader";

type Props = {
  children: React.ReactNode;
  roles?: string[];
};

export default function PrivateRoute({ children, roles }: Props) {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
