import React, { useState } from "react";
import PropTypes from "prop-types";
import blogService from "../services/blogs";

const Blog = ({ blog, updateLikes, removeBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    const newLikes = blog.likes + 1;
    updateLikes(blog.id, newLikes);
    blogService.update(blog.id, { ...blog, likes: newLikes });
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        removeBlog(blog.id);
      } catch (error) {
        console.error("Failed to delete blog:", error);
      }
    }
  };

  const blogUser = blog.user ? blog.user.username || "unknown" : "unknown";

  return (
    <div className="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button className="viewButton" onClick={toggleVisibility}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <p>{blog.url}</p>
          <p>
            likes: {blog.likes}{" "}
            <button className="likeButton" onClick={handleLike}>
              like
            </button>
          </p>
          <p>posted by: {blogUser}</p>
          {user && user.username === blogUser && (
            <button className="removeButton" onClick={handleRemove}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
