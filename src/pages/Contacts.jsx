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

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("⚠️ All fields are required.");
      return;
    }

    setLoading(true);

    try {
      // Use env variable or fallback to your deployed backend
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-5za1.onrender.com";

      const response = await axios.post(`${API_BASE_URL}/api/contact`, formData);

      if (response.status === 200) {
        alert("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("❌ Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`❌ Failed to send message. ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContent>
      <div className="max-w-5xl mx-auto p-6 md:p-12 bg-gradient-to-br from-[#3a0ca3] to-[#7209b7] rounded-xl shadow-2xl text-white font-poppins">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6 p-6 bg-white/10 rounded-xl backdrop-blur-md shadow-lg border border-white/20">
            <h2 className="text-4xl font-bold tracking-wide mb-2">Contact Us</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              We’d love to hear from you! Reach out anytime.
            </p>

            <div className="space-y-6 mt-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Email</h3>
                <a
                  href="mailto:jblacccccc@gmail.com"
                  className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300"
                >
                  jblacccccc@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Phone</h3>
                <a
                  href="tel:+254708892669"
                  className="text-indigo-400 hover:text-indigo-600 transition-colors duration-300"
                >
                  +254-708-892-669
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col bg-white/10 rounded-xl backdrop-blur-md shadow-lg border border-white/20 p-6 space-y-6"
          >
            <h2 className="text-3xl font-semibold text-white tracking-wide text-center">Send us a message</h2>

            <label className="flex flex-col text-white font-medium">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={loading}
                className="mt-2 p-3 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </label>

            <label className="flex flex-col text-white font-medium">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
                disabled={loading}
                className="mt-2 p-3 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </label>

            <label className="flex flex-col text-white font-medium">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                rows="5"
                required
                disabled={loading}
                className="mt-2 p-3 rounded-md bg-white/20 border border-white/30 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-300 font-semibold py-3 rounded-md shadow-md text-white"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </MainContent>
  );
};

export default Contacts;
