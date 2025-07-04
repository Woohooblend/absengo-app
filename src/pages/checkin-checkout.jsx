import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";
import { getRandomSubject, getCurrentDateTime } from "../utils/subjects";

const CheckinCheckout = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalCaption, setModalCaption] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [checkinStatus, setCheckinStatus] = useState("Not Yet");
  const [checkoutStatus, setCheckoutStatus] = useState("Not Yet");
  const [canCheckin, setCanCheckin] = useState(false);
  const [canCheckout, setCanCheckout] = useState(false);
  const [autoNotif, setAutoNotif] = useState(""); // for auto notification

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
    // Get today's subject from localStorage or generate new one
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

    // Set initial states
    setCurrentSubject(todaySubject);
    setCurrentDateTime(getCurrentDateTime());

    // Load attendance status
    const attendance = JSON.parse(localStorage.getItem("attendance_history") || "[]");
    const today = getCurrentDateTime();
    const found = attendance.find(item => item.time === today);
    if (found) {
      setCheckinStatus(found.checkin);
      setCheckoutStatus(found.checkout);
    }

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
    if (checkinStatus !== "Done" && canCheckin) {
      notif = "⚠️ Check-in is open! Please check-in within 10 minutes after class starts.";
    } else if (checkoutStatus !== "Done" && canCheckout) {
      notif = "⚠️ Check-out is open! Please check-out within 10 minutes before class ends.";
    }
    setAutoNotif(notif);

    if (notif) {
      const timer = setTimeout(() => setAutoNotif(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [canCheckin, canCheckout, checkinStatus, checkoutStatus, currentDateTime]);

  const handleCheckin = () => {
    setModalCaption("Processing check-in...");
    setShowModal(true);
    
    setTimeout(() => {
      setShowModal(false);
      setSuccessMsg("Successfully checked in!");
      saveAttendance("checkin");
      setCheckinStatus("Done");
      setTimeout(() => setSuccessMsg(""), 1500);
    }, 1500);
  };

  const handleCheckout = () => {
    setModalCaption("Processing check-out...");
    setShowModal(true);
    
    setTimeout(() => {
      setShowModal(false);
      setSuccessMsg("Successfully checked out!");
      saveAttendance("checkout");
      setCheckoutStatus("Done");
      setTimeout(() => setSuccessMsg(""), 1500);
    }, 1500);
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

          <div className="flex flex-col items-center justify-center space-y-8 md:flex-row md:space-y-0 md:space-x-12">
            <div className="bg-white rounded-lg shadow-md p-6 w-[320px]">
              <h3 className="text-blue-600 text-sm font-semibold mb-4">
                Subject Schedules | Today
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Subject: </span>
                  {currentSubject.name}
                </div>
                <div>
                  <span className="font-medium">Lecturer: </span>
                  {currentSubject.lecturer}
                </div>
                <div>
                  <span className="font-medium">Time: </span>
                  {currentDateTime}
                </div>
                <div>
                  <span className="font-medium">Check-in Status: </span>
                  {checkinStatus}
                </div>
                <div>
                  <span className="font-medium">Check-out Status: </span>
                  {checkoutStatus}
                </div>
              </div>
            </div>

            <div className="space-y-10 text-center">
              <div>
                <p className="text-blue-600 font-medium text-lg mb-2">
                  Check-in Verification
                </p>
                <button
                  onClick={handleCheckin}
                  disabled={checkinStatus === "Done" || !canCheckin}
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow ${
                    checkinStatus === "Done" || !canCheckin ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {checkinStatus === "Done"
                    ? "Already Checked In"
                    : !canCheckin
                      ? "Check-in not available"
                      : "Check-in"}
                </button>
                {!canCheckin && checkinStatus !== "Done" && (
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
                  disabled={checkoutStatus === "Done" || !canCheckout}
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow ${
                    checkoutStatus === "Done" || !canCheckout ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {checkoutStatus === "Done"
                    ? "Already Checked Out"
                    : !canCheckout
                      ? "Check-out not available"
                      : "Check-out"}
                </button>
                {!canCheckout && checkoutStatus !== "Done" && (
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
