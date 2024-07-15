// src/App.js
import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { setToken, clearToken, isLoggedIn } from "./auth";
import { useQuery, useSubscription } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED, ME } from "./queries/queries";
import FavoriteGenreBooks from "./components/FavoriteGenre";

const App = () => {
  const [page, setPage] = useState("authors");
  const { data, loading, error } = useQuery(ALL_BOOKS);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(ME);

  console.log("User data:", userData);
  console.log("User loading:", userLoading);
  console.log("User error:", userError);

  const handleLogin = (token) => {
    try {
      setToken(token);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    clearToken();
    window.location.reload();
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded;
      console.log("New book added:", newBook);
      window.alert(
        `New book added: ${newBook.title} by ${newBook.author.name}`
      );
    },
  });

  if (loading || userLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {isLoggedIn() ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <FavoriteGenreBooks
        show={page === "recommend"}
        favoriteGenre={userData?.me?.favoriteGenre}
      />

      <Authors show={page === "authors"} />

      <Books show={page === "books"} books={data?.allBooks} />

      {isLoggedIn() && <NewBook show={page === "add"} />}

      {!isLoggedIn() && (
        <LoginForm show={page === "login"} onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
