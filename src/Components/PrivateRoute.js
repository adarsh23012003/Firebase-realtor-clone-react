import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthState } from "../Hooks/useAuthState";

function PrivateRoute() {
  const { isLogin, isLoading } = useAuthState();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isLogin ? <Outlet /> : <Navigate to='/sign-in' />;
}

export default PrivateRoute;
