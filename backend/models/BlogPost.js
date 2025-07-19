import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,

    },
    author: {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category:{
      type:String,
      required: true,
    },
    tags:{
      type: [String],
      default: [],
    },
    views:{
      type: Number,
      default: 0,
    },

  

    createdAt: {
      type: Date,
      default: Date.now,
    }

  }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
