// src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../auth/authStore'; // path to your Zustand store

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const login = useAuthStore((state) => state.login); // Zustand login function

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      const { user, token } = res.data;
      login(user, token); // 🔥 auto login after registration
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
