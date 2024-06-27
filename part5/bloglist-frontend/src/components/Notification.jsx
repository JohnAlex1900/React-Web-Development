import React from "react";
import "../App.css"; // Ensure the CSS file is imported

const Notification = ({ notif, type }) => {
  if (notif === null) {
    return null;
  }

  return <div className={type}>{notif}</div>;
};

export default Notification;
