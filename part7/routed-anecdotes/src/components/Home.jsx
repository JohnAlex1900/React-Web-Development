import React, { useState } from "react";
import Footer from "./Footer";
import Anecdotes from "./Anecdotes";

const Home = ({ anecdotes }) => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <Anecdotes anecdotes={anecdotes} />
      <Footer />
    </div>
  );
};

export default Home;
