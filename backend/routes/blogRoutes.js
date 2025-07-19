import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  updatePost, 
  
} from '../controllers/blogController.js';
import protect from '../middleware/authmiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, createPost);
router.delete('/:id', protect, deletePost);
router.put('/:id', protect, updatePost);

// search filter post route
// router.get('/search', Search);


export default router;
