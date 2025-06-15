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

  useEffect(() => {
    // Check if we need new subject for today
    const lastSubjectUpdate = localStorage.getItem("last_subject_update");
    const now = new Date().getTime();
    
    let todaySubject;
    
    if (!lastSubjectUpdate || (now - parseInt(lastSubjectUpdate)) >= 86400000) {
      // If no subject set or 24 hours passed, get new random subject
      todaySubject = getRandomSubject();
      localStorage.setItem("today_subject", JSON.stringify(todaySubject));
      localStorage.setItem("last_subject_update", now.toString());
    } else {
      // Use existing subject for today
      todaySubject = JSON.parse(localStorage.getItem("today_subject"));
    }

    // Set subject and time
    setCurrentSubject(todaySubject);
    setCurrentDateTime(getCurrentDateTime());

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 60000);

    // Load existing attendance
    const attendance = JSON.parse(localStorage.getItem("attendance_history") || "[]");
    const today = getCurrentDateTime();
    const found = attendance.find(item => item.time === today);
    if (found) {
      setCheckinStatus(found.checkin);
      setCheckoutStatus(found.checkout);
    }

    // Clean up timer
    return () => clearInterval(timer);
  }, []);

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
        subject: currentSubject.name,
        lecturer: currentSubject.lecturer,
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-4 flex items-center space-x-1">
            <span className="text-gray-400">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Check-in & Check-out</span>
          </nav>

          {/* Page Title */}
          <h2 className="text-3xl font-semibold text-center text-blue-900 mb-10">
            AbsenGo Check-in and Check-out
          </h2>

          {/* Content Wrapper */}
          <div className="flex flex-col items-center justify-center space-y-8 md:flex-row md:space-y-0 md:space-x-12">
            {/* Card */}
            <div className="bg-white rounded-lg shadow-md p-6 w-[320px]">
              <h3 className="text-blue-600 text-sm font-semibold mb-4">
                Subject Schedules | Today
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Subjects: </span>
                  {currentSubject?.name} {/* Menggunakan currentSubject.name */}
                </div>
                <div>
                  <span className="font-medium">Lecturer: </span>
                  {currentSubject?.lecturer} {/* Menggunakan currentSubject.lecturer */}
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

            {/* Check-in and Check-out Section */}
            <div className="space-y-10 text-center">
              <div>
                <p className="text-blue-600 font-medium text-lg mb-2">
                  Check-in Verification
                </p>
                <button
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow ${checkinStatus === "Done" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => {
                    if (checkinStatus === "Done") {
                      alert("You already checked in.");
                    } else {
                      handleCheckin();
                    }
                  }}
                >
                  {checkinStatus === "Done" ? "You already checked in" : "Check-in"}
                </button>
              </div>

              <div>
                <p className="text-blue-600 font-medium text-lg mb-2">
                  Check-out Verification
                </p>
                <button
                  className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow ${checkoutStatus === "Done" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => {
                    if (checkoutStatus === "Done") {
                      alert("You already checked out.");
                    } else {
                      handleCheckout();
                    }
                  }}
                >
                  {checkoutStatus === "Done" ? "You already checked out" : "Check-out"}
                </button>
              </div>
            </div>
          </div>

          {/* Modal Loading & Success */}
          {(showModal || successMsg) && (
            <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50 transition-opacity duration-300">
              <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg animate-pop">
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
          {/* Loader & Pop Up Animation CSS */}
          <style>
            {`
              .loader {
                border: 4px solid #e0e0e0;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
              }
              .animate-pop {
                animation: pop 0.3s cubic-bezier(0.4,0,0.2,1);
              }
              @keyframes pop {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default CheckinCheckout;
