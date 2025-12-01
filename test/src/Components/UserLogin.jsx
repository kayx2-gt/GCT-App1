import React, { useState, useEffect } from "react";
import API_URL from "../config";

export default function UserModal({ isOpen, closeModal }) {
  const [isUser, setIsUser] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null); // 🔹 store logged in student

  useEffect(() => {
    const checkStatus = async () => {
      const loggedUser = JSON.parse(localStorage.getItem("student"));
      if (!loggedUser) return;

      try {
        const res = await fetch(`${API_URL}/api/students/${loggedUser.id}`);
        const data = await res.json();

        if (data.status === "inactive") {
          alert("Your account has been deactivated. Logging out...");
          localStorage.removeItem("student");
          localStorage.removeItem("isUser");
          setIsUser(false);
          setStudent(null);
          closeModal();
        } else {
          setStudent(data); // ✅ keep updated info
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [closeModal]);

  useEffect(() => {
  const savedUser = localStorage.getItem("isUser");
  const savedStudent = localStorage.getItem("student");

  if (savedUser === "true" && savedStudent) {
    const studentData = JSON.parse(savedStudent);

    setIsUser(true);
    setStudent(studentData);
    // 🚀 No need to setUserImage here, Navbar handles it
  }
}, []);


  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_URL}/api/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (res.status === 403) {
      setError("❌ Your account is inactive. Please contact admin.");
    } else if (data.success) {
      setIsUser(true);
      setStudent(data.student);

      localStorage.setItem("isUser", "true");
      localStorage.setItem(
        "student",
        JSON.stringify({
          id: data.student.id,
          username: data.student.username,
          photo: data.student.photo, // ✅ use the same field from StudentUser
        })
      );

      closeModal();
      alert(`✅ Logged in as ${data.student.username}!`);

      // Navbar's useEffect will pick this up
      window.location.reload();
    } else {
      setError("❌ Invalid credentials");
    }
  } catch (err) {
    setError("Server error.");
    console.error(err);
  }
};

const handleLogout = () => {
  setIsUser(false);
  setStudent(null);
  localStorage.removeItem("isUser");
  localStorage.removeItem("student");
  closeModal();

  // optional: refresh so navbar resets to default image
  window.location.reload();
};


  if (!isOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <span className="closeUser" onClick={closeModal}>
          &times;
        </span>
        <div className="modal-header">
          <img src="Assets/GCT-Logo3.png" alt="GCT Logo" />
          <h2>{isUser ? "User Account" : "User Login"}</h2>
        </div>

        {error && !isUser && <p className="error-text">{error}</p>}

        {isUser ? (
          <>
            <p className="user-status">
              ✅ You are logged in as <br />{" "}
              <strong>
                {student?.fullname || student?.username || "User"}
              </strong>
            </p>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
            />
            <button type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
}
