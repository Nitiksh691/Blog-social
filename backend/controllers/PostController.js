import BlogPost from '../models/BlogPost.js';

// GET /api/posts/stats/trending?range=24h
export const getTrendingPosts = async (req, res) => {
  const range = req.query.range || '24h';
  const now = new Date();
  const past = new Date(range === '3d' ? now - 3 * 24 * 60 * 60 * 1000 : now - 24 * 60 * 60 * 1000);

  try {
    const posts = await BlogPost.find({ createdAt: { $gte: past } })
      .sort({ score: -1 })
      .limit(5)
      .populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
};

// GET /api/posts/stats/popular
export const getPopularPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ views: -1 }).limit(5).populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch popular posts' });
  }
};
