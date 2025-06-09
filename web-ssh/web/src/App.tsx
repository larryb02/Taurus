import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TerminalView from "./pages/TerminalView";
import { ConnectionsContextProvider } from "./context/ConnectionsContext"; // DO NOT LEAVE THIS HERE, or at least scope it down more
import { SessionsContextProvider } from "./context/SessionsContext";

function App() {
  return (
    <ConnectionsContextProvider>
      <SessionsContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="session" element={<TerminalView />} />
          </Routes>
        </Router>
      </SessionsContextProvider>
    </ConnectionsContextProvider>
  );
}

export default App;
