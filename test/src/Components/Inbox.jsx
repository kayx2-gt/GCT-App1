//inbox.jsx
import React, { useEffect, useState } from "react";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.userId) {
          setError("You must be logged in to view your inbox.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:3001/api/inbox/${storedUser.userId}`
        );

        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        setError("❌ Error loading messages.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p>Loading your inbox...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="inbox-container">
      <h2>Your Inbox</h2>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="message-list">
          {messages.map((msg) => (
            <li key={msg._id || msg.id} className="message-item">
              <p>
                <strong>From:</strong> {msg.senderName || "Unknown"}
              </p>
              <p>{msg.message}</p>
              <small>
                {new Date(msg.timestamp || msg.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
