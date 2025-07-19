// routes/reactionRoutes.js
import express from 'express';
import {
  likePost,
  dislikePost,
  getReactionsForPost,
} from '../controllers/reactionController.js';
import protect from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/like', protect, likePost);
router.post('/dislike', protect, dislikePost);
router.get('/:postId', getReactionsForPost);

export default router;
