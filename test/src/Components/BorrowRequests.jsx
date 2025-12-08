import React, { useMemo } from "react";
import API_URL from "../config";

export default function BorrowRequests({
  borrowRequests = [],
  updateBorrowStatus,
  handleReturn,
}) {
  const safeRequests = useMemo(() => {
    return Array.isArray(borrowRequests) ? borrowRequests : [];
  }, [borrowRequests]);

  // ✅ Added cover_image (same as Scanner)
  const getCover = (r) => {
    const cover =
      r?.cover_image ||
      r?.book_cover ||
      r?.cover ||
      r?.book_image ||
      r?.image ||
      r?.photo;

    if (!cover) return "/Assets/book-placeholder.png";
    if (cover.startsWith("http")) return cover;

    return `${API_URL}/uploads/${cover}`;
  };

  return (
    <div className="br-wrapper">
      <h2 className="br-title">📘 Borrow Requests</h2>

      {safeRequests.length === 0 ? (
        <p className="br-empty">No borrow requests.</p>
      ) : (
        <div className="br-grid">
          {safeRequests.map((r, index) => (
            <div
              key={r?.id || `${r?.book_id}-${r?.student_id}-${index}`}
              className="br-card"
            >
              <div className="br-cover">
                <img
                  src={getCover(r)}
                  alt={r?.book_title || "Book"}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/Assets/book-placeholder.png";
                  }}
                />
              </div>

              <div className="br-info">
                <h3 className="br-book-title">
                  {r?.book_title || "Unknown Book"}
                </h3>

                <p className="br-student">
                  👤 {r?.student_name || "N/A"}
                </p>

                <span
                  className={`br-status status-${(r?.status || "unknown")
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {r?.status || "Unknown"}
                </span>

                {r?.reason && r?.status === "Not Approved" && (
                  <p className="br-reason">Reason: {r.reason}</p>
                )}

                {r?.updated_at && (
                  <p className="br-updated">
                    Updated: {new Date(r.updated_at).toLocaleString()}
                  </p>
                )}

                <p className="br-date">
                  📅 Borrow:{" "}
                  {r?.borrow_date
                    ? new Date(r.borrow_date).toLocaleString()
                    : "-"}
                </p>

                <p className="br-date">
                  ⏳ Due:{" "}
                  {r?.due_date
                    ? new Date(r.due_date).toLocaleString()
                    : "-"}
                </p>

                <div className="br-actions">
                  {r?.status === "Pending Approval" && (
                    <>
                      <button
                        className="br-btn approve"
                        onClick={() =>
                          updateBorrowStatus(r.id, "Claimable")
                        }
                      >
                        ✅ Approve
                      </button>

                      <button
                        className="br-btn deny"
                        onClick={() =>
                          updateBorrowStatus(r.id, "Not Approved")
                        }
                      >
                        ❌ Deny
                      </button>
                    </>
                  )}

                  {r?.status === "Claimable" && (
                    <button
                      className="br-btn claim"
                      onClick={() =>
                        updateBorrowStatus(r.id, "Borrowed")
                      }
                    >
                      📦 Claimed
                    </button>
                  )}

                  {r?.status === "Borrowed" && (
                    <button
                      className="br-btn return"
                      onClick={() =>
                        handleReturn(r.id, r.book_id)
                      }
                    >
                      🔁 Returned
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
