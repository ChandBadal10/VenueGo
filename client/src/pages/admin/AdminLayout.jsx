import React from 'react'
import AdminDashboard from './AdminDashboard';

const AdminLayout = ({children}) => {
  return (
    <div>
    <AdminDashboard />
    {children}
    </div>
  )
}

export default AdminLayout