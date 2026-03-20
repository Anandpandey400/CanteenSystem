import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AdminTabs from "../components/AdminTabs";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* <div className="px-6 py-4">
        <AdminTabs />
      </div> */}
      {/* Main content */}
      <main className="flex-1 p-2 overflow-auto px-6 pb-10 ">
        <Outlet />
      </main>
    </div>
  );
}
