import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddConnection from "./pages/AddConnection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-connection" element={<AddConnection />} />
      </Routes>
    </Router>
  );
}

export default App;
