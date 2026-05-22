import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold hover:opacity-80 transition">
          📋 Task Manager
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="hover:opacity-80 transition">
            Dashboard
          </Link>
          <Link to="/projects" className="hover:opacity-80 transition">
            Projects
          </Link>

          <div className="flex items-center gap-4 border-l border-white pl-6">
            <span className="text-sm">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
