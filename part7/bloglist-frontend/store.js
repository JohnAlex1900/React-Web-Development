// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './src/reducers/notificationReducer';
import blogReducer from './src/reducers/blogReducer';
import userReducer from './src/reducers/userReducer';
import usersReducer from './src/reducers/usersReducer';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer,
  },
});

export default store;
