import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../auth/authStore';
import api from '../utils/axios';

const CreateShortPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [type, setType] = useState('public');
  const [media, setMedia] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('hashtag', hashtag);
    formData.append('type', type);
    if (media) formData.append('media', media);

    try {
      const res = await api.post('/shortposts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Post created:', res.data);
      navigate('/shortposts');
    } catch (err) {
      console.error('Failed to create post:', err);
      alert(err?.response?.data?.message || 'Error creating short post');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Short Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" className="w-full p-2 border" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="What's on your mind?" className="w-full p-2 border" value={content} onChange={(e) => setContent(e.target.value)} />
        <input type="text" placeholder="#hashtag" className="w-full p-2 border" value={hashtag} onChange={(e) => setHashtag(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <input type="file" accept="image/*,video/*" className="w-full p-2" onChange={(e) => setMedia(e.target.files[0])} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
      </form>
    </div>
  );
};

export default CreateShortPost;
