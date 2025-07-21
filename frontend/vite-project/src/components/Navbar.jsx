import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../auth/authStore.jsx';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        {user && (
          <>
            <Link to="/create">Create Blog</Link>
            <Link to="/shortpost/create">Create Short Post</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/shortposts" className="hover:text-blue-500">
  All Short Posts
</Link>
          </>
        )}
        {user?.role === 'admin' && <Link to="/users/all">Admin Panel</Link>}
      </div>

      <div className="flex gap-4">
        {user ? (
          <button onClick={handleLogout} className="text-red-500">Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
