import { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import SidebarPosts from '../components/SidebarPosts';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div className="home-container">
      <style>{`
        .home-container {
          padding: 40px 20px;
          background: #f9f9f9;
          font-family: 'Segoe UI', sans-serif;
          min-height: 100vh;
        }

        h1 {
          text-align: center;
          font-size: 2.8rem;
          font-weight: bold;
          margin-bottom: 40px;
          color: #2d3748;
          animation: slideUp 0.7s ease-out;
        }

        .main-content {
          display: flex;
          gap: 30px;
          max-width: 1300px;
          margin: 0 auto;
        }

        .sidebar {
          width: 300px;
          flex-shrink: 0;
        }

        .posts-section {
          flex: 1;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }

        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.7s ease forwards;
        }

        .fade-in-up:nth-child(1) { animation-delay: 0.1s; }
        .fade-in-up:nth-child(2) { animation-delay: 0.2s; }
        .fade-in-up:nth-child(3) { animation-delay: 0.3s; }
        .fade-in-up:nth-child(4) { animation-delay: 0.4s; }
        .fade-in-up:nth-child(5) { animation-delay: 0.5s; }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .no-posts {
          text-align: center;
          font-size: 1.1rem;
          color: #888;
          margin-top: 40px;
          animation: fadeUp 0.5s ease forwards;
        }

        @media (max-width: 768px) {
          .main-content {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
          }
        }
      `}</style>

      <h1>📰 Latest Blog Posts</h1>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <SidebarPosts />
        </div>

        {/* Posts Section */}
        <div className="posts-section">
          {posts.length === 0 ? (
            <p className="no-posts">No posts found.</p>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post._id} className={`fade-in-up`}>
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
