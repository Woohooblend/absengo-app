// App.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/auth/Login";
import Verification from "../pages/verification";
import CheckinCheckout from "../pages/checkin-checkout";
import History from "../pages/history";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verification"
        element={
          <ProtectedRoute>
            <Verification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin-checkout"
        element={
          <ProtectedRoute>
            <CheckinCheckout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
