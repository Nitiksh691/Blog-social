import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../auth/authStore';

const categoryOptions = [
  "Technology",
  "Health",
  "Travel",
  "Education",
  "Finance",
  "Lifestyle",
  "Entertainment",
  "Politics",
  "Business",
  "Other"
];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert("Title, content, and category are required");
      return;
    }

    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/posts',
        {
          title,
          content,
          category,
          tags: tagsArray
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log('Post created:', response.data);
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full border px-3 py-2 rounded h-40"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Category --</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. react, javascript, frontend"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
