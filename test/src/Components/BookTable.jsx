import React from "react";
import API_URL from "../config";

export default function BookTable({ books, handleDeleteBook }) {
  return (
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
                <button className="btn btn-danger" onClick={() => handleDeleteBook(row.id)}>
                  Remove
                </button>
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
  );
}
