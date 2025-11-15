import React, { useState, useEffect, useRef } from "react";
import "../SearchBar.css";
import API_URL from "../config";

export default function SearchBar() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("title");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [previewBook, setPreviewBook] = useState(null);

  const wrapperRef = useRef();

  // Load books from backend
  useEffect(() => {
    fetch(`${API_URL}/api/books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks([]);
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // Filter books whenever query changes
  useEffect(() => {
    if (!query) {
      setFilteredBooks([]);
      return;
    }

    let results = books.filter((book) => {
      if (filter === "id") return book.id.toString().includes(query);
      if (filter === "author") return book.author.toLowerCase().includes(query.toLowerCase());
      if (filter === "title") return book.title.toLowerCase().includes(query.toLowerCase());
      return false;
    });

    if (filter === "title") {
      results = results.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredBooks(results);
  }, [query, filter, books]);

  // Close dropdown if clicking outside wrapper
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

// Remove book
  const handleDeleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await fetch(`${API_URL}/api/books/${id}`, { method: "DELETE" });
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div className="searchbar-wrapper" ref={wrapperRef}>
      <div className="search-controls">
        <h2>Search Bar</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="id">Book ID</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${filter}...`}
          value={query}
          onFocus={() => setIsActive(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isActive && filteredBooks.length > 0 && (
  <div className="search-results-cards">
    {filteredBooks.map((book) => (
      <div key={book.id} className="search-card">
        <img
          src={
            book.cover_image
              ? `${API_URL}/uploads/${book.cover_image}`
              : "https://via.placeholder.com/100x140?text=No+Cover"
          }
          alt={book.title}
          className="card-cover"
          onClick={() => setPreviewBook(book)} // open preview when clicked
        />
        <div className="card-info">
          <p className="card-title">{book.title}</p>
          <p className="card-author">{book.author}</p>
          <p className="card-id">ID: {book.id}</p>
        </div>
      </div>
    ))}
  </div>
)}

{/* Preview Modal */}
{previewBook && (
  <div className="preview-overlay" onClick={() => setPreviewBook(null)}>
    <div className="preview-card" onClick={(e) => e.stopPropagation()}>
      <img
        src={
          previewBook.cover_image
            ? `${API_URL}/uploads/${previewBook.cover_image}`
            : "https://via.placeholder.com/200x280?text=No+Cover"
        }
        alt={previewBook.title}
        className="preview-cover"
      />
      <div className="preview-info">
        <p className="preview-title">{previewBook.title}</p>
        <p className="preview-author"><strong>Author:</strong> {previewBook.author}</p>
        <p className="preview-id"><strong>ID:</strong> {previewBook.id}</p>
        <p className="preview-description"><strong>Description:</strong><br /><span>{previewBook.description}</span></p>
      </div>
      <button className="btn btn-danger" onClick={() => handleDeleteBook(previewBook.id)}>Remove</button>
    </div>
  </div>
)}

        </div>
    </div>
  );
}
