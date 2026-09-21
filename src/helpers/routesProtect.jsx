import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function PrivateRoute({ children, allowedRoles }) {
  const { authUser, authChecked } = useSelector((store) => store.auth);

  if (!authChecked) {
    return children;
  }

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
