// ─────────────────────────────────────────────────────────────
// Paste this useEffect inside your Home page component.
// It handles scroll-to-section when arriving from another page
// e.g. /serviceDetail/xxx#resume → navigates to / → scrolls to #resume
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Inside your Home component:
const location = useLocation();

useEffect(() => {
  // Small delay lets the page DOM fully render before scrolling
  const timer = setTimeout(() => {
    const hash = window.location.hash; // e.g. "#resume"
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, 350);
  return () => clearTimeout(timer);
}, [location]);

// ─────────────────────────────────────────────────────────────
// Also make sure each section has the correct id, e.g.:
//   <section id="resume">...</section>
//   <section id="skills">...</section>
//   <section id="about">...</section>
// ─────────────────────────────────────────────────────────────
