import React from "react";
import StudentStatusPanel from "./StudentStatusPanel";

export default function BookHistory({ studentRequests = [], feedbackMessage = "" }) {
  return (
    <div className="book-history-container">
      <h2 className="eh-title">Book History</h2>

      {/* Status panel */}
      <StudentStatusPanel
        studentRequests={studentRequests}
        feedbackMessage={feedbackMessage}
      />

      {/* Show message if no requests and not loading */}
      {!feedbackMessage && studentRequests.length === 0 && (
        <p className="empty-status">You have no book requests yet.</p>
      )}
    </div>
  );
}
