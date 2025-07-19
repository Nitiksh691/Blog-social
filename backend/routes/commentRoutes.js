import express from 'express';
import { createComment, getCommentsByPostId } from '../controllers/commentController.js';
import protect from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/', protect, createComment);
router.get('/:postId', getCommentsByPostId);

export default router;
