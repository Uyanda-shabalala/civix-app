import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-brand-muted text-sm">Loading…</div>;
  }
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return children;
}
