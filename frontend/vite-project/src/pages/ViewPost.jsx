import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios.js';
import Comments from '../components/Comments.jsx';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash } from 'react-icons/fa';
import { useReactionStore } from '../auth/reactionStore.js';
import useAuthStore from '../auth/authStore.jsx';
import axios from 'axios';

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const { user, token } = useAuthStore();
  const { likes, dislikes, likePost, dislikePost, fetchReactions } = useReactionStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
        fetchReactions(id);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };

    fetchData();
  }, [id, fetchReactions]);

  const handleLike = () => likePost(id);
  const handleDislike = () => dislikePost(id);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;

    try {
      await api.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Post deleted successfully.');
      navigate('/');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Could not delete post.');
    }
  };

  if (!post) return <p className="text-center text-gray-500 mt-10">Loading post...</p>;

  // Check if the user is the author
  const postAuthorId = typeof post.author === 'string' ? post.author : post.author?._id;
  const isAuthor = user?._id === postAuthorId;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <p>
          ✍️ By <span className="font-semibold">{post.author?.username || 'Unknown'}</span>
        </p>

        <div className="flex items-center gap-3">
          <p>{post.views || 0}</p>
          <button onClick={handleLike} className="flex items-center text-green-600 hover:text-green-800">
            <FaThumbsUp className="mr-1" /> {likes}
          </button>
          <button onClick={handleDislike} className="flex items-center text-red-600 hover:text-red-800">
            <FaThumbsDown className="mr-1" /> {dislikes}
          </button>

          {/* ✅ Show Edit/Delete buttons only if current user is the author */}
          {isAuthor && (
            <>
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="prose max-w-none mb-10 text-gray-700 whitespace-pre-line">
        {post.content}
      </div>

      {/* ✅ Comments Section */}
      <Comments postId={post._id} />
    </div>
  );
};

export default ViewPost;
