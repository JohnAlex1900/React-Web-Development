import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BlogForm from "../components/BlogForm";

describe("<BlogForm />", () => {
  test("calls createBlog with the right details when a new blog is created", () => {
    const createBlog = jest.fn();
    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const authorInput = screen.getByPlaceholderText("Author");
    const urlInput = screen.getByPlaceholderText("Url");
    const submitButton = screen.getByText("create");

    fireEvent.change(titleInput, { target: { value: "Test Blog" } });
    fireEvent.change(authorInput, { target: { value: "Test Author" } });
    fireEvent.change(urlInput, { target: { value: "http://testurl.com" } });
    fireEvent.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: "Test Blog",
      author: "Test Author",
      url: "http://testurl.com",
    });
  });
});
