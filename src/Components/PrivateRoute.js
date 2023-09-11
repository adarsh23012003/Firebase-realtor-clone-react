import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthState } from "../Hooks/useAuthState";
import LoadingIcon from "./UI/LoadingIcon";

function PrivateRoute() {
  const { isLogin, isLoading } = useAuthState();
  if (isLoading) {
    return <LoadingIcon />;
  }
  return isLogin ? <Outlet /> : <Navigate to='/sign-in' />;
}

export default PrivateRoute;
