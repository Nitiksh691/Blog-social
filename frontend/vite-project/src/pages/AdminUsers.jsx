import React, { useEffect, useState } from 'react';
import api from '../utils/axios.js'; // axios instance with baseURL set to /api

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users/all');
        console.log("API response:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
        alert('Error fetching users. Please try again later.');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Registered Users</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Registered On</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) ? (
            users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center text-red-500">Error: Invalid user data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
