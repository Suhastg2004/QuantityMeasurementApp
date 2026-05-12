import { useState } from "react";

const BASE_URL = "http://localhost:8080/api/v1/quantities";

function QuantityPage({ title, measurementType, units }) {
  const [formData, setFormData] = useState({
    thisValue: "",
    thisUnit: units[0],
    thatValue: "",
    thatUnit: units[0]
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyOperation, setHistoryOperation] = useState("ADD");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const buildPayload = () => ({
    thisQuantityDTO: {
      value: Number(formData.thisValue),
      unit: formData.thisUnit,
      measurementType
    },
    thatQuantityDTO: {
      value: Number(formData.thatValue),
      unit: formData.thatUnit,
      measurementType
    }
  });

  const callOperation = async (endpoint) => {
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(buildPayload())
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.errorMessage || `HTTP ${response.status}`);
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchHistory = async () => {
    setError("");
    try {
      const response = await fetch(`${BASE_URL}/history/operation/${historyOperation}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      setHistory(data);
    } catch (err) {
      setError(err.message);
      setHistory([]);
    }
  };

  return (
    <div className="card">
      <h2>{title}</h2>

      <div className="form-grid">
        <input
          name="thisValue"
          type="number"
          step="any"
          placeholder="First value"
          value={formData.thisValue}
          onChange={handleInputChange}
        />
        <select name="thisUnit" value={formData.thisUnit} onChange={handleInputChange}>
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>

        <input
          name="thatValue"
          type="number"
          step="any"
          placeholder="Second value"
          value={formData.thatValue}
          onChange={handleInputChange}
        />
        <select name="thatUnit" value={formData.thatUnit} onChange={handleInputChange}>
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div className="button-row">
        <button onClick={() => callOperation("compare")}>Compare</button>
        <button onClick={() => callOperation("convert")}>Convert</button>
        <button onClick={() => callOperation("add")}>Add</button>
        <button onClick={() => callOperation("subtract")}>Subtract</button>
        <button onClick={() => callOperation("divide")}>Divide</button>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {result && (
        <div className="result-box">
          <h3>Result</h3>
          <p>Operation: {result.operation}</p>
          {result.resultString && <p>Result String: {result.resultString}</p>}
          {result.resultUnit && (
            <p>
              Result Value: {result.resultValue} {result.resultUnit}
            </p>
          )}
          {!result.resultUnit && !result.resultString && <p>Result Value: {result.resultValue}</p>}
        </div>
      )}

      <div className="history-row">
        <select value={historyOperation} onChange={(e) => setHistoryOperation(e.target.value)}>
          <option value="ADD">ADD</option>
          <option value="SUBTRACT">SUBTRACT</option>
          <option value="DIVIDE">DIVIDE</option>
          <option value="CONVERT">CONVERT</option>
          <option value="COMPARE">COMPARE</option>
        </select>
        <button onClick={fetchHistory}>Load History</button>
      </div>

      {history.length > 0 && (
        <div className="history-box">
          <h3>History</h3>
          {history.map((item, index) => (
            <p key={`${item.operation}-${index}`}>
              {item.operation}: {item.thisValue} {item.thisUnit} and {item.thatValue} {item.thatUnit}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuantityPage;