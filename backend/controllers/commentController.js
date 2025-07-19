// controllers/commentController.js
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// export const createComment = async (req, res) => {
//   try {
//     const { postId, text, parentComment } = req.body;

//     const newComment = await Comment.create({
//       postId,
//       text,
//       user: req.user._id,
//       parentComment: parentComment || null,
//     });

//     const populatedComment = await newComment.populate('user', 'username' );

//     res.status(201).json(populatedComment);
//   } catch (error) {
//     console.error('Error creating comment:', error);
//     res.status(500).json({ message: 'Failed to create comment' });
//   }
// };
export const createComment = async (req, res) => {
    try {
      
      const { postId, text, content, parentComment } = req.body;
const finalText = text || content;

  
      const newComment = await Comment.create({
        postId,
        content,
         user: req.user._id,
        parentComment: parentComment || null,
      });
  
      const populatedComment = await newComment.populate('user', 'username');
  
      res.status(201).json(populatedComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Failed to create comment' });
    }
  };
  

// export const getCommentsByPostId = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const allComments = await Comment.find({ postId })
//       .populate('user', 'username email').populate('parentComment')
//       .lean();

//     const buildTree = (parentId = null) => {
//       return allComments
//         .filter(comment => String(comment.parentComment) === String(parentId))
//         .map(comment => ({
//           ...comment,
//           replies: buildTree(comment._id),
//         }));
//     };

//     const nestedComments = buildTree();

//     res.status(200).json(nestedComments);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).json({ message: 'Failed to fetch comments' });
//   }
// };


export const getCommentsByPostId = async (req, res) => {
    try {
      const { postId } = req.params;
  
      const allComments = await Comment.find({ postId })
        .populate('user', 'username email')
        .sort({ createdAt: 1 }) // oldest to newest
        .lean({ virtuals: true }); // ensure virtuals are preserved
  
      const buildTree = (parentId = null) => {
        return allComments
          .filter(comment => String(comment.parentComment) === String(parentId))
          .map(comment => ({
            ...comment,
            replies: buildTree(comment._id),
          }));
      };
  
      const nestedComments = buildTree();
  
      res.status(200).json(nestedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Failed to fetch comments' });
    }
  };