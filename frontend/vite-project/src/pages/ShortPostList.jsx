import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShortPostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/shortposts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Short Posts</h2>
      <div className="grid grid-cols-1 gap-4">
        {posts.map(post => (
          <Link to={`/shortposts/${post._id}`} key={post._id} className="border rounded p-3 shadow hover:shadow-lg transition">
            <p className="font-semibold">{post.hashtag}</p>
            {post.mediaType === 'image' && (
              <img src={`http://localhost:5000/${post.media}`} alt="" className="w-full h-auto rounded mt-2" />
            )}
            {post.mediaType === 'video' && (
              <video controls className="w-full h-auto mt-2">
                <source src={`http://localhost:5000/${post.media}`} type="video/mp4" />
              </video>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShortPostList;
