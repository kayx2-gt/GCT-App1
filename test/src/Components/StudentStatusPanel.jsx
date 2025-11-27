import React from "react";
import API_URL from "../config";

export default function StudentStatusPanel({ feedbackMessage, studentRequests }) {
  // Helper to format timestamp nicely
  const formatTimestamp = (ts) => {
    if (!ts) return "-";
    const date = new Date(ts);
    return date.toLocaleString(); // e.g., "11/26/2025, 12:34:56 PM"
  };

  // Helper to get status message / reason
  const getStatusMessage = (req) => {
    switch (req.status) {
      case "Claimable":
        return "Go to GCT Library to claim";
      case "Not Approved":
        return req.reason || req.message || "Request not approved";
      default:
        return req.message || "";
    }
  };

  return (
    <div className="student-status-panel">
      <h3>📖 Your Book Requests</h3>

      {feedbackMessage && <div className="borrow-feedback">{feedbackMessage}</div>}

      {/* ACTIVE REQUESTS */}
      {studentRequests.filter(req =>
        ["Pending Approval", "Claimable", "Borrowed"].includes(req.status)
      ).length > 0 ? (
        <div className="request-list">
          {studentRequests
            .filter(req =>
              ["Pending Approval", "Claimable", "Borrowed"].includes(req.status)
            )
            .map(req => (
              <div key={req.id} className="request-item">
                <div className="request-cover">
                  {req.cover_image || req.book?.cover_image ? (
                    <img
                      src={`${API_URL}/uploads/${req.cover_image || req.book.cover_image}`}
                      alt={req.book_title || req.book?.title || "Untitled"}
                    />
                  ) : (
                    <div className="no-cover">No Cover</div>
                  )}
                </div>
                <div className="request-details">
                  <p className="request-title">{req.book_title || req.book?.title || "Untitled"}</p>
                  <div className="status-and-message">
                    <p className={`request-status status-${req.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                      {req.status} {getStatusMessage(req) && `- ${getStatusMessage(req)}`}
                    </p>
                    {req.updated_at && (
                      <p className="status-timestamp">Updated: {formatTimestamp(req.updated_at)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="empty-status">No active requests.</p>
      )}

      {/* BORROW HISTORY */}
      <h3 style={{ marginTop: "20px" }}>📚 Borrow History</h3>
      {studentRequests.filter(req =>
        ["Returned", "Not Approved"].includes(req.status)
      ).length > 0 ? (
        <div className="request-list">
          {studentRequests
            .filter(req =>
              ["Returned", "Not Approved"].includes(req.status)
            )
            .map(req => (
              <div key={req.id} className="request-item">
                <div className="request-cover">
                  {req.cover_image || req.book?.cover_image ? (
                    <img
                      src={`${API_URL}/uploads/${req.cover_image || req.book.cover_image}`}
                      alt={req.book_title || req.book?.title || "Untitled"}
                    />
                  ) : (
                    <div className="no-cover">No Cover</div>
                  )}
                </div>
                <div className="request-details">
                  <p className="request-title">{req.book_title || req.book?.title || "Untitled"}</p>
                  <div className="status-and-message">
                    <p className={`request-status status-${req.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                      {req.status} {getStatusMessage(req) && `- ${getStatusMessage(req)}`}
                    </p>
                    {req.updated_at && (
                      <p className="status-timestamp">Updated: {formatTimestamp(req.updated_at)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="empty-status">No borrow history yet.</p>
      )}
    </div>
  );
}
