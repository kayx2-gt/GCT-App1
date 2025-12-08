
import React, { useRef } from "react";
import { useSwipeable } from "react-swipeable";
import API_URL from "../config";

export default function BookRow({ letter, books, expanded, setExpanded, handleBorrow, openPopup }) {
  const rowRef = useRef(null);

  // Function to scroll smoothly left or right
  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.8; // scroll 80% of visible width
    const newScroll = direction === "left"
      ? rowRef.current.scrollLeft - scrollAmount
      : rowRef.current.scrollLeft + scrollAmount;

    rowRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  // Swipe gesture support
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => scrollRow("right"),
    onSwipedRight: () => scrollRow("left"),
    trackMouse: true,
  });

  return (
    <div className="book-row-wrapper">
      <button
        className="scroll-arrow scroll-left"
        onClick={() => scrollRow("left")}
      >
        ◀
      </button>

      <div {...swipeHandlers} className="book-row-scroll" ref={rowRef}>
        {books.map((row) => (
          <div
  className="book-card"
  key={row.id}
  onClick={() => openPopup(row)}
>
            <div className="book-cover-container">
              {row.cover_image ? (
                <img
                  src={`${API_URL}/uploads/${row.cover_image}`}
                  alt={row.title}
                />
              ) : (
                <div className="no-cover">No Cover</div>
              )}
            </div>
            <div className="book-info">
              <strong
                className={`book-title ${
                  expanded === row.id ? "expanded" : ""
                }`}
                onClick={() =>
                  setExpanded(expanded === row.id ? null : row.id)
                }
                title={row.title}
              >
                {row.title}
              </strong>
              <p>by {row.author}</p>
              <small>{row.publication_date}</small>
            </div>
            <p
              className={`available-stock ${
                row.quantity_in_stock > 0 ? "green" : "red"
              }`}
            >
              {row.quantity_in_stock > 0
                ? `${row.quantity_in_stock} in stock`
                : "Out of Stock"}
            </p>
            <button
  onClick={(e) => { e.stopPropagation(); handleBorrow(row.id); }}
  disabled={row.quantity_in_stock <= 0}
  className={`borrow-btn ${row.quantity_in_stock > 0 ? "enabled" : "disabled"}`}
>
  Borrow
</button>
          </div>
        ))}
      </div>

      <button
        className="scroll-arrow scroll-right"
        onClick={() => scrollRow("right")}
      >
        ▶
      </button>
    </div>
  );
}
