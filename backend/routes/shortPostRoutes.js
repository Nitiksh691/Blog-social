import express from 'express';
import {
  createShortPost,
  getAllShortPosts,
  getShortPostById,
  deleteShortPost,
  updateViews,
} from '../controllers/shortPostController.js';
import protect from '../middleware/authmiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/', getAllShortPosts);
router.get('/:id', getShortPostById);
router.put('/:id/views', updateViews);
router.post('/', protect, upload.single('media'), createShortPost);
router.delete('/:id', protect, deleteShortPost);

export default router;
