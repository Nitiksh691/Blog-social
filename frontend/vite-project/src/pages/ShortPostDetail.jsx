import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ShortPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch the specific short post
    axios.get(`http://localhost:5000/api/shortposts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error('Error fetching post:', err));

    // Add view count
    axios.put(`http://localhost:5000/api/shortposts/${id}/views`)
      .catch(err => console.error('Failed to update views', err));
  }, [id]);

  if (!post) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="border rounded shadow-lg p-4">
        <h2 className="text-lg font-semibold">{post.hashtag}</h2>
        {post.mediaType === 'image' ? (
          <img src={`http://localhost:5000/${post.media}`} alt="post" className="w-full mt-2 rounded" />
        ) : (
          <video controls className="w-full mt-2 rounded">
            <source src={`http://localhost:5000/${post.media}`} type="video/mp4" />
          </video>
        )}
        <div className="text-sm text-gray-600 mt-2">
          👁️ {post.views} views &nbsp;·&nbsp; 📅 {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ShortPostDetail;
