import React, { useState } from "react";
import { motion } from "framer-motion";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [storedAccounts, setStoredAccounts] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceNote, setAttendanceNote] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSignup = () => {
    if (signupUsername && signupPassword) {
      const exists = storedAccounts.find(
        (acc) => acc.username === signupUsername
      );
      if (!exists) {
        setStoredAccounts([...storedAccounts, { username: signupUsername, password: signupPassword }]);
        setSignupUsername("");
        setSignupPassword("");
        setIsSigningUp(false);
        alert("Pendaftaran berhasil! Silakan login.");
      } else {
        alert("Username sudah terdaftar. Silakan login.");
      }
    }
  };

  const handleLogin = () => {
    const match = storedAccounts.find(
      (acc) => acc.username === username && acc.password === password
    );
    if (match) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Akun Anda tidak terdaftar.");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-700 to-pink-600 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-10"
      >
        <h1 className="text-4xl font-extrabold text-center text-gradient bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 mb-8">
          Absen<span className="text-indigo-900">Go</span>
        </h1>

        {!isLoggedIn ? (
          isSigningUp ? (
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Buat username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <input
                type="password"
                placeholder="Buat password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <button
                onClick={handleSignup}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsSigningUp(false)}
                className="w-full text-center text-sm text-indigo-600 hover:underline"
              >
                Sudah punya akun? Login di sini
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg transition"
              >
                Login
              </button>
              {loginError && <p className="text-center text-red-600 font-medium">{loginError}</p>}
              <button
                onClick={() => setIsSigningUp(true)}
                className="w-full text-center text-sm text-indigo-600 hover:underline"
              >
                Belum punya akun? Daftar di sini
              </button>
            </div>
          )
        ) : (
          <div className="space-y-8">
            <div className="text-center text-lg font-semibold text-indigo-800">
              Selamat datang, <span className="font-bold">{username}</span>
            </div>

            <input
              type="text"
              placeholder="Catatan kehadiran (opsional)"
              value={attendanceNote}
              onChange={(e) => setAttendanceNote(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            />
            <button
              onClick={handleAddAttendance}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transition"
            >
              Daftar Kehadiran
            </button>

            <div>
              <h2 className="text-indigo-800 font-semibold mb-2">Riwayat Kehadiran:</h2>
              <ul className="max-h-40 overflow-y-auto space-y-1 text-gray-700 list-disc list-inside">
                {attendanceList.length === 0 ? (
                  <li className="italic text-gray-400">Belum ada riwayat kehadiran.</li>
                ) : (
                  attendanceList.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-mono text-sm text-gray-500">{item.time}</span> — {item.note || "Tanpa catatan"}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 border border-pink-600 text-pink-600 font-semibold rounded-xl hover:bg-pink-100 transition"
            >
              Logout
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default App;
