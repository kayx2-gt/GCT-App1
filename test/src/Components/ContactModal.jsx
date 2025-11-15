import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import '../Navbar.css';

export default function ContactModal({ isOpen, closeModal }) {
  const form = useRef();
  const [notification, setNotification] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_zoxzqkk",
        "template_8vdpxcy",
        form.current,
        "UXBfMZkO2cIO6CvLU"
      )
      .then(
        () => {
          setNotification("✅ Message sent!");
          form.current.reset();
          setTimeout(() => {
            closeModal();
            setNotification("");
          }, 2000);
        },
        () => setNotification("❌ Failed to send. Try again.")
      );
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal">
      <div className="contact-content">
        <span className="close-btn" onClick={closeModal}>
          &times;
        </span>
        <div className="contact-header">
          <p>
            <strong>Facebook:</strong>{" "}
            <a
              href="https://www.facebook.com/GarciaCollegeOfTechnology"
              target="_blank"
              rel="noopener noreferrer"
            >
              Garcia College of Technology
            </a>
          </p>
          <p>
            <strong>Phone:</strong> (036) 262-0624 | 262-3280
          </p>
          <p>
            <strong>Email:</strong> gct.kalibo@gmail.com
          </p>
        </div>

        <form ref={form} onSubmit={sendEmail}>
            <label htmlFor="name">Full Name</label>
            <input type="text" name="from_name" placeholder="Enter your name" required />

            <label htmlFor="email">Email</label>
            <input type="email" name="from_email" placeholder="Enter your email" required />

            <label htmlFor="message">Message</label>
            <textarea name="message" rows="4" placeholder="Write your message..." required></textarea>

            <button type="submit" className="send-btn" value="Send">Send</button>
        </form>

        {notification && <div className="notification" >{notification}</div>}
      </div>
    </div>
  );
}
