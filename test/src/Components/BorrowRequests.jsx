import React from "react";

export default function BorrowRequests({
  borrowRequests,
  updateBorrowStatus,
  handleReturn,
}) {
  return (
    <div className="borrow-panel left-panel">
      <h2>📘 Borrow Requests</h2>

      {borrowRequests.length > 0 ? (
        <div className="table-scroll">
          <table className="books-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Status</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowRequests.map((r) => (
                <tr key={r.id}>
                  <td>{r.student_name}</td>
                  <td>{r.book_title}</td>
                  <td className={`status-${r.status.toLowerCase().replace(" ", "-")}`}>
                    {r.status}
                    {/* Show reason if request was denied */}
                    {r.status === "Not Approved" && r.reason && (
                      <p className="reason-text">{r.reason}</p>
                    )}
                    {/* Show last updated timestamp */}
                    {r.updated_at && (
                      <p className="updated-text">
                        {new Date(r.updated_at).toLocaleString()}
                      </p>
                    )}
                  </td>
                  <td>{r.borrow_date ? new Date(r.borrow_date).toLocaleString() : "-"}</td>
                  <td>{r.due_date ? new Date(r.due_date).toLocaleString() : "-"}</td>
                  <td>
                    {r.status === "Pending Approval" && (
                      <>
                        <button onClick={() => updateBorrowStatus(r.id, "Claimable")}>
                          Approve
                        </button>
                        <button onClick={() => updateBorrowStatus(r.id, "Not Approved")}>
                          Deny
                        </button>
                      </>
                    )}

                    {r.status === "Claimable" && (
                      <button onClick={() => updateBorrowStatus(r.id, "Borrowed")}>
                        Claimed ✅
                      </button>
                    )}

                    {r.status === "Borrowed" && (
                      <button onClick={() => handleReturn(r.id, r.book_id)}>
                        Returned 📦
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-msg">No borrow requests.</p>
      )}
    </div>
  );
}
