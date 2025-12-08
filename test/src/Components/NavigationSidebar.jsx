import React, { useState, useEffect } from "react";
import Settings from "./Settings";
import EnrollmentHistory from "./EnrollmentHistory";
import BookHistory from "./BookHistory";
import API_URL from "../config";

export default function NavigationSidebar({ isMenuOpen, setIsMenuOpen }) {
  const [activeComponent, setActiveComponent] = useState("bookHistory");
  const [studentRequests, setStudentRequests] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [user, setUser] = useState(null);

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("student");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch student requests
  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/api/borrow/history/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudentRequests(data);
          setFeedbackMessage(""); // clear feedback if successful
        } else {
          setStudentRequests([]);
          setFeedbackMessage("Failed to load requests.");
        }
      })
      .catch(() => {
        setStudentRequests([]);
        setFeedbackMessage("Failed to load requests.");
      });
  }, [user]);

  // Close active component if sidebar is closed
  useEffect(() => {
    if (!isMenuOpen) setActiveComponent(null);
  }, [isMenuOpen]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "settings":
        return <Settings />;
      case "enrollment":
        return <EnrollmentHistory />;
      case "bookHistory":
        return (
          <BookHistory
            studentRequests={studentRequests}
            feedbackMessage={feedbackMessage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div id="admin" className="sidebar-wrapper">
      <div className={`navigation-sidebar ${isMenuOpen ? "sidebar-open" : ""}`}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="sidebar-links">
          <button
            className="sidebar-btn"
            onClick={() =>
              setActiveComponent(activeComponent === "settings" ? null : "settings")
            }
          >
            Settings
          </button>
          <button
            className="sidebar-btn"
            onClick={() =>
              setActiveComponent(activeComponent === "enrollment" ? null : "enrollment")
            }
          >
            Enrollment History
          </button>
          <button
            className="sidebar-btn"
            onClick={() =>
              setActiveComponent(activeComponent === "bookHistory" ? null : "bookHistory")
            }
          >
            Book History
          </button>
        </div>

        <div className="sidebar-content">
          {activeComponent ? (
            renderComponent()
          ) : (
            <div className="sidebar-footer">
              <img
                src="/Assets/GCT-Logo3.png"
                alt="Logo"
                className="sidebar-footer-logo"
              />
              <h2 className="sidebar-footer-title">GCT App</h2>
              <div className="sidebar-footer-content">
                <h3 className="sidebar-footer-subtitle">
                  Final Project for Application Development
                </h3>
                <div className="footer-instructor">
                  <p className="footer-label">Instructor:</p>
                  <p className="footer-value">Mr. Bogs</p>
                </div>
                <div className="footer-members">
                  <p className="footer-label">Group Members:</p>
                  <ul className="footer-members-list">
                    <li>Kyle Matthew N. Nicor</li>
                    <li>Jazper Francisco</li>
                    <li>Mark Lester Arevalo</li>
                    <li>Reece Esmeralda</li>
                    <li>Angel Sevilla</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className={`hamburger-btn ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <img
          src="/Assets/menu-alt-svgrepo-com.svg"
          alt="Menu"
          className={`hamburger-icon ${isMenuOpen ? "rotate" : ""}`}
        />
      </button>
    </div>
  );
}
