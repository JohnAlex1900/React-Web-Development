import { useQuery } from "@apollo/client";
import { FAVORITE_GENRE_BOOKS } from "../queries/queries";
import React from "react";

const FavoriteGenreBooks = ({ show, favoriteGenre }) => {
  const { loading, error, data } = useQuery(FAVORITE_GENRE_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  console.log("Favorite genre:", favoriteGenre);
  console.log("Query data:", data);

  if (!show) return null;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Books in your favorite genre: {favoriteGenre}</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data?.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FavoriteGenreBooks;
