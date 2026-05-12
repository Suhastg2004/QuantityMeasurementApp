import { render, screen } from "@testing-library/react";
import Temperature from "../components/Temperature";

describe("Temperature page", () => {
  test("shows temperature title and units", () => {
    render(<Temperature />);

    expect(screen.getByRole("heading", { name: /temperature/i })).toBeInTheDocument();
    expect(screen.getAllByRole("option", { name: "CELSIUS" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("option", { name: "FAHRENHEIT" }).length).toBeGreaterThan(0);
  });

  test("shows all operation buttons", () => {
    render(<Temperature />);

    expect(screen.getByRole("button", { name: /compare/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /convert/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subtract/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /divide/i })).toBeInTheDocument();
  });
});
