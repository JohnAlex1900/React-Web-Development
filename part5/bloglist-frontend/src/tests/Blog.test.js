import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "../components/Blog";

describe("<Blog />", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testurl.com",
    likes: 0,
    user: { name: "Test User" },
  };

  const updateLikes = jest.fn();
  const removeBlog = jest.fn();

  test("renders title and author, but not URL or likes by default", () => {
    render(
      <Blog blog={blog} updateLikes={updateLikes} removeBlog={removeBlog} />
    );

    const titleAuthorDiv = screen.getByText("Test Blog Test Author");
    expect(titleAuthorDiv).toBeDefined();

    const urlElement = screen.queryByText("http://testurl.com");
    expect(urlElement).toBeNull();

    const likesElement = screen.queryByText("likes: 0");
    expect(likesElement).toBeNull();
  });

  test("renders URL and likes when the view button is clicked", () => {
    render(
      <Blog blog={blog} updateLikes={updateLikes} removeBlog={removeBlog} />
    );

    const button = screen.getByText("view");
    fireEvent.click(button);

    const urlElement = screen.getByText("http://testurl.com");
    expect(urlElement).toBeDefined();

    const likesElement = screen.getByText("likes: 0");
    expect(likesElement).toBeDefined();
  });

  test("calls event handler twice when like button is clicked twice", () => {
    render(
      <Blog blog={blog} updateLikes={updateLikes} removeBlog={removeBlog} />
    );

    const viewButton = screen.getByText("view");
    fireEvent.click(viewButton);

    const likeButton = screen.getByText("like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(updateLikes.mock.calls).toHaveLength(2);
  });
});
