import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "@taurus/Dashboard/Dashboard";
import TerminalView from "@taurus/Terminal/TerminalView";
import Login from '@taurus/Login/Login';
import SignUp from '@taurus/Login/SignUp';
import { ConnectionsContextProvider } from "@taurus/Dashboard/Connections/ConnectionsContext"; // DO NOT LEAVE THIS HERE, or at least scope it down more
import { SessionsContextProvider } from "@taurus/context/SessionsContext";
import { UserContextProvider } from "@taurus/context/UserContext";

function App() {
  return (
    <ConnectionsContextProvider>
      <SessionsContextProvider>
        <UserContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="session" element={<TerminalView />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
            </Routes>
          </Router>
        </UserContextProvider>
      </SessionsContextProvider>
    </ConnectionsContextProvider>
  );
}

export default App;
