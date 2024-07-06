import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap';

const UserBlogList = ({ user, handleLogout }) => {
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogsByUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`); // Ensure your backend endpoint matches this
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
      }
    };

    fetchBlogsByUser();
  }, [userId]);

  if (blogs.length === 0) {
    return <p>No blogs created by this user.</p>;
  }

  return (
    <div>
      <h2>Blogs</h2>
      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
          logout
        </button>
      </p>
      <h2>{user.username}</h2>
      <h3>Added Blogs</h3>
      <Table striped bordered hover>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </td>
              <td>{blog.author}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserBlogList;
