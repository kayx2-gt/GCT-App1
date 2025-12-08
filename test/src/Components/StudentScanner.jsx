import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API_URL from "../config";
import "../Navbar.css";
import "../StudentScanner.css";

export default function StudentScanner() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [borrowHistory, setBorrowHistory] = useState({ current: [], history: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [scannerActive, setScannerActive] = useState(false);

  const lastScanRef = useRef("");
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isRunningRef.current) {
      try {
        await scannerRef.current.stop(); // stop camera only
      } catch (err) {
        console.warn("Stop error:", err.message);
      } finally {
        isRunningRef.current = false;
        setScannerActive(false);
      }
    }
  }, []);

  // Fetch borrow history and return the processed data
  const fetchBorrowHistory = async (studentId) => {
    try {
      const res = await fetch(`${API_URL}/api/borrow/history/${studentId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const processed = {
          current: data.filter(
            (r) =>
              r.status === "Borrowed" ||
              r.status === "Received" ||
              r.status === "Approved" ||
              r.status === "Claimable" ||
              r.status === "Pending Approval"
          ),
          history: data.filter(
            (r) => r.status === "Returned" || r.status === "Not Approved"
          ),
        };
        setBorrowHistory(processed);
        return processed; // <-- return for immediate use
      }
      return { current: [], history: [] };
    } catch (err) {
      console.error("Error fetching borrow history:", err);
      setBorrowHistory({ current: [], history: [] });
      return { current: [], history: [] };
    }
  };

  // Handle scan
  const handleScan = useCallback(
    async (qrText) => {
      if (!qrText) return;
      if (qrText === lastScanRef.current) return;
      lastScanRef.current = qrText;
      setTimeout(() => (lastScanRef.current = ""), 5000);

      try {
        let parsed;
        try {
          parsed = JSON.parse(qrText);
        } catch {
          parsed = { id: qrText };
        }
        if (!parsed.id) throw new Error("Invalid QR");

        const res = await fetch(`${API_URL}/api/students/${parsed.id}`);
        if (!res.ok) throw new Error("Student not found");

        const student = await res.json();
        setStudentInfo(student);
        setError("");

        // Fetch borrow history and get latest data for automatic action
        const latestHistory = await fetchBorrowHistory(student.id);

        // Stop scanner after successful scan
        stopScanner();

        // AUTOMATIC ACTION: check for the first eligible action
        const activeBorrow = latestHistory.current[0]; // take first book
        if (activeBorrow) {
          if (activeBorrow.status === "Pending Approval") {
            if (window.confirm(`Approve book "${activeBorrow.book_title}" for this student?`)) {
              updateBorrowStatus(activeBorrow.id, "Claimable");
            }
          } else if (activeBorrow.status === "Claimable") {
            if (window.confirm(`Mark book "${activeBorrow.book_title}" as claimed?`)) {
              updateBorrowStatus(activeBorrow.id, "Borrowed");
            }
          } else if (activeBorrow.status === "Borrowed") {
            if (window.confirm(`Mark book "${activeBorrow.book_title}" as returned?`)) {
              handleReturn(activeBorrow.id, activeBorrow.book_id);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError("Invalid or unregistered QR code");
        setStudentInfo(null);
        setBorrowHistory({ current: [], history: [] });
      }
    },
    [stopScanner] // no need to include borrowHistory anymore
  );

  const startScanner = useCallback(async () => {
    setLoading(true);
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader");
    } else if (isRunningRef.current) {
      return; // prevent double start bug
    }

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        handleScan,
        () => {}
      );
      isRunningRef.current = true;
      setScannerActive(true);
      setError("");
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera blocked or not supported");
    } finally {
      setLoading(false);
    }
  }, [handleScan]);

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    startScanner();

    return () => stopScanner();
  }, [startScanner, stopScanner]);

  // --- Borrow history actions ---
  const handleReturn = async (recordId, bookId) => {
    if (!window.confirm("Are you sure this book has been returned?")) return;
    try {
      const res = await fetch(`${API_URL}/api/borrow/return/${recordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Book successfully returned!");
        setBorrowHistory((prev) => ({
          current: prev.current.filter((r) => r.id !== recordId),
          history: [...prev.history, { ...data.updatedRecord, status: "Returned" }],
        }));
      } else {
        alert("⚠️ Failed to return book: " + data.message);
      }
    } catch (err) {
      console.error("Error returning book:", err);
      alert("⚠️ Something went wrong while returning the book.");
    }
  };

  const updateBorrowStatus = async (recordId, newStatus) => {
    let reason = "";
    if (newStatus === "Not Approved") {
      const reasons = [
        "Book is not available at the moment",
        "Student has reached borrowing limit",
        "Book is reserved for another student",
      ];
      let message = "Select a reason for not approving:\n";
      reasons.forEach((r, i) => { message += `${i + 1}. ${r}\n`; });
      message += "Enter number (1–3) or type your own reason:";
      const input = prompt(message);
      if (input === null) return;
      const index = parseInt(input) - 1;
      reason = reasons[index] || input.trim();
      if (!reason) { alert("⚠️ Please provide a reason before denying."); return; }
    }

    try {
      const res = await fetch(`${API_URL}/api/borrow/update-status/${recordId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason }),
      });
      const data = await res.json();
      if (data.success) {
        alert(
          newStatus === "Not Approved"
            ? `❌ Request denied.\nReason: ${reason}`
            : `✅ Status updated to "${newStatus}"`
        );
        setBorrowHistory((prev) => ({
          current: prev.current.map((r) =>
            r.id === recordId ? { ...r, status: newStatus, reason } : r
          ).filter(r => r.status !== "Not Approved"),
          history: newStatus === "Not Approved"
            ? [...prev.history, { ...data.updatedRecord, status: "Not Approved", reason }]
            : prev.history,
        }));
      } else {
        alert("❌ Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("⚠️ Server error updating status.");
    }
  };

  return (
    <div className="student-scanner">
      <h2>Scan Student QR Code</h2>

      <div className="scanner-container">
        <div id="qr-reader" className="qr-reader"></div>
        {loading && <span className="scanner-status">📷 Starting camera...</span>}
        {error && !loading && <span className="scanner-error">⚠️ {error}</span>}
      </div>

      <div className="scanner-controls">
        {!scannerActive && (
          <button className="scanner-btn start" onClick={startScanner}>Start Scanner</button>
        )}
        {scannerActive && (
          <button className="scanner-btn stop" onClick={stopScanner}>Stop Scanner</button>
        )}
      </div>

      {studentInfo && (
        <>
          <div className="student-info-card">
            <h3>{studentInfo.fullname}</h3>
            <img
              src={studentInfo.photo ? `${API_URL}/uploads/${studentInfo.photo}` : "/Assets/manager.png"}
              alt="Student"
              className="student-photo"
            />
            <p><strong>Student No:</strong> {studentInfo.studentNo}</p>
            <p><strong>Library Card:</strong> {studentInfo.libraryCardNo}</p>
            <p><strong>Course & Year:</strong> {studentInfo.courseYear}</p>
            <p><strong>Status:</strong> {studentInfo.status}</p>
          </div>

          <div className="qr-borrow-history-container">
            <h2>📘 Current Borrowed Books</h2>
            {borrowHistory.current.length > 0 ? (
              <div className="qr-borrow-grid">
                {borrowHistory.current.map((r) => (
                  <div key={r.id} className="qr-borrow-card">
                    <div className="qr-borrow-cover">
                      <img
                        src={
                          r.cover_image
                            ? `${API_URL}/uploads/${r.cover_image}`
                            : "https://via.placeholder.com/120x180?text=No+Cover"
                        }
                        alt={r.book_title}
                      />
                      <p className="qr-borrow-title">{r.book_title}</p>
                    </div>
                    <div className="qr-borrow-info">
                      <p><strong>ID:</strong> {r.book_id}</p>
                      <p><strong>Date Borrowed:</strong> {new Date(r.borrow_date).toLocaleDateString()}</p>
                      <p><strong>Due Date:</strong> {new Date(r.due_date).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {r.status}</p>
                      {r.reason && <p><strong>Reason:</strong> {r.reason}</p>}
                      {r.return_date && <p><strong>Date Returned:</strong> {new Date(r.return_date).toLocaleDateString()}</p>}
                      <div className="qr-borrow-actions">
                        {r.status === "Pending Approval" && (
                          <>
                            <button
                              className="qr-approve-btn"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to approve this book?")) {
                                  updateBorrowStatus(r.id, "Claimable");
                                }
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="qr-deny-btn"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to deny this book?")) {
                                  updateBorrowStatus(r.id, "Not Approved");
                                }
                              }}
                            >
                              Deny
                            </button>
                          </>
                        )}
                        {r.status === "Claimable" && (
                          <button
                            className="qr-claim-btn"
                            onClick={() => {
                              if (window.confirm("Mark this book as claimed?")) {
                                updateBorrowStatus(r.id, "Borrowed");
                              }
                            }}
                          >
                            Claimed ✅
                          </button>
                        )}
                        {r.status === "Borrowed" && (
                          <button
                            className="qr-return-btn"
                            onClick={() => {
                              if (window.confirm("Mark this book as returned?")) {
                                handleReturn(r.id, r.book_id);
                              }
                            }}
                          >
                            Returned 📦
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="qr-empty-msg">No active borrowed books.</p>
            )}

            <h2>📚 Borrow History</h2>
            {borrowHistory.history.length > 0 ? (
              <div className="qr-borrow-grid">
                {borrowHistory.history.map((r) => (
                  <div key={r.id} className="qr-borrow-card">
                    <div className="qr-borrow-cover">
                      <img
                        src={
                          r.cover_image
                            ? `${API_URL}/uploads/${r.cover_image}`
                            : "https://via.placeholder.com/120x180?text=No+Cover"
                        }
                        alt={r.book_title}
                      />
                      <p className="qr-borrow-title">{r.book_title}</p>
                    </div>
                    <div className="qr-borrow-info">
                      <p><strong>ID:</strong> {r.book_id}</p>
                      <p><strong>Date Borrowed:</strong> {new Date(r.borrow_date).toLocaleDateString()}</p>
                      <p><strong>Due Date:</strong> {new Date(r.due_date).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {r.status === "Not Approved" ? "❌ Not Approved" : "📗 Returned"}</p>
                      {r.reason && <p><strong>Reason:</strong> {r.reason}</p>}
                      {r.return_date && <p><strong>Date Returned:</strong> {new Date(r.return_date).toLocaleDateString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="qr-empty-msg">No borrow history yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
