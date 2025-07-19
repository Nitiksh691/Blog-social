import BlogPost from '../models/BlogPost.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

export const getAuthorDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all posts by this user
    const posts = await BlogPost.find({ author: userId });

    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

    // Get all likes/dislikes from your reaction system (if it's separate, query that model instead)
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);

    // Count comments on their posts
    const postIds = posts.map(post => post._id);
    const totalComments = await Comment.countDocuments({ post: { $in: postIds } });

    // Monthly breakdown (grouping by post.createdAt month)
    const monthlyStats = await BlogPost.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          posts: { $sum: 1 },
          views: { $sum: '$views' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      totalPosts,
      totalViews,
      totalLikes,
      totalComments,
      monthlyStats,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};
