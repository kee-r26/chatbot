import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// ✅ Prevent logged-in users from accessing login
const PublicRoute = ({ children }) => {
  const cookies = new Cookies();
  const token = cookies.get("authToken");

  if (token) {
    try {
      const decoded = jwtDecode(token);

      return (
        <Navigate
          to={
            decoded.role === "admin"
              ? "/admin-dashboard"
              : "/student-dashboard"
          }
          replace
        />
      );
    } catch {
      return children;
    }
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              {({ isAuthorized }) =>
                isAuthorized ? (
                  <AdminDashboard />
                ) : (
                  <StudentDashboard showUnauthorized />
                )
              }
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              {({ isAuthorized }) =>
                isAuthorized ? (
                  <StudentDashboard />
                ) : (
                  <AdminDashboard />
                )
              }
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;