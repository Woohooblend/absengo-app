import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight, UploadCloud } from "lucide-react";
import { getRandomSubject, getCurrentDateTime } from "../utils/subjects";
import { fetchAttendance, patchAttendance } from "../api/attendance";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Helper to check if check-in is available for the upcoming schedule
function isCheckinAvailable(upcoming) {
  if (!upcoming || !upcoming.SessionDate || !upcoming.sessionHourStart || !upcoming.sessionHourEnd) return false;
  const startDateTime = new Date(`${upcoming.SessionDate}T${upcoming.sessionHourStart}`);
  const endDateTime = new Date(`${upcoming.SessionDate}T${upcoming.sessionHourEnd}`);
  const now = new Date();
  const windowStart = new Date(startDateTime.getTime() - 10 * 60 * 1000);
  const inWindow = now >= windowStart && now <= endDateTime;
  console.log('isCheckinAvailable:', {
    now: now.toISOString(),
    windowStart: windowStart.toISOString(),
    endDateTime: endDateTime.toISOString(),
    inWindow
  });
  return inWindow;
}

function isCheckoutAvailable(upcoming) {
  if (!upcoming || !upcoming.SessionDate || !upcoming.sessionHourEnd) return false;
  const endDateTime = new Date(`${upcoming.SessionDate}T${upcoming.sessionHourEnd}`);
  const now = new Date();
  const windowStart = new Date(endDateTime.getTime() - 10 * 60 * 1000);
  const inWindow = now >= windowStart;
  console.log('isCheckoutAvailable:', {
    now: now.toISOString(),
    windowStart: windowStart.toISOString(),
    endDateTime: endDateTime.toISOString(),
    inWindow
  });
  return inWindow;
}

const CheckinCheckout = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalCaption, setModalCaption] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [canCheckin, setCanCheckin] = useState(false);
  const [canCheckout, setCanCheckout] = useState(false);
  const [autoNotif, setAutoNotif] = useState(""); // for auto notification
  const [isVerified, setIsVerified] = useState(false);
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);

  // Helper to parse time from getCurrentDateTime string
  const parseTime = (dateTimeStr) => {
    // Example: "7 Jun, Fri, 10:00 - 12:00"
    const match = dateTimeStr.match(/(\d{1,2}):00 - (\d{1,2}):00/);
    if (!match) return null;
    return {
      startHour: parseInt(match[1], 10),
      endHour: parseInt(match[2], 10)
    };
  };

  // Load initial data
  useEffect(() => {
    const lastSubjectUpdate = localStorage.getItem("last_subject_update");
    const now = new Date().getTime();
    let todaySubject;
    if (!lastSubjectUpdate || (now - parseInt(lastSubjectUpdate)) >= 86400000) {
      todaySubject = getRandomSubject();
      localStorage.setItem("today_subject", JSON.stringify(todaySubject));
      localStorage.setItem("last_subject_update", now.toString());
    } else {
      todaySubject = JSON.parse(localStorage.getItem("today_subject"));
    }
    setCurrentSubject(todaySubject);
    setCurrentDateTime(getCurrentDateTime());

    // Fetch attendance from backend
    fetchAttendance().then(data => {
      setAttendanceList(data);
      // Find today's attendance by matching SessionDate to today (YYYY-MM-DD)
      const todayStr = new Date().toISOString().split("T")[0];
      const found = data.find(item => item.SessionDate && item.SessionDate.startsWith(todayStr));
      setAttendanceToday(found);
    });

    // Cek status verifikasi
    const gpsVerified = localStorage.getItem("gps_verified") === "true";
    const wifiVerified = localStorage.getItem("wifi_verified") === "true";
    setIsVerified(gpsVerified && wifiVerified);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Update check-in/check-out window every minute
  useEffect(() => {
    if (!currentDateTime) return;
    const now = new Date();
    const { startHour, endHour } = parseTime(currentDateTime) || {};
    if (startHour == null || endHour == null) {
      setCanCheckin(false);
      setCanCheckout(false);
      return;
    }
    // Build today's date with class start/end
    const classStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, 0, 0, 0);
    const classEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, 0, 0, 0);

    // Check-in: allowed from classStart to classStart+10min
    const checkinOpen = classStart;
    const checkinClose = new Date(classStart.getTime() + 10 * 60000);

    // Check-out: allowed from classEnd-10min to classEnd
    const checkoutOpen = new Date(classEnd.getTime() - 10 * 60000);
    const checkoutClose = classEnd;

    setCanCheckin(now >= checkinOpen && now <= checkinClose);
    setCanCheckout(now >= checkoutOpen && now <= checkoutClose);
  }, [currentDateTime]);

  // Auto notification for check-in/check-out
  useEffect(() => {
    if (!currentDateTime) return;
    let notif = "";
    if (canCheckin) {
      notif = "⚠️ Check-in is open! Please check-in within 10 minutes after class starts.";
    } else if (canCheckout) {
      notif = "⚠️ Check-out is open! Please check-out within 10 minutes before class ends.";
    }
    setAutoNotif(notif);

    if (notif) {
      const timer = setTimeout(() => setAutoNotif(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [canCheckin, canCheckout, currentDateTime]);

  const handleCheckin = async () => {
    if (!isVerified) {
      setAutoNotif("⚠️ Please complete GPS and WiFi verification before check-in.");
      setTimeout(() => setAutoNotif(""), 4000);
      return;
    }
    setModalCaption("Processing check-in...");
    setShowModal(true);

    // Find the upcoming attendance record (first in sortedAttendanceList)

    // 1. Get active class
    const upcoming = attendanceList.find(item => isCheckinAvailable(item) && !item.checkInTime);
    
    // 2. Check if we can check in 
    const canCheckinNow = isCheckinAvailable(upcoming) && !upcoming.checkInTime && isVerified;
    if (!upcoming) {
      setShowModal(false);
      setAutoNotif("No upcoming attendance record found.");
      setTimeout(() => setAutoNotif(""), 4000);
      return;
    }


    try {
      // 3. Get check in time
      const now = new Date();
      const checkInTime = now.toTimeString().split(" ")[0]; // 'HH:MM:SS'

      // 4. Call backend API
      await patchAttendance(upcoming.id, { checkInTime, attendanceStatus: true });

      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg("Successfully checked in!");
        setTimeout(() => setSuccessMsg(""), 1500);
        // Optionally, refetch attendance data here
      }, 1500);
    } catch (err) {
      setShowModal(false);
      setAutoNotif("Failed to check in. Please try again.");
      setTimeout(() => setAutoNotif(""), 4000);
    }
  };

  const handleCheckout = async () => {
    if (!isVerified) {
      setAutoNotif("⚠️ Please complete GPS and WiFi verification before check-out.");
      setTimeout(() => setAutoNotif(""), 4000);
      return;
    }
    setModalCaption("Processing check-out...");
    setShowModal(true);

    // Find the upcoming attendance record (first in sortedAttendanceList)
    const upcoming = attendanceList.find(item => isCheckoutAvailable(item) && !item.checkOutTime);
    const canCheckoutNow = isCheckoutAvailable(upcoming) && !upcoming.checkOutTime && isVerified;
    if (!upcoming) {
      setShowModal(false);
      setAutoNotif("No upcoming attendance record found.");
      setTimeout(() => setAutoNotif(""), 4000);
      return;
    }
    try {
      const now = new Date();
      const checkOutTime = now.toTimeString().split(" ")[0]; // 'HH:MM:SS'
      await patchAttendance(upcoming.id, { checkOutTime });
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg("Successfully checked out!");
        setTimeout(() => setSuccessMsg(""), 1500);
        // Optionally, refetch attendance data here
      }, 1500);
    } catch (err) {
      setShowModal(false);
      setAutoNotif("Failed to check out. Please try again.");
      setTimeout(() => setAutoNotif(""), 4000);
    }
  };

  const saveAttendance = (type) => {
    let attendance = JSON.parse(localStorage.getItem("attendance_history") || "[]");
    let found = attendance.find(item => item.time === currentDateTime);
    
    if (!found) {
      found = {
        subject: currentSubject?.name || "No Subject",
        lecturer: currentSubject?.lecturer || "No Lecturer",
        time: currentDateTime,
        checkin: "Not Yet",
        checkout: "Not Yet",
      };
      attendance.push(found);
    }
    
    if (type === "checkin") found.checkin = "Done";
    if (type === "checkout") found.checkout = "Done";
    
    localStorage.setItem("attendance_history", JSON.stringify(attendance));
  };

  if (!currentSubject || !currentDateTime) {
    return <div>Loading...</div>;
  }

  // Before rendering attendanceList, sort by date and time
  const sortedAttendanceList = attendanceList.slice().sort((a, b) => {
    // Compare date first
    const dateA = new Date(a.SessionDate);
    const dateB = new Date(b.SessionDate);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    // If same date, compare sessionHourStart (as string 'HH:MM:SS')
    if (a.sessionHourStart && b.sessionHourStart) {
      return a.sessionHourStart.localeCompare(b.sessionHourStart);
    }
    return 0;
  });

  // Only show upcoming or ongoing sessions (not ended)
  const now = new Date();
  const filteredAttendanceList = sortedAttendanceList.filter(item => {
    if (!item.SessionDate || !item.sessionHourEnd) return false;
    const endDateTime = new Date(`${item.SessionDate}T${item.sessionHourEnd}`);
    return endDateTime >= now;
  });

  // Before rendering, get the upcoming schedule and check-in status
  const upcoming = filteredAttendanceList[0];
  const canCheckinNow = isCheckinAvailable(upcoming) && !upcoming.checkInTime && isVerified;
  const canCheckoutNow = isCheckoutAvailable(upcoming) && !upcoming.checkOutTime && isVerified;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <nav className="text-sm text-gray-600 mb-4 flex items-center space-x-1">
            <span className="text-gray-400">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Check-in & Check-out</span>
          </nav>

          <h2 className="text-3xl font-semibold text-center text-blue-900 mb-10">
            AbsenGo Check-in and Check-out
          </h2>

          <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0 items-start justify-center w-full">
            {/* Subject Schedules Card List */}
            <div className="space-y-4 w-full max-w-md mx-auto">
              <h3 className="text-blue-600 text-sm font-semibold mb-4">
                Subject Schedules
              </h3>
              {filteredAttendanceList.length === 0 ? (
                <div className="italic text-gray-400">No attendance records found.</div>
              ) : (
                <>
                  <div className="text-blue-600 text-sm font-semibold mb-2">Upcoming Schedule</div>
                  <div className="bg-white rounded-lg shadow-md p-4 border mb-4">
                    <div className="mb-1"><span className="font-medium">Course: </span>{filteredAttendanceList[0].CourseName || filteredAttendanceList[0].ClassID}</div>
                    <div className="mb-1"><span className="font-medium">Lecturer: </span>{filteredAttendanceList[0].lecturerFirstName || "-"} {filteredAttendanceList[0].lecturerLastName || ""}</div>
                    <div className="mb-1"><span className="font-medium">Date: </span>{formatDate(filteredAttendanceList[0].SessionDate)}</div>
                    <div className="mb-1"><span className="font-medium">Time: </span>{filteredAttendanceList[0].sessionHourStart && filteredAttendanceList[0].sessionHourEnd ? `${filteredAttendanceList[0].sessionHourStart} - ${filteredAttendanceList[0].sessionHourEnd}` : '-'}</div>
                    <div className="mb-1"><span className="font-medium">Check-in Status: </span>{filteredAttendanceList[0].checkInTime ? "Done" : "Not Yet"}</div>
                    <div><span className="font-medium">Check-out Status: </span>{filteredAttendanceList[0].checkOutTime ? "Done" : "Not Yet"}</div>
                  </div>
                  {filteredAttendanceList.length > 1 && (
                    <>
                      <div className="text-blue-600 text-sm font-semibold mb-2">Next Schedule</div>
                      {filteredAttendanceList.slice(1).map((item, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-md p-4 border mb-4">
                          <div className="mb-1"><span className="font-medium">Course: </span>{item.CourseName || item.ClassID}</div>
                          <div className="mb-1"><span className="font-medium">Lecturer: </span>{item.lecturerFirstName || "-"} {item.lecturerLastName || ""}</div>
                          <div className="mb-1"><span className="font-medium">Date: </span>{formatDate(item.SessionDate)}</div>
                          <div className="mb-1"><span className="font-medium">Time: </span>{item.sessionHourStart && item.sessionHourEnd ? `${item.sessionHourStart} - ${item.sessionHourEnd}` : '-'}</div>
                          <div className="mb-1"><span className="font-medium">Check-in Status: </span>{item.checkInTime ? "Done" : "Not Yet"}</div>
                          <div><span className="font-medium">Check-out Status: </span>{item.checkOutTime ? "Done" : "Not Yet"}</div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
            {/* Check-in and Check-out Section */}
            <div className="space-y-10 text-center w-full max-w-xs">
              <div>
                <p className="text-blue-600 font-medium text-lg mb-2">
                  Check-in Verification
                </p>
                <button
                  onClick={handleCheckin}
                  disabled={upcoming && upcoming.checkInTime || !canCheckinNow}
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow ${(upcoming && upcoming.checkInTime) || !canCheckinNow ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {upcoming && upcoming.checkInTime
                    ? "Already Checked In"
                    : !isVerified
                      ? "Verify First"
                      : !canCheckinNow
                        ? "Check-in not available"
                        : "Check-in"}
                </button>
                {!isVerified && (
                  <div className="text-xs text-red-500 mt-1">
                    Please complete GPS and WiFi verification first.
                  </div>
                )}
                {!canCheckinNow && isVerified && (
                  <div className="text-xs text-red-500 mt-1">
                    Check-in only available within 10 minutes after class starts.
                  </div>
                )}
              </div>
              <div>
                <p className="text-blue-600 font-medium text-lg mb-2">
                  Check-out Verification
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={upcoming && upcoming.checkOutTime || !canCheckoutNow}
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow ${(upcoming && upcoming.checkOutTime) || !canCheckoutNow ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {upcoming && upcoming.checkOutTime
                    ? "Already Checked Out"
                    : !isVerified
                      ? "Verify First"
                      : !canCheckoutNow
                        ? "Check-out not available"
                        : "Check-out"}
                </button>
                {!isVerified && (
                  <div className="text-xs text-red-500 mt-1">
                    Please complete GPS and WiFi verification first.
                  </div>
                )}
                {!canCheckoutNow && isVerified && !(upcoming && upcoming.checkOutTime) && (
                  <div className="text-xs text-red-500 mt-1">
                    Check-out only available within 10 minutes before class ends.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Auto Notification */}
          {autoNotif && (
            <div className="fixed top-20 right-8 z-50 bg-blue-100 border border-blue-300 text-blue-800 px-6 py-3 rounded shadow animate-pop">
              {autoNotif}
            </div>
          )}

          {/* Modal and Success Message */}
          {(showModal || successMsg) && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-8 flex flex-col items-center">
                {showModal && (
                  <>
                    <div className="loader mb-4"></div>
                    <p className="text-blue-700 font-medium">{modalCaption}</p>
                  </>
                )}
                {successMsg && (
                  <>
                    <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-600 font-bold text-xl">{successMsg}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckinCheckout;
