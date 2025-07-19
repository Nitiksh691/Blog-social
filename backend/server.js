import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import blogRoutes from './routes/blogRoutes.js'; // CRUD
import trendingRoutes from './routes/postRoutes.js'; // trending/popular
import reactionRoutes from './routes/reactions.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import dashboardRoutes from './routes/dashboard.js'; // author dashboard

dotenv.config();
connectDB();

const app = express();

const FRONTEND_URL = 'http://localhost:5173'; // Vite dev URL

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 🔧 Mount routes
app.use('/api/posts', blogRoutes);         // CRUD: /api/posts
app.use('/api/posts/stats', trendingRoutes); // stats: /api/posts/stats/trending
app.use('/api/auth', authRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
