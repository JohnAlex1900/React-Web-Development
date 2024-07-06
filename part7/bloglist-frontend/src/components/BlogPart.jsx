import React from 'react';
import PropTypes from 'prop-types';

const BlogPart = ({ blog, updateLikes }) => {
  const handleLike = () => {
    updateLikes(blog.id, blog.likes + 1);
  };

  return (
    <div>
      <h2>{blog.title}</h2>
      <br />
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes <button onClick={handleLike}>Like</button>
      </p>
      <p>Added by {blog.user.name}</p>
    </div>
  );
};

BlogPart.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateLikes: PropTypes.func.isRequired,
};

export default BlogPart;
