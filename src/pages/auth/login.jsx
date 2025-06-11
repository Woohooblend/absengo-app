import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [attendanceNote, setAttendanceNote] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [loginError, setLoginError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changeUser, setChangeUser] = useState("");
  const [changePass, setChangePass] = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");

  const [storedAccounts, setStoredAccounts] = useState(() => {
    const saved = localStorage.getItem("accounts");
    return saved ? JSON.parse(saved) : [];
  });

  const { setIsLoggedIn, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(storedAccounts));
  }, [storedAccounts]);

  const handleSignup = () => {
    if (signupUsername && signupPassword) {
      const exists = storedAccounts.find(
        (acc) => acc.username === signupUsername
      );
      if (!exists) {
        const updated = [...storedAccounts, { username: signupUsername, password: signupPassword }];
        setStoredAccounts(updated);
        setSignupUsername("");
        setSignupPassword("");
        setIsSigningUp(false);
        alert("Registration successful! Please log in.");
      } else {
        alert("Username already registered. Please log in.");
      }
    }
  };

  const handleLogin = () => {
    const match = storedAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );
    if (match) {
      setIsLoggedIn(true);
      localStorage.setItem("current_user", username); // Tambahkan baris ini
      navigate("/", { replace: true });
      setLoginError("");
    } else {
      setLoginError("Your account is not registered.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleAddAttendance = () => {
    if (attendanceNote.trim() !== "") {
      setAttendanceList([
        ...attendanceList,
        { note: attendanceNote, time: new Date().toLocaleTimeString() },
      ]);
      setAttendanceNote("");
    }
  };

  const handlePasswordChange = () => {
    if (!newPassword) return;

    const updatedAccounts = storedAccounts.map((acc) =>
      acc.username === username ? { ...acc, password: newPassword } : acc
    );
    setStoredAccounts(updatedAccounts);
    setNewPassword("");
    setShowChangePassword(false);
    alert("Password successfully changed.");
  };

  const handlePasswordChangeFromLogin = () => {
    if (!changeUser || !changePass) return;
    const updatedAccounts = storedAccounts.map((acc) =>
      acc.username === changeUser ? { ...acc, password: changePass } : acc
    );
    if (storedAccounts.some(acc => acc.username === changeUser)) {
      setStoredAccounts(updatedAccounts);
      setChangeSuccess("Password successfully changed. Please login.");
      setChangeUser("");
      setChangePass("");
      setTimeout(() => setShowChangePassword(false), 1500);
    } else {
      setChangeSuccess("Username not found.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Absen<span className="text-blue-600">Go</span>
        </h1>

        {!isLoggedIn ? (
          isSigningUp ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 text-center">Create Your Account</h2>
              <input
                type="text"
                placeholder="Create username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <input
                type="password"
                placeholder="Create password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                onClick={handleSignup}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsSigningUp(false)}
                className="w-full text-center text-sm text-blue-600 hover:underline"
              >
                Already have an account? Log in
              </button>
            </div>
          ) : showChangePassword ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 text-center">Change Password</h2>
              <input
                type="text"
                placeholder="Enter your username"
                value={changeUser}
                onChange={(e) => setChangeUser(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={changePass}
                onChange={(e) => setChangePass(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                onClick={handlePasswordChangeFromLogin}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition"
              >
                Change Password
              </button>
              {changeSuccess && <p className="text-center text-green-600 font-medium">{changeSuccess}</p>}
              <button
                onClick={() => { setShowChangePassword(false); setChangeSuccess(""); }}
                className="w-full text-center text-sm text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
               <h2 className="text-xl font-semibold text-gray-700 text-center">Welcome Back!</h2>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                onClick={handleLogin}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition"
              >
                Login
              </button>
              {loginError && <p className="text-center text-red-600 font-medium">{loginError}</p>}
              <button
                onClick={() => setIsSigningUp(true)}
                className="w-full text-center text-sm text-blue-600 hover:underline"
              >
                Don't have an account? Sign up here
              </button>
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full text-center text-sm text-blue-600 hover:underline"
              >
                Forgot/Change Password?
              </button>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <div className="text-center text-xl font-semibold text-gray-800">
              Welcome, <span className="font-bold text-blue-600">{username}</span>
            </div>

            <input
              type="text"
              placeholder="Attendance note (optional)"
              value={attendanceNote}
              onChange={(e) => setAttendanceNote(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleAddAttendance}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition"
            >
              Register Attendance
            </button>

            <div>
              <h2 className="text-gray-800 font-semibold mb-2">Attendance History:</h2>
              <ul className="max-h-40 overflow-y-auto space-y-2 text-gray-700 list-disc list-inside p-2 border rounded-md">
                {attendanceList.length === 0 ? (
                  <li className="italic text-gray-400">No attendance history yet.</li>
                ) : (
                  attendanceList.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-mono text-sm text-gray-500">{item.time}</span> — {item.note || "No notes"}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-full py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition"
            >
              {showChangePassword ? "Close" : "Change Password"}
            </button>

            {showChangePassword && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 overflow-hidden"
              >
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  onClick={handlePasswordChange}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
                >
                  Save New Password
                </button>
              </motion.div>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-2 border border-red-500 text-red-500 font-semibold rounded-md hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;