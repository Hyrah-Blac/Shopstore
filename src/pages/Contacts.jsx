import React, { useState, useEffect } from "react";
import axios from "axios";

// Confetti component (same as your first snippet)
const Confetti = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: "18px",
            opacity: 0.8,
            animation: `confetti-fall 1.5s ease forwards`,
            animationDelay: `${Math.random() * 1}s`,
            userSelect: "none",
          }}
        >
          🎉
        </span>
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(150px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const purple = "#8a2be2";
const lightPurple = "#bb86fc";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email address.";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ name: true, email: true, message: true });
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-5za1.onrender.com";

      const response = await axios.post(`${API_BASE_URL}/api/contact`, formData);

      if (response.status === 200) {
      
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTouched({});
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
    <main style={styles.page} aria-live="polite" aria-atomic="true">
      <div style={styles.container} role="form" aria-label="Contact form">
        <h2 style={styles.heading}>Contact Us</h2>

        {success && (
          <>
            <p style={styles.successMsg} role="alert" tabIndex={-1}>
              Thank you! Your message has been sent.
            </p>
            <Confetti />
          </>
        )}

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          {["name", "email", "message"].map((field) => {
            const isTextarea = field === "message";
            const hasError = touched[field] && errors[field];
            const label = field.charAt(0).toUpperCase() + field.slice(1);
            return (
              <div key={field} style={styles.inputGroup}>
                {isTextarea ? (
                  <textarea
                    id={field}
                    name={field}
                    placeholder=" "
                    rows={5}
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    aria-required="true"
                    aria-invalid={hasError ? "true" : "false"}
                    aria-describedby={`${field}-error`}
                    style={{
                      ...styles.input,
                      ...styles.textarea,
                      borderColor: hasError ? "#e03e3e" : "#333333",
                      boxShadow: hasError ? `0 0 8px #e03e3e99` : "inset 0 0 6px rgba(0,0,0,0.4)",
                    }}
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    id={field}
                    name={field}
                    placeholder=" "
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    aria-required="true"
                    aria-invalid={hasError ? "true" : "false"}
                    aria-describedby={`${field}-error`}
                    style={{
                      ...styles.input,
                      borderColor: hasError ? "#e03e3e" : "#333333",
                      boxShadow: hasError ? `0 0 8px #e03e3e99` : "inset 0 0 6px rgba(0,0,0,0.4)",
                    }}
                  />
                )}

                <label
                  htmlFor={field}
                  style={{
                    ...styles.label,
                    color: hasError ? "#e03e3e" : "#ddd6ff",
                    opacity: formData[field] ? 0 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {label}
                </label>

                {hasError && (
                  <p id={`${field}-error`} role="alert" style={styles.errorMsg}>
                    {errors[field]}
                  </p>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            style={{
              ...styles.button,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </main>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f0f, #1a1a2e)",
    color: "#f0eaff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    position: "relative",
  },
  container: {
    position: "relative",
    backgroundColor: "rgba(28, 28, 28, 0.85)",
    padding: "48px 48px 56px",
    borderRadius: "24px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: `0 8px 32px ${purple}44`,
    backdropFilter: "blur(12px)",
    border: `1px solid ${purple}33`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    userSelect: "none",
  },
  heading: {
    fontSize: "28px",
    color: lightPurple,
    textAlign: "center",
    textShadow: `0 0 8px ${lightPurple}80`,
    marginBottom: "32px",
    fontWeight: 700,
  },
  successMsg: {
    color: "#4BB543",
    fontWeight: "600",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "1.1rem",
    outline: "none",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    position: "relative",
  },
  input: {
    width: "100%",
    backgroundColor: "#222222dd",
    borderRadius: "12px",
    border: "1.5px solid #333333",
    padding: "16px 16px 16px 16px",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#eee",
    outline: "none",
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.4)",
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
  },
  textarea: {
    resize: "vertical",
    minHeight: "120px",
  },
  label: {
    position: "absolute",
    left: "16px",
    top: "16px",
    pointerEvents: "none",
    fontSize: "1rem",
    color: "#ddd6ff",
    userSelect: "none",
  },
  errorMsg: {
    marginTop: "6px",
    color: "#e03e3e",
    fontSize: "0.85rem",
    fontWeight: 600,
  },
  button: {
    background: `linear-gradient(90deg, ${purple}, ${lightPurple})`,
    border: "none",
    borderRadius: "24px",
    padding: "14px 0",
    fontWeight: 600,
    fontSize: "1.1rem",
    color: "#fff",
    textShadow: `0 0 4px ${lightPurple}`,
    boxShadow: `0 0 14px ${lightPurple}`,
    transition: "all 0.3s ease",
    userSelect: "none",
  },
};

export default ContactPage;
