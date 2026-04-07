import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import Length from "./components/Length";
import Weight from "./components/Weight";
import Temperature from "./components/Temperature";
import Volume from "./components/Volume";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <h1>Quantity Measurement</h1>

      <nav className="nav-links">
        <NavLink to="/length">Length</NavLink>
        <NavLink to="/weight">Weight</NavLink>
        <NavLink to="/temperature">Temperature</NavLink>
        <NavLink to="/volume">Volume</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/length" replace />} />
        <Route path="/length" element={<Length />} />
        <Route path="/weight" element={<Weight />} />
        <Route path="/temperature" element={<Temperature />} />
        <Route path="/volume" element={<Volume />} />
      </Routes>
    </div>
  );
}

export default App;