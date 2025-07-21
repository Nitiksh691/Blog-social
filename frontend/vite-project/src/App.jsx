import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import CreatePost from './pages/CreatePost.jsx';
import ViewPost from './pages/ViewPost.jsx';
import EditPost from './pages/EditPost.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import useAuthStore from './auth/authStore.jsx';
import AdminUsers from './pages/AdminUsers.jsx';

import ShortPostCreate from './pages/CreateShortPost.jsx';
import CreateShortPost from './pages/CreateShortPost.jsx';


import ShortPostList from './pages/ShortPostList';
import ShortPostDetail from './pages/ShortPostDetail';
const App = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <Router>
      <Navbar />
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<ViewPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/shortpost/create" element={<CreateShortPost />} />
        <Route path='/shortposts' element={<ShortPostList/>}  />

<Route path="/shortposts" element={<ShortPostList />} />
<Route path="/shortposts/:id" element={<ShortPostDetail />} />


        <Route
          path="/shortpost/create"
          element={
            <ProtectedRoute>
              <ShortPostCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/users/all"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<div className="p-4 text-center text-xl">404 - Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
};

export default App;
