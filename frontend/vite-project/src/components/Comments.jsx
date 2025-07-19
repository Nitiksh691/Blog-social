import React, { useEffect, useState } from 'react';
import api from '../utils/axios.js';
import useAuthStore from '../auth/authStore.jsx';
import { Link } from 'react-router-dom';

const CommentItem = ({ comment, postId, depth = 0 }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { user, token } = useAuthStore();

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      await api.post(
        '/comments',
        {
          postId,
          content: replyText,
          parentComment: comment._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReplyText('');
      setShowReplyBox(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to post reply', err);
    }
  };

  return (
    <div className="comment-indent" style={{ marginLeft: `${depth * 2}rem` }}>
      <div className="comment-item">
        <div className="avatar">
          {comment.user?.username?.charAt(0).toUpperCase() || 'A'}
        </div>

        <div className="comment-bubble">
          {/* <div className="comment-username">@{comment.user?.username || 'Anonymous'}</div> */}
          <Link
  to={`/users/${comment.user?._id}`}
  className="comment-username hover:underline hover:text-blue-600 transition"
>
  @{comment.user?.username || 'Anonymous'}
</Link>
          <div className="comment-text">{comment.content}</div>

          {user && (
            <button onClick={() => setShowReplyBox(!showReplyBox)} className="reply-button">
              Reply
            </button>
          )}

          {showReplyBox && (
            <div className="reply-box">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                placeholder="Write a reply..."
              />
              <button onClick={handleReply}>Reply</button>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply._id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
};

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const { user, token } = useAuthStore();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${postId}`);
        setComments(res.data || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) return alert('Login to comment.');
    if (!commentText.trim()) return;

    try {
      await api.post(
        '/comments',
        {
          postId,
          content: commentText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText('');
      window.location.reload();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <div className="comments-section">
      {/* Embedded CSS */}
      <style>{`
        .comments-section {
          margin-top: 40px;
          padding: 20px;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        .comments-section h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background-color: #4f46e5;
          color: white;
          font-weight: bold;
          font-size: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .comment-form {
          display: flex;
          gap: 12px;
          margin-bottom: 30px;
        }

        .comment-form textarea {
          flex: 1;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
          resize: vertical;
        }

        .comment-form button {
          background-color: #1d4ed8;
          color: #fff;
          border: none;
          padding: 8px 16px;
          font-weight: bold;
          font-size: 14px;
          border-radius: 4px;
          margin-top: 8px;
          cursor: pointer;
        }

        .comment-form button:hover {
          background-color: #2563eb;
        }

        .comment-item {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .comment-bubble {
          background-color: #f1f1f1;
          padding: 12px;
          border-radius: 10px;
          flex: 1;
        }

        .comment-username {
          font-weight: bold;
          color: #1d4ed8;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .comment-text {
          font-size: 14px;
          color: #333;
        }

        .reply-button {
          margin-top: 6px;
          font-size: 13px;
          color: #2563eb;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .reply-button:hover {
          text-decoration: underline;
        }

        .reply-box {
          margin-top: 8px;
        }

        .reply-box textarea {
          width: 100%;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 13px;
        }

        .reply-box button {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 6px 12px;
          font-size: 13px;
          margin-top: 6px;
          border-radius: 4px;
          cursor: pointer;
        }

        .comment-indent {
          margin-left: 0;
        }
      `}</style>

      <h2>Comments</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a public comment..."
              rows={3}
            />
            <button type="submit">Comment</button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 mb-4">🔒 Please log in to comment.</p>
      )}

      {/* Comments list */}
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={postId} />
        ))
      ) : (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default Comments;
