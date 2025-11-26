import React from "react";
import AdminApproveVenues from "./AdminApproveVenues";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome Admin</h1>
      <p>This is the admin dashboard.</p>

      <AdminApproveVenues />
    </div>
  );
}
