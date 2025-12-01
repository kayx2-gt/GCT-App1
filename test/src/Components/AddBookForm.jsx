import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AddBookForm({
  form,
  preview,
  isDragging,
  handleChange,
  handleFileSelect,
  handleAddBook,
  setForm,
  setIsDragging
}) {
  return (
    <form onSubmit={handleAddBook} className="book-form">
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
            onChange={(date) =>
              setForm({ ...form, pub_date: date.toISOString().slice(0, 10) })
            }
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
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) handleFileSelect(file);
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

        <button type="submit" className="btn">
          Add Book
        </button>
      </div>
    </form>
  );
}
