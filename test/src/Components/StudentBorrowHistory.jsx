// 📘 StudentBorrowHistory.jsx
import React, { useEffect, useState } from "react";
import API_URL from "../config";
import "../StudentBorrowHistory.css";

export default function StudentBorrowHistory({ studentId }) {
  const [current, setCurrent] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchBorrowHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/borrow/history/${studentId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          // 🟢 Show only active or ongoing statuses in "current"
          setCurrent(
            data.filter(
              (r) =>
                r.status === "Borrowed" ||
                r.status === "Received" ||
                r.status === "Approved" ||
                r.status === "Claimable" ||
                r.status === "Pending Approval"
            )
          );

          // 🟦 Move both Returned and Not Approved to "history"
          setHistory(
            data.filter(
              (r) => r.status === "Returned" || r.status === "Not Approved"
            )
          );
        }
      } catch (err) {
        console.error("Error fetching borrow history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistory();
  }, [studentId]);

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
        setCurrent((prev) => prev.filter((r) => r.id !== recordId));
        setHistory((prev) => [
          ...prev,
          { ...data.updatedRecord, status: "Returned" },
        ]);
      } else {
        alert("⚠️ Failed to return book: " + data.message);
      }
    } catch (err) {
      console.error("Error returning book:", err);
      alert("⚠️ Something went wrong while returning the book.");
    }
  };

  // ✅ Admin: Approve or Deny borrow requests (with reasons)
  const updateBorrowStatus = async (recordId, newStatus) => {
    let reason = "";

    if (newStatus === "Not Approved") {
      // 🧠 Ask admin for a reason when denying
      const reasons = [
        "Book is not available at the moment",
        "Student has reached borrowing limit",
        "Book is reserved for another student",
      ];

      let message = "Select a reason for not approving:\n";
      reasons.forEach((r, i) => {
        message += `${i + 1}. ${r}\n`;
      });
      message += "Enter number (1–3) or type your own reason:";

      const input = prompt(message);

      if (input === null) return; // canceled
      const index = parseInt(input) - 1;

      // Pick reason from list or use custom text
      reason = reasons[index] || input.trim();

      if (!reason) {
        alert("⚠️ Please provide a reason before denying.");
        return;
      }
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

        if (newStatus === "Not Approved") {
          setCurrent((prev) => prev.filter((r) => r.id !== recordId));
          setHistory((prev) => [
            ...prev,
            { ...data.updatedRecord, status: "Not Approved", reason },
          ]);
        } else {
          // For other updates (Approved, Borrowed, Returned, etc.)
          setCurrent((prev) =>
            prev.map((r) =>
              r.id === recordId ? { ...r, status: newStatus } : r
            )
          );
        }
      } else {
        alert("❌ Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("⚠️ Server error updating status.");
    }
  };

  if (loading)
    return <p className="loading-msg">⏳ Loading borrow history...</p>;

  return (
    <div className="borrow-history-container">
      {/* 🟦 CURRENT / ACTIVE SECTION */}
      <section className="borrow-section current-borrowed">
        <h2>📘 Active Borrow Requests / Books</h2>
        {current.length > 0 ? (
          <table className="books-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Title</th>
                <th>Date Borrowed</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {current.map((record) => (
                <tr key={record.id}>
                  <td>{record.book_id}</td>
                  <td>{record.book_title}</td>
                  <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
                  <td>{new Date(record.due_date).toLocaleDateString()}</td>
                  <td
                    className={`status-${record.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {record.status}
                  </td>
                  <td>
                    {record.status === "Pending Approval" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() =>
                            updateBorrowStatus(record.id, "Claimable")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="deny-btn"
                          onClick={() =>
                            updateBorrowStatus(record.id, "Not Approved")
                          }
                        >
                          Deny
                        </button>
                      </>
                    )}

                    {/* 🟢 Once approved, show “Claimed” button */}
                    {record.status === "Claimable" && (
                      <button
                        className="claim-btn"
                        onClick={() =>
                          updateBorrowStatus(record.id, "Borrowed")
                        }
                      >
                        Claimed ✅
                      </button>
                    )}

                    {/* 📘 Once borrowed, show “Returned” button */}
                    {record.status === "Borrowed" && (
                      <button
                        className="return-btn"
                        onClick={() =>
                          handleReturn(record.id, record.book_id)
                        }
                      >
                        Returned 📦
                      </button>
                    )}

                    {record.status === "Not Approved" && (
                      <span className="denied">❌ Not Approved</span>
                    )}

                    {record.status === "Returned" && (
                      <span className="status-returned">📗 Returned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-msg">No active or pending borrow requests.</p>
        )}
      </section>

      {/* 🟩 HISTORY SECTION */}
      <section className="borrow-section borrow-history">
        <h2>📚 Borrow History</h2>
        {history.length > 0 ? (
          <table className="books-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Title</th>
                <th>Date Borrowed</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Reason (if Not Approved)</th>
                <th>Date Returned</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id}>
                  <td>{record.book_id}</td>
                  <td>{record.book_title}</td>
                  <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
                  <td>{new Date(record.due_date).toLocaleDateString()}</td>
                  <td
                    className={
                      record.status === "Not Approved"
                        ? "status-denied"
                        : "status-returned"
                    }
                  >
                    {record.status === "Not Approved"
                      ? "❌ Not Approved"
                      : "📗 Returned"}
                  </td>
                  <td>{record.reason || "—"}</td>
                  <td>
                    {record.return_date
                      ? new Date(record.return_date).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-msg">No past borrow history yet.</p>
        )}
      </section>
    </div>
  );
}
