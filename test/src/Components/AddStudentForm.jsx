import React from "react";

export default function AddStudentForm({
  form,
  preview,
  isDragging,
  handleChange,
  handleAddStudent,
  handleFileSelect,
  setIsDragging
}) {
  return (
    <form onSubmit={handleAddStudent} className="book-form">
      {/* LEFT PANEL */}
      <div className="form-left">
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" name="fullname" value={form.fullname} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Library Card No:</label>
          <input
            type="text"
            name="libraryCardNo"
            value={form.libraryCardNo}
            onChange={handleChange}
            placeholder="Auto-generate if empty"
          />
        </div>

        <div className="form-group">
          <label>Student No:</label>
          <input
            type="text"
            name="studentNo"
            value={form.studentNo}
            onChange={handleChange}
            placeholder="Auto-generate if empty"
          />
        </div>

        <div className="form-group">
          <label>Course & Year:</label>
          <select
            name="courseYear"
            value={form.courseYear}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>Select Course & Year</option>

            <optgroup label="BSCS">
              <option value="BSCS 1st Year">BSCS - 1st Year</option>
              <option value="BSCS 2nd Year">BSCS - 2nd Year</option>
              <option value="BSCS 3rd Year">BSCS - 3rd Year</option>
              <option value="BSCS 4th Year">BSCS - 4th Year</option>
            </optgroup>

            <optgroup label="BSIT">
              <option value="BSIT 1st Year">BSIT - 1st Year</option>
              <option value="BSIT 2nd Year">BSIT - 2nd Year</option>
              <option value="BSIT 3rd Year">BSIT - 3rd Year</option>
              <option value="BSIT 4th Year">BSIT - 4th Year</option>
            </optgroup>

            <optgroup label="BSCE">
              <option value="BSCE 1st Year">BSCE - 1st Year</option>
              <option value="BSCE 2nd Year">BSCE - 2nd Year</option>
              <option value="BSCE 3rd Year">BSCE - 3rd Year</option>
              <option value="BSCE 4th Year">BSCE - 4th Year</option>
            </optgroup>

            <optgroup label="BSEE">
              <option value="BSEE 1st Year">BSEE - 1st Year</option>
              <option value="BSEE 2nd Year">BSEE - 2nd Year</option>
              <option value="BSEE 3rd Year">BSEE - 3rd Year</option>
              <option value="BSEE 4th Year">BSEE - 4th Year</option>
            </optgroup>

            <optgroup label="BSA">
              <option value="BSA 1st Year">BSA - 1st Year</option>
              <option value="BSA 2nd Year">BSA - 2nd Year</option>
              <option value="BSA 3rd Year">BSA - 3rd Year</option>
              <option value="BSA 4th Year">BSA - 4th Year</option>
            </optgroup>

            <optgroup label="BSBA">
              <option value="BSBA 1st Year">BSBA - 1st Year</option>
              <option value="BSBA 2nd Year">BSBA - 2nd Year</option>
              <option value="BSBA 3rd Year">BSBA - 3rd Year</option>
              <option value="BSBA 4th Year">BSBA - 4th Year</option>
            </optgroup>

            <optgroup label="BSHM">
              <option value="BSHM 1st Year">BSHM - 1st Year</option>
              <option value="BSHM 2nd Year">BSHM - 2nd Year</option>
              <option value="BSHM 3rd Year">BSHM - 3rd Year</option>
              <option value="BSHM 4th Year">BSHM - 4th Year</option>
            </optgroup>

            <optgroup label="BSOA">
              <option value="BSOA 1st Year">BSOA - 1st Year</option>
              <option value="BSOA 2nd Year">BSOA - 2nd Year</option>
              <option value="BSOA 3rd Year">BSOA - 3rd Year</option>
              <option value="BSOA 4th Year">BSOA - 4th Year</option>
            </optgroup>

            <optgroup label="BSME">
              <option value="BSME 1st Year">BSME - 1st Year</option>
              <option value="BSME 2nd Year">BSME - 2nd Year</option>
              <option value="BSME 3rd Year">BSME - 3rd Year</option>
              <option value="BSME 4th Year">BSME - 4th Year</option>
            </optgroup>

          </select>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="form-right">
        <h2 className="dropzone-title">Student Photo (1x1)</h2>

        <div
          className={`dropzone2 ${isDragging ? "dragging" : ""}`}
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
          onClick={() => document.getElementById("profileInput").click()}
        >
          {preview ? (
            <img src={preview} alt="Profile Preview" className="profile-preview" />
          ) : (
            <span>📂 Insert Profile Pic or Drag Img</span>
          )}

          <input
            id="profileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn">➕ Add Student</button>
      </div>
    </form>
  );
}
