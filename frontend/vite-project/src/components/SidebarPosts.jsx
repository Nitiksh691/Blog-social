import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios.js';

const SidebarPosts = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendRes = await api.get('/posts/stats/trending?range=24h');
        const popRes = await api.get('/posts/stats/popular');
        setTrending(trendRes.data);
        setPopular(popRes.data);
      } catch (err) {
        console.error('Sidebar post fetch error:', err.message);
      }
    };

    fetchData();
  }, []);

  const renderPostCard = (post) => (
    <Link
      key={post._id}
      to={`/post/${post._id}`}
      className="block bg-gray-100 hover:bg-gray-200 rounded-lg p-3 mb-3 transition"
    >
      <div className="flex items-start gap-3">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-16 h-16 object-cover rounded-md"
          />
        )}
        <div>
          <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">{post.title}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.content}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <aside className="w-72 p-4 bg-white rounded shadow overflow-y-auto max-h-[90vh]">
      <h3 className="text-lg font-semibold mb-2">🔥 Trending</h3>
      {trending.map(renderPostCard)}

      <h3 className="text-lg font-semibold mt-6 mb-2">🌟 Popular</h3>
      {popular.map(renderPostCard)}
    </aside>
  );
};

export default SidebarPosts;
