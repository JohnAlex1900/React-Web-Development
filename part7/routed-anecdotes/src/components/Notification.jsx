import React from "react";

const Notification = ({ message }) => {
  if (!message) return null;

  const notificationStyle = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
