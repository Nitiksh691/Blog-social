import BlogPost from "../models/BlogPost.js";
import User from "../models/User.js";

export const getUserPosts = async (req, res) => {
    try {
      const posts = await BlogPost.find({ author: req.params.userId }).sort({ createdAt: -1 });
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
}

}

export const getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      console.log("Fetched Users: ", users); // ✅ Add this
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  };
  
 
export const toggleFollow = async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.id;

  if (userId === targetId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  try {
    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!target) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const isFollowing = target.followers.includes(userId);

    if (isFollowing) {
      // Unfollow
      target.followers = target.followers.filter(f => f.toString() !== userId.toString());
      user.following = user.following.filter(f => f.toString() !== targetId.toString());

      await target.save();
      await user.save();

      return res.status(200).json({ message: "Unfollowed", followed: false });
    } else {
      // Follow
      target.followers.push(userId);
      user.following.push(targetId);

      await target.save();
      await user.save();

      return res.status(200).json({ message: "Followed", followed: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getFollowInfo = async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate('followers', 'username email')
        .populate('following', 'username email');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isFollowing = req.user
        ? user.followers.some(f => f._id.toString() === req.user._id.toString())
        : false;
  
      res.status(200).json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        followers: user.followers,
        following: user.following,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing,
      });
  
    } catch (err) {
      console.error('Follow Info Fetch Error:', err); // LOG ERROR
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  