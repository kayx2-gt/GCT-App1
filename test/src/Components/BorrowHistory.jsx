import React from "react";

export default function BorrowHistory({ borrowHistory }) {
  return (
    <div className="borrow-panel right-panel">
      <h2>📚 Borrow History</h2>

      {borrowHistory.length > 0 ? (
        <div className="table-scroll">
          <table className="books-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Status</th>
                <th>Borrow Date</th>
                <th>Returned</th>
              </tr>
            </thead>
            <tbody>
              {borrowHistory.map((h) => (
                <tr key={h.id}>
                  <td>{h.student_name}</td>
                  <td>{h.book_title}</td>
                  <td className={h.status === "Not Approved" ? "status-denied" : "status-returned"}>
                    {h.status === "Not Approved" ? "❌ Not Approved" : "📗 Returned"}
                  </td>
                  <td>{new Date(h.borrow_date).toLocaleString()}</td>
                  <td>{h.return_date ? new Date(h.return_date).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-msg">No history yet.</p>
      )}
    </div>
  );
}
