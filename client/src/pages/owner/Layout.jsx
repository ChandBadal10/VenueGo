import { Outlet } from "react-router-dom";
import NavBarOwner from "../../components/owner/NavBarOwner";
import Sidebar from "../../components/owner/Sidebar";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <NavBarOwner />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
