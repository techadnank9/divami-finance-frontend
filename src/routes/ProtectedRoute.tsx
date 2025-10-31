import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('token');

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
