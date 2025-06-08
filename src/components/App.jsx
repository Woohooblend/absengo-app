// App.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/auth/Login";
import Verification from "../pages/verification";
import CheckinCheckout from "../pages/checkin-checkout";
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
    </Routes>
  );
}

export default App;
