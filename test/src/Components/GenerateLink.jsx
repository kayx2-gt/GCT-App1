//generatelink.jsx
import React, { useEffect, useState } from "react";

function GenerateLink() {
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.userId) {
      // fetch username from backend (to stay consistent with server.js)
      fetch(`http://localhost:3001/api/user/${user.userId}`)
        .then((res) => res.json())
        .then((data) => setUsername(data.username))
        .catch(() => setUsername(user.username || "User"));

      // generate local link for this user's inbox
      setLink(`${window.location.origin}/send/${user.userId}`);
    }
  }, []);

  return (
    <div className="generate-container">
      <h2>Your Unique Link</h2>
      {link ? (
        <>
          <p>
            Hi <strong>{username}</strong>! Here’s your link:
          </p>
          <p>{link}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(link);
              alert("✅ Link copied to clipboard!");
            }}
          >
            Copy Link
          </button>
        </>
      ) : (
        <p>Loading your link...</p>
      )}
    </div>
  );
}

export default GenerateLink;
