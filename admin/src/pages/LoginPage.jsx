import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const THEME_KEY = "adminHMD.colorTheme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-bs-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [remember,  setRemember]  = useState(false);
  const [validated, setValidated] = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  // Apply theme on mount
  useEffect(() => {
    applyTheme(getPreferredTheme());
    document.body.classList.add("auth-body");
    return () => document.body.classList.remove("auth-body");
  }, []);

  // Read current theme for the icon
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  function handleThemeToggle() {
    applyTheme(theme === "dark" ? "light" : "dark");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setValidated(true);
    if (!e.target.checkValidity()) return;

    setLoading(true);
    setError("");
    try {
      let response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER}/api/user/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      response = await response.json();

      if (response.result === "Done" && response.data.active === false) {
        setError("Your account is inactive. Please contact support.");
      } else if (response.result === "Done") {
        if (response.data.role === "Recruiter" || response.data.role === "Super Admin") {
          localStorage.setItem("login", true);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("userid", response.data._id);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("token", response.token);
          const incomplete = ["address", "state", "pin", "phone", "name", "city"]
            .some(f => !response.data[f]);
          navigate(incomplete ? "/profile" : "/");
        } else {
          setError("You are not authorized to access this panel.");
        }
      } else {
        setError("Invalid email or password.");
      }
    } catch {
      setError("Internal Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating theme toggle */}
      <button
        className="icon-button theme-toggle auth-theme-toggle"
        type="button"
        onClick={handleThemeToggle}
        aria-label="Switch color theme"
        title="Switch color theme"
      >
        <i
          className={theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars"}
          aria-hidden="true"
        />
      </button>

      <main className="auth-page">
        <section className="auth-card">

          {/* Brand */}
          <Link className="auth-brand" to="/">
            <span className="brand-icon">
              <i className="bi bi-grid-1x2-fill" aria-hidden="true"></i>
            </span>
            <span>
              <strong>adminHMD</strong>
              <small>Sign in to your admin workspace.</small>
            </span>
          </Link>

          {/* Hero image */}
          <div className="auth-visual">
            <img
              src="/images/png/dasher-ui-bootstrap-5.jpg"
              alt="adminHMD dashboard interface"
            />
          </div>

          {/* Form */}
          <form
            className={`needs-validation${validated ? " was-validated" : ""}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <p className="eyebrow mb-1">Secure Access</p>
              <h1 className="h3 mb-1">Login</h1>
              <p className="text-muted mb-0">Sign in to your admin workspace.</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-3">
              <label className="form-label" htmlFor="loginEmail">
                Email address
              </label>
              <input
                className="form-control"
                id="loginEmail"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <div className="invalid-feedback">Enter a valid email.</div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label" htmlFor="loginPassword">
                  Password
                </label>
                <Link className="small fw-semibold" to="/forgot-password">
                  Forgot?
                </Link>
              </div>
              <input
                className="form-control"
                id="loginPassword"
                type="password"
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div className="invalid-feedback">
                Password must be at least 6 characters.
              </div>
            </div>

            {/* Remember me */}
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" /> Signing in…</>
                : <><i className="bi bi-box-arrow-in-right" aria-hidden="true" /> Sign In</>
              }
            </button>
          </form>

          <div className="auth-footer">
            New here? <Link to="/register">Create an account</Link>
          </div>

        </section>
      </main>
    </>
  );
}