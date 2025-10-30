import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute
 * Props:
 * - allowedRoles: array of roles allowed (e.g. ['admin'])
 * - children: react node to render when allowed
 */
function ProtectedRoute({ allowedRoles = [], children }) {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return <Navigate to="/login" replace />;
    const user = JSON.parse(raw);
    if (!allowedRoles || allowedRoles.length === 0) return children;
    if (allowedRoles.includes(user.role)) return children;
    return <Navigate to="/" replace />;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
