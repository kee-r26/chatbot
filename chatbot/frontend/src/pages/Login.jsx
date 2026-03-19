import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from "../api/apiClient";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post("/login", { username, password });
      const { token, role } = response.data;

      // Store token in cookies
      cookies.set("authToken", token, { path: "/" });

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#24243e]">
      {/* Login Card */}
      <div className="w-full max-w-md p-10 bg-[#303050] rounded-2xl shadow-2xl border border-white/5">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
          <p className="text-gray-400 text-sm">Please sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2 ml-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#404066] border border-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-[#4a4a7a] transition duration-200 disabled:opacity-50"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-[#404066] border border-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-[#4a4a7a] transition duration-200 disabled:opacity-50"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#6366f1] hover:bg-[#5558e6] text-white font-semibold rounded-lg shadow-lg transform active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition duration-200">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;