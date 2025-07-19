import express from 'express';
import { getAuthorDashboard } from '../controllers/DashboardController.js';
import protect  from '../middleware/authmiddleware.js';


const router = express.Router();

router.get('/author', protect, getAuthorDashboard);

export default router;
