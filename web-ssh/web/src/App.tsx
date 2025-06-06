import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { ConnectionsProvider } from "./context/ConnectionContext"; // DO NOT LEAVE THIS HERE

function App() {
  return (
    <ConnectionsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ConnectionsProvider>
  );
}

export default App;
