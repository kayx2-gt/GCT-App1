import React, { useState, useEffect } from "react";
import '../LibraryInv.css';
import { useNavigate } from "react-router-dom";
import SearchBar from "../Components/SearchBar";
import AdminModal from "../Components/AdminModal"; // ✅ import login modal
import API_URL from "../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookInventory() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);     // ✅ check admin
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ login modal

  const [form, setForm] = useState({
    title: "",
    author: "",
    pub_date: "",
    description: "",
    quantity: 1,
    cover: null,
  });

  // 🔹 Check admin on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    } else {
      setIsModalOpen(true); // open login modal if not admin
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      setForm({ ...form, cover: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Load books from backend
  useEffect(() => {
    if (isAdmin) { // only fetch if logged in
      fetch(`${API_URL}/api/books`)
        .then((res) => res.json())
        .then((data) => setBooks(data))
        .catch((err) => console.error("Error fetching books:", err));
    }
  }, [isAdmin]);

  const fetchBooks = async () => {
    const res = await fetch(`${API_URL}/api/books`);
    const data = await res.json();
    setBooks(data);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover" && files[0]) {
      setForm((prev) => ({ ...prev, cover: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add new book
  const handleAddBook = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("publication_date", form.pub_date);
    formData.append("description", form.description);
    formData.append("quantity", form.quantity);
    if (form.cover) formData.append("cover", form.cover);
    if (!form.cover) {
      alert("Please upload a book cover!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert("Book added!");
        setBooks((prev) => [data, ...prev]);
        await fetchBooks();
        setForm({
          title: "",
          author: "",
          pub_date: "",
          description: "",
          quantity: 1,
          cover: null,
        });
        setPreview(null);
      } else {
        alert(data.error || "Failed to add book");
      }
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

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
    <div className="libraryInv-body">
      <button className="admin-switch-btn"onClick={() => navigate("/StudentUser")}>Go to Student Accounts</button>
      {/* 🔹 Show login modal if not logged in */}
      <AdminModal isOpen={isModalOpen} closeModal={closeModal} />

      {isAdmin ? (
        <>
          <div className="libheader">
            <h1>Book Inventory Management</h1>
            <img src="/Assets/GCT-Logo3.png" alt="Logo"/>
          </div>
          <SearchBar />
          {/* Add Book Form */}
          <form onSubmit={handleAddBook} className="book-form">
            {/* Left side - inputs */}
            <div className="form-left">
              <div className="form-group">
                <label>Title:</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Author:</label>
                <input type="text" name="author" value={form.author} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea name="description" value={form.description} onChange={handleChange} required></textarea>
              </div>

              <div className="form-group">
                <label>Publication Date:</label>
                <DatePicker
                  selected={form.pub_date ? new Date(form.pub_date) : null}
                  onChange={(date) => setForm({ ...form, pub_date: date.toISOString().slice(0, 10) })}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="Published Date"
                />
              </div>

              <div className="form-group">
                <label>Quantity:</label>
                <input
                  className="Quantitybox"
                  type="number"
                  name="quantity"
                  min="0"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Right side - book cover */}
            <div className="form-right">
              <h2 className="dropzone-title">Book Cover</h2>
              <div
                className={`dropzone ${isDragging ? "dragging" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  setPreview(null);
                  document.getElementById("coverInput").value = "";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith("image/")) {
                    handleFileSelect(file);
                  }
                }}
                onClick={() => document.getElementById("coverInput").click()}
              >
                {preview ? (
                  <img src={preview} alt="Book Cover Preview" />
                ) : (
                  <span>📂 Insert Img or Drag Img</span>
                )}
                <input
                  id="coverInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn">Add Book</button>
            </div>
          </form>

          {/* Books Table */}
          <div className="table-wrapper">
            <table className="books-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publication Date</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Cover</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.title}</td>
                    <td>{row.author}</td>
                    <td>{row.publication_date}</td>
                    <td className="tb-description">{row.description}</td>
                    <td>{row.quantity_in_stock}</td>
                    <td>
                      {row.cover_image ? (
                        <img
                          src={`${API_URL}/uploads/${row.cover_image}`}
                          alt="Book Cover"
                          className="table-cover"
                        />
                      ) : (
                        "No cover"
                      )}
                    </td>
                    <td className={row.quantity_in_stock > 0 ? "status available" : "status out"}>
                      {row.quantity_in_stock > 0 ? "Available" : "Out of Stock"}
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDeleteBook(row.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan="9" className="empty-msg">
                      No books in inventory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        !isModalOpen && <p>⏳ Redirecting to login...</p>
      )}
    </div>
  );
}
