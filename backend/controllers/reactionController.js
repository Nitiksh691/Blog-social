// controllers/reactionController.js
import Reaction from '../models/Reaction.js';
import BlogPost from '../models/BlogPost.js';

export const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    if (!postId) return res.status(400).json({ error: 'Post ID required' });

    let reaction = await Reaction.findOne({ post: postId, user: userId });

    if (reaction) {
      reaction.like = !reaction.like;
      if (reaction.like) reaction.dislike = false; // can't have both
    } else {
      reaction = new Reaction({ post: postId, user: userId, like: true });
    }

    await reaction.save();
    res.status(200).json({ message: 'Like toggled', reaction });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    let reaction = await Reaction.findOne({ post: postId, user: userId });

    if (reaction) {
      reaction.dislike = !reaction.dislike;
      if (reaction.dislike) reaction.like = false; // can't have both
    } else {
      reaction = new Reaction({ post: postId, user: userId, dislike: true });
    }

    await reaction.save();
    res.status(200).json({ message: 'Dislike toggled', reaction });
  } catch (err) {
    console.error('Dislike error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getReactionsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const reactions = await Reaction.find({ post: postId });

    const likes = reactions.filter(r => r.like).length;
    const dislikes = reactions.filter(r => r.dislike).length;

    res.json({ likes, dislikes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
