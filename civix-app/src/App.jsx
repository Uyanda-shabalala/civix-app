import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AuthPage from "./pages/AuthPage";
import MyWard from "./pages/MyWard";
import Board from "./pages/Board";
import ReportIssue from "./pages/ReportIssue";
import ReviewSubmit from "./pages/ReviewSubmit";
import Confirmation from "./pages/Confirmation";
import MyReports from "./pages/MyReports";

function Root() {
  const { session, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={session ? "/ward" : "/"} replace />;
}

function AppRoutes() {
  // Shared draft state for the report → review → confirm flow
  const [draft, setDraft] = useState({});

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<Root />} />

      <Route
        path="/ward"
        element={
          <ProtectedRoute>
            <MyWard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/board"
        element={
          <ProtectedRoute>
            <Board />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MyReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <ReportIssue draft={draft} setDraft={setDraft} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/review"
        element={
          <ProtectedRoute>
            <ReviewSubmit draft={draft} setDraft={setDraft} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/confirmation/:id"
        element={
          <ProtectedRoute>
            <Confirmation />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
