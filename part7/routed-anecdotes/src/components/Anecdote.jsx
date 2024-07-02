const Anecdote = ({ anecdote }) => {
  if (!anecdote) return <div>Anecdote not found</div>;

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>by {anecdote.author}</div>
      <div>has {anecdote.votes} votes</div>
      <div>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </div>
    </div>
  );
};

export default Anecdote;
