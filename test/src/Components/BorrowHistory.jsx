import React, { useMemo } from "react";
import API_URL from "../config";

export default function BorrowHistory({ borrowHistory = [] }) {
  const safeHistory = useMemo(() => {
    return Array.isArray(borrowHistory) ? borrowHistory : [];
  }, [borrowHistory]);

  // ✅ Now includes cover_image (same as Scanner)
  const getCover = (h) => {
    const cover =
      h?.cover_image ||
      h?.book_cover ||
      h?.cover ||
      h?.book_image ||
      h?.image ||
      h?.photo;

    if (!cover) return "/Assets/book-placeholder.png";
    if (cover.startsWith("http")) return cover;

    return `${API_URL}/uploads/${cover}`;
  };

  return (
    <div className="bh-wrapper">
      <h2 className="bh-title">📚 Borrow History</h2>
      
      {safeHistory.length === 0 ? (
        <p className="bh-empty">No history yet.</p>
      ) : (
        <div className="bh-grid">
          {safeHistory.map((h, index) => (
            <div
              key={h?.id || `${h?.book_id}-${h?.student_id}-${index}`}
              className="bh-card"
            >
              <div className="bh-cover">
                <img
                  src={getCover(h)}
                  alt={h?.book_title || "Book"}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/Assets/book-placeholder.png";
                  }}
                />
              </div>

              <div className="bh-info">
                <h3 className="bh-book-title">
                  {h?.book_title || "Unknown Book"}
                </h3>

                <p className="bh-student">
                  👤 {h?.student_name || "N/A"}
                </p>

                <span
                  className={`bh-status ${
                    h?.status === "Not Approved"
                      ? "bh-denied"
                      : "bh-returned"
                  }`}
                >
                  {h?.status === "Not Approved"
                    ? "❌ Not Approved"
                    : "✅ Returned"}
                </span>

                <p className="bh-date">
                  <strong>Borrowed:</strong>{" "}
                  {h?.borrow_date
                    ? new Date(h.borrow_date).toLocaleString()
                    : "-"}
                </p>

                <p className="bh-date">
                  <strong>Returned:</strong>{" "}
                  {h?.return_date
                    ? new Date(h.return_date).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
