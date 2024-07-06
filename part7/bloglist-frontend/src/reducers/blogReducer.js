// src/reducers/blogReducer.js
import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      return action.payload;
    },
    appendBlog: (state, action) => {
      state.push(action.payload);
    },
    updateBlog: (state, action) => {
      const updatedBlog = action.payload;
      return state.map(blog =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
    },
    removeBlog: (state, action) => {
      const id = action.payload;
      return state.filter(blog => blog.id !== id);
    },
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = blogObject => {
  return async (dispatch, getState) => {
    const { user } = getState();
    const newBlog = await blogService.create({ ...blogObject, user });
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (id, likes) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(id, { likes });
    dispatch(updateBlog(updatedBlog));
  };
};

export const addComment = (id, comment) => {
  return async dispatch => {
    const updatedBlog = await blogService.addComment(id, {
      comment: [...comment],
    });
    dispatch(updateBlog(updatedBlog));
  };
};

export const deleteBlog = id => {
  return async dispatch => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};

export default blogSlice.reducer;
