import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function PrivateRoute({ children, allowedRoles }) {
  const { authUser, authChecked, loading } = useSelector((store) => store.auth);

  // Wait ONLY until auth is checked
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  //After check, block dashboard if logged out
  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}



export const PublicRoute = ({ children }) => {
  const { authUser } = useSelector((store) => store.auth);

  // If user is logged in, redirect them away from login/register
  return !authUser ? children : <Navigate to="/dashboard" replace />;
};
