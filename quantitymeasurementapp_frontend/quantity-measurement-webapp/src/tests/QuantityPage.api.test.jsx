import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Length from "../components/Length";

const BASE_URL = "http://localhost:8080/api/v1/quantities";

describe("Quantity page API integration behavior", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("calls compare endpoint with expected payload and shows comparison output", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        operation: "COMPARE",
        resultString: "EQUAL"
      })
    });

    render(<Length />);

    fireEvent.change(screen.getByPlaceholderText(/first value/i), {
      target: { name: "thisValue", value: "1" }
    });

    fireEvent.change(screen.getByPlaceholderText(/second value/i), {
      target: { name: "thatValue", value: "12" }
    });

    fireEvent.change(document.querySelector("select[name='thatUnit']"), {
      target: { name: "thatUnit", value: "INCHES" }
    });

    fireEvent.click(screen.getByRole("button", { name: /compare/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/compare`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thisQuantityDTO: {
            value: 1,
            unit: "FEET",
            measurementType: "LengthUnit"
          },
          thatQuantityDTO: {
            value: 12,
            unit: "INCHES",
            measurementType: "LengthUnit"
          }
        })
      })
    );

    expect(await screen.findByText(/operation: compare/i)).toBeInTheDocument();
    expect(screen.getByText(/result string: equal/i)).toBeInTheDocument();
  });

  test("shows convert output from endpoint response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        operation: "CONVERT",
        resultValue: 12,
        resultUnit: "INCHES"
      })
    });

    render(<Length />);

    fireEvent.change(screen.getByPlaceholderText(/first value/i), {
      target: { name: "thisValue", value: "1" }
    });

    fireEvent.change(document.querySelector("select[name='thatUnit']"), {
      target: { name: "thatUnit", value: "INCHES" }
    });

    fireEvent.click(screen.getByRole("button", { name: /convert/i }));

    expect(await screen.findByText(/operation: convert/i)).toBeInTheDocument();
    expect(screen.getByText(/result value: 12 inches/i)).toBeInTheDocument();
  });

  test("shows backend error message when endpoint returns error", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: true,
        errorMessage: "Invalid unit conversion"
      })
    });

    render(<Length />);

    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    expect(await screen.findByText(/error: invalid unit conversion/i)).toBeInTheDocument();
  });

  test("loads and renders operation history from history endpoint", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          operation: "ADD",
          thisValue: 1,
          thisUnit: "FEET",
          thatValue: 12,
          thatUnit: "INCHES"
        }
      ]
    });

    render(<Length />);

    fireEvent.change(screen.getByDisplayValue("ADD"), {
      target: { value: "ADD" }
    });
    fireEvent.click(screen.getByRole("button", { name: /load history/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/history/operation/ADD`);
    });

    expect(await screen.findByText(/history/i)).toBeInTheDocument();
    expect(screen.getByText(/add: 1 feet and 12 inches/i)).toBeInTheDocument();
  });
});
