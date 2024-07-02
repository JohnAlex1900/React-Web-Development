import React, { useState } from "react";
import { Link } from "react-router-dom";

const Anecdotes = ({ anecdotes }) => {
  return (
    <div>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Anecdotes;
