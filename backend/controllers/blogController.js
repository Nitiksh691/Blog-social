import BlogPost from '../models/BlogPost.js';

// Create new post
export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = new BlogPost({ title, content, author: req.user._id, category, tags });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single post by ID
// controllers/blogController.js
export const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, {$inc:{views:1}}, { new: true }).populate('author', 'username email'); // Populate author details

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this post' });

    await post.deleteOne(); // now safe
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update post
  export const updatePost = async (req, res) => {
    try {
      const post = await BlogPost.findById(req.params.id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
  
      if (post.author.toString() !== req.user.id)
        return res.status(403).json({ message: 'Not authorized to update this post' });
  
      post.title = req.body.title || post.title;
      post.content = req.body.content || post.content;
      post.category = req.body.category || post.category;
      post.tags = req.body.tags || post.tags;
  
      const updated = await post.save();
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  // controllers/postController.js

