// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ element: Component }) => {
  const isAuthenticated = !!Cookies.get("urs_login_token_key");

  return isAuthenticated ? Component : <Navigate to="/loginPage" replace />;
};

export default ProtectedRoute;
