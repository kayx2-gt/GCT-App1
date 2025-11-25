
import Navbar from "../Components/Navbar";
import React, { useEffect, useState, useRef } from "react";
import "../Library.css";
import API_URL from "../config";
import BookRow from "../Components/BookRow"; // <-- import your BookRow component

export default function Library() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [expanded, setExpanded] = useState(null);
  const [user, setUser] = useState(null);
  const [studentRequests, setStudentRequests] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(""); // 🟢 for borrow feedback

  const libraryContentRef = useRef(null);
  const scrollRefs = useRef({});

  // Fetch student requests
  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/borrow/history/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStudentRequests(data);
      })
      .catch((err) => console.error("Error fetching student requests:", err));
  }, [user]);

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("student");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch all books
  useEffect(() => {
    fetch(`${API_URL}/api/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // 🟢 Handle borrow
  const handleBorrow = async (id) => {
    if (!user) {
      setFeedbackMessage("⚠️ Please log in to request a borrow.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/borrow/request/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id }),
      });
      const data = await res.json();
      setFeedbackMessage(data.message || "Borrow request sent!");
      if (data.success && user?.id) {
        const updatedRes = await fetch(`${API_URL}/api/borrow/history/${user.id}`);
        const updatedData = await updatedRes.json();
        if (Array.isArray(updatedData)) setStudentRequests(updatedData);
      }
    } catch (err) {
      console.error("Borrow request error:", err);
      setFeedbackMessage("⚠️ An error occurred while sending your request.");
    }
  };

  const handleAlphabetClick = (e, letter) => {
    e.preventDefault(); // prevent default jump
    const target = document.getElementById(`letter-${letter}`);
    if (target && libraryContentRef.current) {
      libraryContentRef.current.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const smoothScroll = (element, target, duration = 400) => {
    const start = element.scrollLeft;
    const change = target - start;
    const linear = (t) => t;

    const animateScroll = (currentTime, startTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      element.scrollLeft = start + change * linear(progress);
      if (progress < 1) requestAnimationFrame((time) => animateScroll(time, startTime));
    };

    requestAnimationFrame((time) => animateScroll(time));
  };

  const scrollRow = (letter, direction) => {
    const row = scrollRefs.current[letter];
    if (!row) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    const targetScroll = row.scrollLeft + scrollAmount;
    smoothScroll(row, targetScroll, 400);
  };

  // Clean and normalize the query
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // 1️⃣ Sort books alphabetically by title
  const sortedBooks = [...books].sort((a, b) => a.title.localeCompare(b.title));

  // 2️⃣ Filter based on the search field and query
  const filteredBooks = sortedBooks.filter((book) => {
    if (!normalizedQuery) return true; // show all when search is empty
    const value = (book[searchField] || "").toString().toLowerCase();
    return value.includes(normalizedQuery);
  });

  // 3️⃣ Group filtered books alphabetically by their title’s first letter
  const groupedBooks = filteredBooks.reduce((acc, book) => {
    const firstLetter = book.title?.[0]?.toUpperCase() || "#";
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});


  return (
    <div className="library-body">
      <Navbar />

      <div className="fixed-side-bar">
        <div className="left-sidebar">
          <div className="search-bar">
            <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="id">Book ID</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchField}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Student requests panel (unchanged) */}
          <div className="student-status-wrapper">
            <div className="student-status-panel">
              <h3>📖 Your Book Requests</h3>
              {feedbackMessage && <div className="borrow-feedback">{feedbackMessage}</div>}

              {/* Active Requests */}
              {studentRequests.filter(req => 
    req.status === "Pending Approval" || 
    req.status === "Claimable" || 
    req.status === "Borrowed"
).length > 0 ? (
    <div className="request-list">
        {studentRequests.filter(req => 
            req.status === "Pending Approval" || 
            req.status === "Claimable" || 
            req.status === "Borrowed"
        ).map(req => (
            <div key={req.id} className="request-item">
                <div className="request-cover">
                    {req.cover_image || req.book?.cover_image
                        ? <img src={`${API_URL}/uploads/${req.cover_image || req.book.cover_image}`} alt={req.book_title || req.book?.title || "Untitled"} />
                        : <div className="no-cover">No Cover</div>}
                </div>
                <div className="request-details">
                    <p className="request-title">{req.book_title || req.book?.title || "Untitled"}</p>
                    <div className="status-and-message">
                        <p className={`request-status status-${req.status?.toLowerCase().replace(/\s+/g, "-")}`}>{req.status}</p>
                        {req.message && <p className="request-message">{req.message}</p>}
                    </div>
                </div>
            </div>
        ))}
    </div>
) : <p className="empty-status">No active requests.</p>}

              {/* Borrow History */}
              <h3 style={{ marginTop: "20px" }}>📚 Borrow History</h3>
              {studentRequests.filter(req => req.status === "Returned" || req.status === "Not Approved").length > 0 ? (
                <div className="request-list">
                  {studentRequests.filter(req => req.status === "Returned" || req.status === "Not Approved")
                    .map(req => (
                      <div key={req.id} className="request-item">
                        <div className="request-cover">
                          {req.cover_image || req.book?.cover_image
                            ? <img src={`${API_URL}/uploads/${req.cover_image || req.book.cover_image}`} alt={req.book_title || req.book?.title || "Untitled"} />
                            : <div className="no-cover">No Cover</div>}
                        </div>
                        <div className="request-details">
                          <p className="request-title">{req.book_title || req.book?.title || "Untitled"}</p>
                          <div className="status-and-message">
                            <p className={`request-status status-${req.status?.toLowerCase().replace(/\s+/g, "-")}`}>{req.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : <p className="empty-status">No borrow history yet.</p>}
            </div>
          </div>
        </div>

        {/* Alphabet guide */}
        <div className="alphabet-guide">
          {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map(letter => (
            <a key={letter} href={`#letter-${letter}`} className="alphabet-link" onClick={(e) => handleAlphabetClick(e, letter)}>
              {letter}
            </a>
          ))}
        </div>
      </div>

      {/* Library content */}
      <div className="library-container">
        <div className="library-content" ref={libraryContentRef}>
          {Object.keys(groupedBooks).length > 0 ? (
            Object.keys(groupedBooks).map(letter => (
              <div key={letter} id={`letter-${letter}`} className="letter-section">
                <h2 className="letter-heading">{letter}</h2>
                <BookRow
                  letter={letter}
                  books={groupedBooks[letter]}
                  scrollRow={scrollRow}
                  scrollRefs={scrollRefs}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  handleBorrow={handleBorrow}
                />
              </div>
            ))
          ) : <p className="no-books">No books found.</p>}
        </div>
      </div>
    </div>
  );
}
