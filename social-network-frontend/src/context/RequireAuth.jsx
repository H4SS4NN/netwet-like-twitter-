
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const RequireAuth = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
