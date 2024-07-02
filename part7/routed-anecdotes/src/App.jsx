import { useState, useEffect } from "react";
import { Routes, Route, Link, useMatch, useLocation } from "react-router-dom";
import Home from "./components/Home";
import AnecdoteForm from "./components/AnecdoteForm";
import Anecdote from "./components/Anecdote";
import About from "./components/About";
import Notification from "./components/Notification";

const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <div>
      <Link to="/" style={padding}>
        anecdotes
      </Link>
      <Link to="/create" style={padding}>
        create new
      </Link>
      <Link to="/about" style={padding}>
        about
      </Link>
    </div>
  );
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState("");
  const location = useLocation();

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  const match = useMatch("/anecdotes/:id");
  const anecdote = match
    ? anecdotes.find((anecdote) => anecdote.id === Number(match.params.id))
    : null;

  useEffect(() => {
    if (location.state && location.state.notification) {
      setNotification(location.state.notification);
      setTimeout(() => {
        setNotification("");
      }, 5000);
      window.history.replaceState({}, document.title); // Clear state after using it
    }
  }, [location]);

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification message={notification} />
      <Routes>
        <Route path="/" element={<Home anecdotes={anecdotes} />} />
        <Route
          path="/create"
          element={
            <AnecdoteForm
              setAnecdotes={setAnecdotes}
              anecdotes={anecdotes}
              setNotification={setNotification}
            />
          }
        />

        <Route path="/about" element={<About />} />
        <Route
          path="/anecdotes/:id"
          element={<Anecdote anecdote={anecdote} />}
        />
      </Routes>
    </div>
  );
};

export default App;
