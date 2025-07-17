import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
