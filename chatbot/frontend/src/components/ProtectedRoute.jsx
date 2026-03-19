import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";

const ProtectedRoute = ({ children, roles }) => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Check if the token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      return <Navigate to="/login" replace />;
    }

    // Check if the user has the required role
    if (roles && !roles.includes(decodedToken.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
