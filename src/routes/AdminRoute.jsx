// src/routes/AdminRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { getToken, getSession } from '../lib/api';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const token = getToken();
  const user = getSession();

  if (!token || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/admin/forbidden" replace />;
  }

  return children;
}