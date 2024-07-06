// src/components/Notification.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import '../App.css'; // Ensure the CSS file is imported
import { Alert } from 'react-bootstrap';

const Notification = () => {
  const notification = useSelector(state => state.notification);

  if (notification.message === null) {
    return null;
  }

  return (
    <div className={notification.type}>
      <Alert variant={notification.type}>{notification.message}</Alert>
    </div>
  );
};

export default Notification;
