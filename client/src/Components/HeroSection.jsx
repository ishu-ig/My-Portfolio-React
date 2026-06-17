import React, { useEffect, useState, useContext } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import { ThemeContext } from "../ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { getAbout } from "../Redux/ActionCreators/AboutActionCreators";

export default function HeroSection() {
    const { theme } = useContext(ThemeContext);
    const dispatch = useDispatch();
    const AboutStateData = useSelector((state) => state.AboutStateData);
    const data = AboutStateData?.[0] ?? null;

    const words = ["Developer", "Coder", "Graphic Designer", "UI/UX Designer"];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    useEffect(() => {
        dispatch(getAbout());
    }, []);

    useEffect(() => {
        const typingSpeed = isDeleting ? 50 : 100;
        let timeout;

        if (!isDeleting && text === words[currentWordIndex]) {
            timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && text === "") {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
        } else {
            timeout = setTimeout(() => {
                setText((prevText) =>
                    isDeleting
                        ? prevText.slice(0, -1)
                        : words[currentWordIndex].slice(0, prevText.length + 1)
                );
            }, typingSpeed);
        }

        return () => clearTimeout(timeout);
    }, [text, isDeleting, currentWordIndex]);

    if (!data) return null;

    return (
        <section
            id="home"
            className="hero-section d-flex align-items-center"
            style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
                transition: "background-color 0.3s ease, color 0.3s ease"
            }}
        >
            <div className="container">
                <div className="row align-items-center">

                    {/* Left Side */}
                    <div className="col-lg-6 text-center text-lg-start" data-aos="fade-right">
                        <h1 className="display-4 fw-bold" style={{ color: "var(--text-color)" }}>
                            {data.name}
                        </h1>

                        {/* Typing Animation */}
                        <div className="typing-container">
                            <span className="static-text">I'm a</span>
                            <span className="dynamic-text ps-2">{text}</span>
                            <span className="cursor">|</span>
                        </div>

                        <p className="lead" style={{ color: "var(--text-color)" }}>
                            {data.shortDescription}
                        </p>

                        {/* CTA Buttons */}
                        <div className="action-buttons d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mt-4 my-sm-3">
                            <a href="#portfolio" className="btn btn-primary btn-lg">
                                My Work
                            </a>
                            {data.resume && (
                                <a
                                    href={data.resume}
                                    className="btn btn-outline-dark btn-lg px-4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Resume
                                </a>
                            )}
                        </div>
                        

                        {/* Stats */}
                        <div className="hero-stats mt-5 d-flex justify-content-center justify-content-lg-start gap-4">
                            <div className="stat-item">
                                <span className="stat-number">{data.yearExperience ?? 0}+</span>
                                <span className="stat-label" style={{ color: "var(--text-color)" }}>
                                    Years Experience
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{data.projectsCompleted ?? 0}+</span>
                                <span className="stat-label" style={{ color: "var(--text-color)" }}>
                                    Projects Completed
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{data.programmingQuestions ?? 0}+</span>
                                <span className="stat-label" style={{ color: "var(--text-color)" }}>
                                    Programming Questions
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="col-lg-6 text-center" data-aos="fade-left">
                        <div className="hero-image position-relative">
                            <img
                                src={data.pic || "/img/profile/profile-1.webp"}
                                alt={data.name}
                                className="img-fluid rounded shadow-lg"
                            />
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}