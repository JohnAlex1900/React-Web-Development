import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Link, Routes, useParams } from 'react-router-dom';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import UserList from './components/UserList';
import { setNotificationWithTimeout } from './reducers/notificationReducer';
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from './reducers/blogReducer';
import { loginUser, logoutUser, initializeUser } from './reducers/userReducer';
import UserBlogList from './components/UserBlogList';
import BlogView from './components/BlogView';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { id } = useParams();
  const blogs = useSelector(state => state.blogs);
  const user = useSelector(state => state.user);

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      try {
        dispatch(initializeBlogs());
      } catch (error) {
        if (error.message === 'TokenExpiredError') {
          dispatch(
            setNotificationWithTimeout(
              'Session expired. Please log in again.',
              'error',
              5000
            )
          );
          dispatch(logoutUser());
        }
      }
    }
  }, [user, dispatch]);

  const handleLogin = async event => {
    event.preventDefault();
    try {
      dispatch(loginUser({ username, password }));
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Wrong credentials', 'error', 5000));
    }
  };

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility();
    try {
      dispatch(createBlog(blogObject));
      dispatch(
        setNotificationWithTimeout(
          `A new blog ${blogObject.title} by ${blogObject.author} added`,
          'success',
          5000
        )
      );
    } catch (exception) {
      dispatch(setNotificationWithTimeout('Error adding blog', 'error', 5000));
    }
  };

  const updateLikes = (id, likes) => {
    dispatch(likeBlog(id, likes));
  };

  const removeBlog = id => {
    dispatch(deleteBlog(id));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(
      setNotificationWithTimeout('Logged out successfully', 'success', 5000)
    );
  };

  const loginForm = () => (
    <div>
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    </div>
  );

  const blogList = () => (
    <>
      <h2>blogs</h2>
      {[...blogs] // Create a new array to sort
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={updateLikes}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
    </>
  );

  return (
    <div className='container'>
      <Notification />
      <div>
        <Link style={{ marginRight: '10px' }} to='/'>
          blogs
        </Link>
        <Link style={{ marginRight: '10px' }} to='/users'>
          users
        </Link>
      </div>
      <Routes>
        <Route path='/users' element={<UserList />} />
        <Route
          path='/users/:userId'
          element={<UserBlogList user={user} handleLogout={handleLogout} />}
        />
        <Route path='/blogs/:id' element={<BlogView />} />
        <Route
          path='/'
          element={
            user === null ? (
              loginForm()
            ) : (
              <div>
                <p>
                  {user.name} logged-in{' '}
                  <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
                    logout
                  </button>
                </p>
                <Togglable buttonLabel='new blog' ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
                {blogList()}
              </div>
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
