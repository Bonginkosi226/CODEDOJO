import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Frontend guard for the /admin section. This is only a convenience: every
// /api/admin route is also enforced on the server, so hiding pages here is
// never what protects the data.
const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
