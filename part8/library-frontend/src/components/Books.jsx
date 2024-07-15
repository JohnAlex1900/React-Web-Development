import { useState } from "react";

const Books = ({ show, books }) => {
  const [genre, setGenre] = useState("all");

  if (!show) {
    return null;
  }

  const genres = ["all", ...new Set(books.flatMap((book) => book.genres))];
  const filteredBooks =
    genre === "all"
      ? books
      : books.filter((book) => book.genres.includes(genre));

  return (
    <div>
      <h2>books</h2>

      <div>
        <label htmlFor="genre">Filter by genre: </label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
