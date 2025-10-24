import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/features/authSlice";
import { useEffect } from "react";
import { Navigate } from "react-router";

export default function PrivateRoute({ children, allowedRoles }) {
  const { authUser, loading, error } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  // Check if user is logged in
  if (!authUser) return <Navigate to="/" replace />;

  // Check role authorization
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
