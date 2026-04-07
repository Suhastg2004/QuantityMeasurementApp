import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders quantity measurement heading", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/quantity measurement/i);
  expect(headingElement).toBeInTheDocument();
});