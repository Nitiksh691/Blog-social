// pages/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/axios.js';
import useAuthStore from '../auth/authStore.jsx';

const UserProfile = () => {
  const { userId } = useParams();
  const currentUser = useAuthStore((state) => state.user);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${userId}/follow-info`);
      setUser(res.data.user);
      setIsFollowing(res.data.isFollowing);
      setFollowers(res.data.followers);
      setFollowing(res.data.following);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/users/${userId}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

 
  const handleFollowToggle = async () => {
    try {
      setLoading(true);
      const res = await api.put(`/users/${userId}/follow-toggle`);
      
      // Update local state directly based on response (optional)
      if (res.data.success) {
        setIsFollowing((prev) => !prev);
  
        // Optionally update followers/following count
        setFollowers(res.data.updatedFollowers);
        setFollowing(res.data.updatedFollowing);
      } else {
        await fetchUser(); // fallback to refetch if data not returned
      }
    } catch (err) {
      console.error('Follow/Unfollow failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchPosts();
    }
  }, [userId]);

  if (!user) {
    return <p style={styles.loading}>Loading user profile...</p>;
  }

  return (
    <div style={styles.container}>
      {/* USER INFO */}
      <h1 style={styles.username}>@{user.username}</h1>
      <p style={styles.email}>Email: {user.email}</p>

      {/* FOLLOW STATUS */}
      <div style={styles.followInfo}>
        <span style={styles.count}>Followers: {followers.length}</span>
        <span style={styles.count}>Following: {following.length}</span>

        {currentUser && currentUser._id !== userId && (
          <button
            onClick={handleFollowToggle}
            disabled={loading}
            style={{
              ...styles.button,
              ...(isFollowing ? styles.unfollow : styles.follow)
            }}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      {/* FOLLOWERS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Followers</h2>
        {followers.length === 0 ? (
          <p style={styles.placeholder}>No followers yet</p>
        ) : (
          <ul style={styles.list}>
            {followers.map((f) => (
              <li key={f._id}>
                <Link to={`/users/${f._id}`} style={styles.link}>
                  @{f.username}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FOLLOWING */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Following</h2>
        {following.length === 0 ? (
          <p style={styles.placeholder}>Not following anyone</p>
        ) : (
          <ul style={styles.list}>
            {following.map((f) => (
              <li key={f._id}>
                <Link to={`/users/${f._id}`} style={styles.link}>
                  @{f.username}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr style={styles.divider} />

      {/* POSTS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Posts by @{user.username}</h2>
        {posts.length === 0 ? (
          <p style={styles.placeholder}>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} style={styles.post}>
              <Link to={`/posts/${post._id}`} style={styles.postTitle}>
                {post.title}
              </Link>
              <p style={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '720px',
    margin: '40px auto',
    padding: '24px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#333',
    lineHeight: '1.6',
  },
  loading: {
    textAlign: 'center',
    marginTop: '60px',
    color: '#666',
    fontSize: '16px'
  },
  username: {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  email: {
    fontSize: '14px',
    color: '#777',
    marginBottom: '16px'
  },
  followInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  count: {
    fontSize: '14px',
    color: '#444'
  },
  button: {
    fontSize: '14px',
    padding: '6px 14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  },
  follow: {
    backgroundColor: '#2563eb',
    color: 'white'
  },
  unfollow: {
    backgroundColor: '#e5e7eb',
    color: '#111827'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px'
  },
  list: {
    paddingLeft: '20px',
    marginTop: '6px'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none'
  },
  placeholder: {
    fontStyle: 'italic',
    color: '#777',
    fontSize: '14px'
  },
  divider: {
    margin: '30px 0',
    border: 'none',
    borderBottom: '1px solid #ddd'
  },
  post: {
    borderBottom: '1px solid #eee',
    padding: '12px 0'
  },
  postTitle: {
    fontSize: '16px',
    color: '#1d4ed8',
    fontWeight: '500',
    textDecoration: 'none'
  },
  postDate: {
    fontSize: '12px',
    color: '#888'
  }
};

export default UserProfile;
