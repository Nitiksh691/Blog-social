// models/ShortPost.js
import mongoose from 'mongoose';

const shortPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  postAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hashtag: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },

  media: {
    type: String, // e.g., "/uploads/123.jpg"
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', null],
    default: null,
  },
  views: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  reactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reaction'
  }]
}, { timestamps: true });

const ShortPost = mongoose.model('ShortPost', shortPostSchema);
export default ShortPost;
