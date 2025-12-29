import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // We will build this next!
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // 1. While checking if the user is logged in, show a loader
  if (loading) {
    return <Loader />;
  }

  // 2. If finished checking and NO user is found, kick them to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If user exists, let them see the page (render the children)
  return children;
};

export default ProtectedRoute;