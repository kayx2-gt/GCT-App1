import React, { useEffect, useState } from "react";
import API_URL from "../config";
import "../Navbar.css";

export default function Settings() {
  const [student, setStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedStudent = JSON.parse(localStorage.getItem("student"));
    if (!savedStudent) return;

    fetch(`${API_URL}/api/students/${savedStudent.id}`)
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  if (!student) return <div className="settings-loading">Loading...</div>;

  const handleSavePassword = async () => {
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/students/${student.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Password updated successfully!");
        setStudent({ ...student, password: newPassword });
        setIsEditingPassword(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="settings-component">
      <img
        src={student.photo ? `${API_URL}/uploads/${student.photo}` : "/Assets/manager.png"}
        alt="User"
        className="settings-profile-image"
      />
      <h2 className="settings-username">{student.username}</h2>

      <div className="settings-info-container">
        <InfoRow label="Fullname" value={student.fullname} />
        <InfoRow label="Student Number" value={student.studentNo} />
        <InfoRow label="Library Card" value={student.libraryCardNo} />
        <InfoRow label="Course & Year" value={student.courseYear} />
        <InfoRow label="Status" value={student.status} />

        {/* PASSWORD ROW */}
        <div className="settings-row">
          <div className="settings-label">Password</div>
          <div className="settings-value-flex password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={isEditingPassword ? newPassword : student.password || "password123"}
              onChange={(e) => setNewPassword(e.target.value)}
              readOnly={!isEditingPassword}
              className="settings-password-input"
            />
            <button
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

            {!isEditingPassword ? (
              <button
                className="settings-change-btn"
                onClick={() => setIsEditingPassword(true)}
              >
                Change Password
              </button>
            ) : (
              <>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="settings-password-input"
                />
                <button className="settings-change-btn" onClick={handleSavePassword}>
                  Save
                </button>
                <button
                  className="settings-change-btn"
                  onClick={() => {
                    setIsEditingPassword(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setMessage("");
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          {message && <p className="settings-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="settings-row">
      <div className="settings-label">{label}</div>
      <div className="settings-value">{value || "—"}</div>
    </div>
  );
}
