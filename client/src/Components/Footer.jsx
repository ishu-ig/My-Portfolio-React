import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createNewsletter } from "../Redux/ActionCreators/NewsletterActionCreators";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Footer() {
  const dispatch = useDispatch();

  const defaultMessage =
    "Get updates about new projects, UI/UX upgrades, and tech insights.";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(defaultMessage);

  // Handle input
  function getInputData(e) {
    setEmail(e.target.value);
    if (!e.target.value) {
      setError("Email is mandatory");
    } else {
      setError("");
    }
  }

  // Submit
  function postSubmit(e) {
    e.preventDefault();
    console.log("post function is called");

    if (!email) {
      setError("Email is mandatory");
      return;
    }

    // Send API request
    dispatch(createNewsletter({ email }));


    // Show success message
    setMessage(
      "Thanks for subscribing! You'll now get updates on our latest blog uploads."
    );

    // Reset message after 20 seconds
    setTimeout(() => {
      setMessage(defaultMessage);
    }, 20000);

    // Clear field
    setEmail("");
  }

  return (
    <footer id="footer" className="footer py-5">
      <div className="container">
        {/* NEWSLETTER — Glass Card */}
        <div className="newsletter-glass mb-5 p-4 rounded-4 shadow-lg">
          <div className="row align-items-center">
            {/* Left Section */}
            <div className="col-md-6 mb-3 mb-md-0 text-center text-md-start">
              <h4 className="fw-bold mb-2" style={{ color: "var(--text-color)" }}>Join Our Newsletter</h4>
              <p className="mb-0" style={{ color: "var(--text-color)" }}>{message}</p>
            </div>

            {/* Right Section */}
            <div className="col-md-6">
              <form
                onSubmit={postSubmit}
                className="newsletter-form d-flex justify-content-center justify-content-md-end"
              >
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={getInputData}
                  className="newsletter-input"
                  placeholder={
                    error ? "Email is mandatory" : "Enter your email"
                  }
                />

                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>

              {/* Error Message */}
              {error && (
                <p className="text-danger small mt-1 text-center text-md-end">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="text-center">
          <p className="copyright mb-3">
            © <strong className="sitename px-1">Portfolio</strong> | All Rights
            Reserved
          </p>

          {/* Social Links */}
          <div className="social-links d-flex justify-content-center gap-3 mb-3">
            <a href="#" className="social-icon">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="bi bi-facebook"></i>
            </a>
            <a
              href="https://www.instagram.com/_ishaan_12"
              target="_blank"
              className="social-icon"
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/ishaan-gupta-2a0568242"
              target="_blank"
              className="social-icon"
            >
              <i className="bi bi-linkedin"></i>
            </a>
          </div>

          {/* Credits */}
          <p className="credits" style={{ color: "var(--text-color)" }}>
            Designed & Developed by{" "}
            <span className="fw-bold">Ishaan Gupta</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
