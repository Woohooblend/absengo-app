import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Login from "../pages/auth/login";
import Verification from "../pages/verification";
import CheckinCheckout from "../pages/checkin-checkout";
import History from "../pages/history";
import ProtectedRoute from "./ProtectedRoute";
import ClassAdd from "../pages/class-add";
import ClassList from "../pages/class-list";
import CourseAdd from "../pages/course-add";
import CourseList from "../pages/course-list";
import LecturerAdd from "../pages/lecturer-add";
import LecturerList from "../pages/lecturer-list";
import StudentList from "../pages/student-list";
import SessionAdd from "../pages/session-add";
import SessionList from "../pages/session-list";
import AttendanceAdd from "../pages/attendance-add";
import AttendanceList from "../pages/attendance-list";

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
      <Route
        path="/class-add"
        element={
          <ProtectedRoute>
            <ClassAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/class-list"
        element={
          <ProtectedRoute>
            <ClassList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-add"
        element={
          <ProtectedRoute>
            <CourseAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course-list"
        element={
          <ProtectedRoute>
            <CourseList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lecturer-add"
        element={
          <ProtectedRoute>
            <LecturerAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lecturer-list"
        element={
          <ProtectedRoute>
            <LecturerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-list"
        element={
          <ProtectedRoute>
            <StudentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session-add"
        element={
          <ProtectedRoute>
            <SessionAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session-list"
        element={
          <ProtectedRoute>
            <SessionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-add"
        element={
          <ProtectedRoute>
            <AttendanceAdd />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance-list"
        element={
          <ProtectedRoute>
            <AttendanceList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

