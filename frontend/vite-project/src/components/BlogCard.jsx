import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  return (
    <div>
      <h2>
        <Link to={`/post/${post._id}`}>{post.title}</Link>
      </h2>
      <p><strong>By:</strong> {post.author}</p>
      <p>{post.content.slice(0, 100)}...</p>
      <hr />
    </div>
  );
};

export default BlogCard;
