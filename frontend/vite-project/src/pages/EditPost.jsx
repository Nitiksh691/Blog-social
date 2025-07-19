import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../auth/authStore';
import axios from 'axios';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${id}`)
      .then((res) => {
        const { title, content, category, tags } = res.data;
        setForm({
          title,
          content,
          category,
          tags: tags?.join(', ') || '',
        });
      })
      .catch((err) => console.error('Error fetching post:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...form,
      tags: form.tags.split(',').map(tag => tag.trim()),
    };

    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Post updated.");
      navigate(`/post/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Post Title"
        required
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Post Content"
        required
        className="w-full border px-3 py-2 rounded mb-3"
        rows="6"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded mb-3"
      >
        <option value="">-- Select Category --</option>
        <option value="Technology">Technology</option>
        <option value="Health">Health</option>
        <option value="Travel">Travel</option>
        <option value="Education">Education</option>
        <option value="Finance">Finance</option>
        <option value="Lifestyle">Lifestyle</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Politics">Politics</option>
        <option value="Business">Business</option>
        <option value="Other">Other</option>
      </select>

      <input
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="Comma-separated tags (e.g., react,frontend)"
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Post
      </button>
    </form>
  );
};

export default EditPost;
