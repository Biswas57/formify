import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (Fixed on large screens, hidden on small screens) */}
      <Sidebar />

      {/* Content Area with padding to prevent overlap */}
      <div className="flex-1 p-8 overflow-y-auto pl-74">
        <Outlet />
      </div>
    </div>
  );
}
