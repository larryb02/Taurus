import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "@taurus/Dashboard/Dashboard";
import TerminalView from "@taurus/Terminal/TerminalView";
import Login from '@taurus/Login/Login';
import SignUp from '@taurus/Login/SignUp';
import { ConnectionsContextProvider } from "@taurus/Dashboard/Connections/ConnectionsContext"; // DO NOT LEAVE THIS HERE, or at least scope it down more
import { SessionsContextProvider } from "@taurus/Terminal/SessionsContext";
import { UserContextProvider } from "@taurus/Auth/UserContext";
import ProtectedRoute from '@taurus/Auth/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionsContextProvider>
        <SessionsContextProvider>
          <UserContextProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>} />
                <Route path="session" element={
                  <ProtectedRoute>
                    <TerminalView />
                  </ProtectedRoute>
                } />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
              </Routes>
            </Router>
          </UserContextProvider>
        </SessionsContextProvider>
      </ConnectionsContextProvider>
    </QueryClientProvider>
  );
}

export default App;
