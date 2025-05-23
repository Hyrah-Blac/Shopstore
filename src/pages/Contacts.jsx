import React, { useState } from "react";
import axios from "axios";
import MainContent from "../components/MainContent";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("⚠️ All fields are required.");
      return;
    }

    setLoading(true);

    try {
      // Use relative path for production + local dev proxy
      const response = await axios.post("/api/contact", formData);

      if (response.status === 200) {
        alert("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert(`❌ Failed to send message. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContent>
      <div className="contacts-container">
        <div className="contacts-info">
          {/* ✅ Fixed mismatched tag */}
          <h2>Contact Us</h2>
          <p>We’d love to hear from you! Reach out anytime.</p>

          <div className="contact-details">
            <div>
              <h3>Email</h3>
              <a href="mailto:jblacccccc@gmail.com">jblacccccc@gmail.com</a>
            </div>
            <div>
              <h3>Phone</h3>
              <a href="tel:+254708892669">+254-708-892-669</a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>

          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              disabled={loading}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
              disabled={loading}
            />
          </label>

          <label>
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message"
              rows="5"
              required
              disabled={loading}
            />
          </label>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </MainContent>
  );
};

export default Contacts;