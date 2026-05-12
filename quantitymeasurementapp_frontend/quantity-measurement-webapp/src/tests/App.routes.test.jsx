import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App routes", () => {
  test("renders app heading and navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/length"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /quantity measurement/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /length/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /weight/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /temperature/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /volume/i })).toBeInTheDocument();
  });

  test("redirects from root route to length page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /length/i })).toBeInTheDocument();
  });
});
