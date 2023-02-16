import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the timer", () => {
  render(<App />);
  const linkElement = screen.getByRole("timer");
  expect(linkElement).toBeInTheDocument();
});
