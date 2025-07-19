// routes/userRoutes.js
import express from 'express';
import { getUserProfile, getUserPosts,getAllUsers,toggleFollow ,getFollowInfo} from '../controllers/userController.js';
import protect from '../middleware/authmiddleware.js';
import isAdmin from '../middleware/isAdmin.js'; // Admin check middleware

const router = express.Router();

router.get('/all',protect,isAdmin, getAllUsers); // Get all users (admin only)
router.get('/:userId', getUserProfile); // Get user info
router.get('/:userId/posts', getUserPosts); // Get user posts
router.put('/:id/follow-toggle', protect, toggleFollow);
router.get('/:id/follow-info',protect, getFollowInfo);
export default router;
    