import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "./PrivateRoute";

const PublicRoutes = lazy(() => import("./PublicRoutes"));
const DashboardRoutes = lazy(() => import("./DashboardRoutes"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

function RouteFallback() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />

        <Route
          path="/dashboard/*"
          element={
            <AdminRoute>
              <DashboardRoutes />
            </AdminRoute>
          }
        />

        <Route path="*" element={<ErrorPage code={404} />} />
      </Routes>
    </Suspense>
  );
}