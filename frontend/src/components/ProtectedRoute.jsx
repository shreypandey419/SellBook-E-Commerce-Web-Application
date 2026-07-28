import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../api/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
