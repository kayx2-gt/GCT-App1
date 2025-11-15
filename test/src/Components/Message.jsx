//message.jsx
import { useState } from "react";

export default function Message() {
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    setStatus("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.userId) {
        setStatus("You must be logged in to send messages.");
        return;
      }

      const parts = link.split("/send/");
      const recipientId = parts[1];

      if (!recipientId || !message.trim()) {
        setStatus("Please enter a valid recipient link and message.");
        return;
      }

      const senderName = storedUser.username || "User";

      const res = await fetch("http://localhost:3001/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          senderId: storedUser.userId,
          senderName,
          message,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        setStatus(`Error: ${text}`);
        return;
      }

      setStatus("✅ Message sent successfully!");
      setMessage("");
      setLink("");
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      console.error("Send message error:", error);
      setStatus("❌ Error sending message. Please try again later.");
    }
  };

  return (
    <div className="message-container">
      <h2>Your Feedback</h2>

      <input
        type="text"
        placeholder="Paste recipient's link here (e.g., https://ngilo.app/send/abc123)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <textarea
        placeholder="Your Feedback"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
      />

      <button onClick={handleSend}>Send</button>

      {status && <p>{status}</p>}
    </div>
  );
}
