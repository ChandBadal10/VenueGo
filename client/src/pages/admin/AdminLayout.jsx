import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/SidebarAdmin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    // ✅ h-screen + overflow-hidden locks the total height to the viewport
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* Navbar — fixed at top, never scrolls */}
      <AdminNavbar />

      {/* Sidebar + Content row */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — fixed height, never scrolls */}
        <AdminSidebar />

        {/* Main Content — only this scrolls */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;