import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAchievement } from "../Redux/ActionCreators/AchievementActionCreators";

export default function Achievement() {
  const dispatch = useDispatch();
  const AchievementStateData = useSelector(state => state.AchievementStateData);
  const [counters, setCounters] = useState([]);
  const intervalsRef = useRef([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => { dispatch(getAchievement()); }, [dispatch]);

  useEffect(() => {
    if (!AchievementStateData?.length) return;
    const active = [...AchievementStateData]
      .filter(item => item.active)
      .sort((a, b) => a.order - b.order)
      .map(item => ({ ...item, value: 0, isStatic: item.type === "static" }));
    setCounters(active);
  }, [AchievementStateData]);

  useEffect(() => {
    if (!counters.length) return;
    intervalsRef.current.forEach(i => i && clearInterval(i));
    intervalsRef.current = [];

    counters.forEach((counter, index) => {
      if (counter.isStatic || !counter.target) return;
      let start = 0;
      const increment = Math.ceil(counter.target / 80);
      const id = setInterval(() => {
        start += increment;
        if (start >= counter.target) { start = counter.target; clearInterval(id); }
        setCounters(prev => {
          const updated = [...prev];
          if (updated[index]) updated[index] = { ...updated[index], value: start };
          return updated;
        });
      }, 30);
      intervalsRef.current[index] = id;
    });

    return () => intervalsRef.current.forEach(i => i && clearInterval(i));
  }, [counters.length]);

  if (!counters.length) return null;

  return (
    <section style={{ padding: "50px 16px", backgroundColor: "var(--bg-color)" }}>
      <div className="container">

        {/* ── Header ── */}
        <div className="text-center mb-4">
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
            Milestones
          </p>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--text-color)", margin: "0 0 10px" }}>
            Achievements
          </h2>
          <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 10px" }}>
            <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: 13, color: "var(--muted-color)", margin: 0 }}>
            Showcasing what I've achieved so far
          </p>
        </div>

        {/* ── Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 14,
          maxWidth: 780,
          margin: "0 auto",
        }}>
          {counters.map((counter, index) => (
            <div
              key={counter._id}
              onMouseEnter={() => setHovered(counter._id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: "var(--card-bg)",
                border: `1px solid ${hovered === counter._id ? "var(--primary-color)" : "var(--border-color)"}`,
                borderRadius: 14,
                padding: "18px 12px",
                textAlign: "center",
                transition: "transform 0.22s, border-color 0.22s, box-shadow 0.22s",
                transform: hovered === counter._id ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered === counter._id ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
                cursor: "default",
              }}
            >
              {/* Icon */}
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: "rgba(0,123,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>
                <i className={counter.icon} style={{ fontSize: 18, color: "var(--primary-color)" }} />
              </div>

              {/* Value */}
              {counter.isStatic ? (
                <>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-color)", margin: "0 0 3px" }}>
                    {counter.label}
                  </p>
                  <p style={{ fontSize: 11, color: "#22c55e", margin: 0, fontWeight: 500 }}>
                    {counter.stat}
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-color)", margin: "0 0 3px", lineHeight: 1 }}>
                    {counter.value}
                    <span style={{ fontSize: 13, fontWeight: 600 }}>+</span>
                  </p>
                  <p style={{ fontSize: 11, color: "var(--muted-color)", margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {counter.label}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}