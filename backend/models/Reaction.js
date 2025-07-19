// models/Reaction.js
import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  like: { type: Boolean, default: false },
  dislike: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Reaction', reactionSchema);
