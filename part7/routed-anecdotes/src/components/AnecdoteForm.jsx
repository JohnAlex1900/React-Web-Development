import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useField } from "../custom_hooks/useField";

const AnecdoteForm = ({ setAnecdotes, anecdotes, setNotification }) => {
  const contentField = useField("text");
  const authorField = useField("text");
  const infoField = useField("text");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnecdote = {
      content: contentField.value,
      author: authorField.value,
      info: infoField.value,
      votes: 0,
      id: Math.round(Math.random() * 10000),
    };
    setAnecdotes(anecdotes.concat(newAnecdote));
    setNotification(`a new anecdote '${contentField.value}' created!`);
    setTimeout(() => {
      setNotification("");
    }, 5000);
    navigate("/");
  };

  const handleReset = (e) => {
    e.preventDefault();
    contentField.reset();
    authorField.reset();
    infoField.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentField} reset={undefined} />
        </div>
        <div>
          author
          <input {...authorField} reset={undefined} />
        </div>
        <div>
          url for more info
          <input {...infoField} reset={undefined} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default AnecdoteForm;
