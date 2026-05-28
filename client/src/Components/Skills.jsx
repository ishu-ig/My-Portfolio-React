import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "aos/dist/aos.css";
import AOS from "aos";
import { getSkill } from "../Redux/ActionCreators/SkillActionCreators";

export default function Skills() {
  let SkillStateData = useSelector((state) => state.SkillStateData);
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSkill());
    AOS.init({ duration: 1000, once: false }); // 🔹 animations trigger on every scroll
    AOS.refresh(); // refresh animations when content changes
  }, [dispatch]);

  return (
    <section
      id="skills"
      className="skills-section py-5"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="container text-center" data-aos="fade-up">
        <h2 className="section-title " style={{ color: "var(--text-color)" }}>
          Skills
        </h2>
        <div className="title-shape">
          <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
          </svg>
        </div>
        <p className="section-subtitle mb-4" style={{ color: "var(--text-color)" }}>
          Enhancing my expertise through continuous learning and innovation.
        </p>

        <div
          className="row g-4 skills-container justify-content-center"
          style={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
          }}
        >
          {SkillStateData.filter((x) => x.active).map((skill, index) => (
            <div
              key={skill._id}
              className="col-6 col-md-4 col-lg-3"
              data-aos="fade-up"
              data-aos-delay={index * 100} // stagger effect
            >
              <div className="skill-card">
                <h3
                  className="skill-name "
                  style={{ color: "var(--text-color)" }}
                >
                  {skill.name}
                </h3>
                <p className="skill-description mobile-trim">
                  {skill.description}
                </p>
                <span className="skill-value">{skill.level}%</span>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${skill.level}%` }}
                    aria-valuenow={skill.level}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
