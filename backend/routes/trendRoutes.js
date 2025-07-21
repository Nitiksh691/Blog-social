import express from 'express';
import { getTrendingPosts, getPopularPosts } from '../controllers/PostController.js';

const router = express.Router();

router.get('/trending', getTrendingPosts); // /api/posts/stats/trending
router.get('/popular', getPopularPosts);   // /api/posts/stats/popular

export default router;
