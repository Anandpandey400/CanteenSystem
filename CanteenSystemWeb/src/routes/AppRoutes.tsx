import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./route.config";
import DashboardLayout from "../layouts/DashboardLayout";
import FullScreenLoader from "../components/FullScreenLoader";
import NotFound from "../Pages/Auth/NotFound";
import RequireRole from "./RequireRole";

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* 🌍 Public routes */}
        {routes
          .filter((r) => !r.isPrivate)
          .map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}

        {/* 🔐 Private routes */}
        {routes
          .filter((r) => r.isPrivate)
          .map(({ path, element: Element, roles }) => (
            <Route key={path} element={<RequireRole allowedRoles={roles} />}>
              <Route element={<DashboardLayout />}>
                <Route path={path} element={<Element />} />
              </Route>
            </Route>
          ))}

        {/* ❌ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
