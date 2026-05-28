import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAchievement } from "../Redux/ActionCreators/AchievementActionCreators";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Achievement() {
  const dispatch = useDispatch();
  const AchievementStateData = useSelector(state => state.AchievementStateData);
  const [counters, setCounters] = useState([]);
  const intervalsRef = useRef([]);

  useEffect(() => {
    dispatch(getAchievement());
    AOS.init({ duration: 1000, once: false });
    AOS.refresh();
  }, [dispatch]);

  useEffect(() => {
    if (!AchievementStateData?.length) return;

    const active = [...AchievementStateData]
      .filter(item => item.active)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        value: 0,
        isStatic: item.type === "static",
      }));

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

        if (start >= counter.target) {
          start = counter.target;
          clearInterval(id);
        }

        setCounters(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], value: start };
          }
          return updated;
        });
      }, 30);

      intervalsRef.current[index] = id;
    });

    return () => intervalsRef.current.forEach(i => i && clearInterval(i));
  }, [counters.length]);

  if (!counters.length) return null;

  return (
    <section
      className="py-5 text-center"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="container">

        <h2 data-aos="fade-down">Achievements</h2>

        <div className="title-shape" data-aos="fade-up" data-aos-delay={100}>
          <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <p
          className="section-description mb-4 mt-2"
          data-aos="fade-up"
          data-aos-delay={200}
          style={{ color: "var(--text-color)" }}
        >
          Showcasing What I Have Achieved So Far
        </p>

        <div className="row g-4 justify-content-center mt-2">
          {counters.map((counter, index) => (
            <div
              key={counter._id}
              className="col-6 col-md-4 col-lg-3"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {counter.isStatic ? (
                <div className="achievement-card shadow-lg h-100">
                  <i className={`${counter.icon} icon-achievement text-primary`} />
                  <h4 className="fw-bold mb-1">{counter.label}</h4>
                  <p className="text-success stat-text">{counter.stat}</p>
                </div>
              ) : (
                <div className="achievement-card shadow-lg h-100">
                  <i className={`${counter.icon} icon-achievement text-primary`} />
                  <h2 className="fw-bold count-number mb-1">
                    {counter.value}
                    <span style={{ fontSize: "0.55em" }}>+</span>
                  </h2>
                  <p className="count-label">{counter.label}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}