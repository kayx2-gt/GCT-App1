import React from "react";
import "../Library.css";
import API_URL from "../config";

export default function LibraryPopup({ book, onClose, onBorrow }) {
  if (!book) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()} // stops background closing
      >
        <div className="popup-left">
          {book.cover_image ? (
            <img
              src={`${API_URL}/uploads/${book.cover_image}`}
              alt={book.title}
            />
          ) : (
            <div className="popup-no-cover">No Cover</div>
          )}

          <button
            className="popup-borrow-btn"
            onClick={() => onBorrow(book.id)}
            disabled={book.quantity_in_stock <= 0}
          >
            {book.quantity_in_stock > 0 ? "Borrow" : "Out of Stock"}
          </button>
        </div>

        <div className="popup-right">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Published:</strong> {book.publication_date}</p>
          <p><strong>In Stock:</strong> {book.quantity_in_stock}</p>

          {book.description && (
            <p className="popup-description">{book.description}</p>
          )}
        </div>

        <button className="popup-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}