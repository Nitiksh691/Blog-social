// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../auth/authStore.jsx';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/author', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
        if (err.response?.status === 401) navigate('/login');
      }
    };

    fetchDashboard();
  }, [token, navigate]);

  if (!stats) return <p className="text-center text-gray-500 mt-10">Loading dashboard...</p>;

  // Format for chart
  const chartData = stats.monthlyStats.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    views: item.views,
    posts: item.posts,
  }));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Your Blog Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatBox label="Total Posts" value={stats.totalPosts} />
        <StatBox label="Total Views" value={stats.totalViews} />
        <StatBox label="Total Likes" value={stats.totalLikes} />
        <StatBox label="Total Comments" value={stats.totalComments} />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">📈 Monthly Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="posts" fill="#3b82f6" name="Posts" />
            <Bar dataKey="views" fill="#facc15" name="Views" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatBox = ({ label, value }) => (
  <div className="bg-white p-4 shadow rounded-lg text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default Dashboard;
