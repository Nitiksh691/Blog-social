// controllers/shortPostController.js
import ShortPost from '../models/ShortPost.js';
import Comment from '../models/Comment.js';
import Reaction from '../models/Reaction.js';


export const createShortPost = async (req, res) => {
  try {
    const { title, content, hashtag, type } = req.body;

    let mediaUrl = null;
    let mediaType = null;

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
      mediaType = req.file.mimetype.includes('video') ? 'video' : 'image';
    }

    const newPost = new ShortPost({
      title,
      content,
      hashtag,
      type,
      media: mediaUrl,
      mediaType,
      postAuthor: req.user._id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create short post', error: error.message });
  }
};


export const getAllShortPosts = async (req, res) => {
  try {
    const posts = await ShortPost.find()
      .populate('postAuthor', 'username')
      .populate('comments')
      .populate('reactions')
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch short posts', error: error.message });
  }
};

export const getShortPostById = async (req, res) => {
  try {
    const post = await ShortPost.findById(req.params.id)
      .populate('postAuthor', 'username')
      .populate('comments')
      .populate('reactions');

    if (!post) return res.status(404).json({ message: 'Short post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving post', error: error.message });
  }
};

export const deleteShortPost = async (req, res) => {
  try {
    const post = await ShortPost.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.postAuthor.toString() !== req.user._id.toString() && req.user.Role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

export const updateViews = async (req, res) => {
  try {
    const post = await ShortPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update views', error: error.message });
  }
};
