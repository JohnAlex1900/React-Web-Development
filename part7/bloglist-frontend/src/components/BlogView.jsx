import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { likeBlog } from '../reducers/blogReducer';
import blogService from '../services/blogs';
import BlogPart from './BlogPart';
import { useParams } from 'react-router-dom';

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchedBlog = await blogService.getBlog(id);
        setBlog(fetchedBlog);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      }
    };
    fetchBlog();
  }, [id]);

  const updateLikes = async (id, likes) => {
    try {
      const updatedBlog = await blogService.update(id, { likes });
      setBlog(updatedBlog); // Update the local state immediately
      dispatch(likeBlog(id, likes)); // Dispatch the update to Redux
    } catch (error) {
      console.error('Failed to update likes:', error);
    }
  };

  const addComment = async event => {
    event.preventDefault();
    try {
      const updatedBlog = await blogService.addComment(id, newComment);
      setBlog(updatedBlog);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BlogPart blog={blog} updateLikes={updateLikes} />
      <div>
        <h3>Comments</h3>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <form onSubmit={addComment}>
          <input
            type='text'
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
          />
          <button type='submit'>Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default BlogView;
