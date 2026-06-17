import React, { useEffect, useState } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useDispatch, useSelector } from 'react-redux';
import { getAbout } from '../Redux/ActionCreators/AboutActionCreators';

export default function About() {
    const dispatch = useDispatch();
    const AboutStateData = useSelector((state) => state.AboutStateData);
    const [data, setData] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    useEffect(() => {
        dispatch(getAbout());
    }, []);

    useEffect(() => {
        if (AboutStateData?.length) {
            setData(AboutStateData[0]);
        }
    }, [AboutStateData]);

    if (!data) return null;

    const personalInfo = [
        { label: 'Name',        value: data.name },
        { label: 'Phone',       value: data.phone },
        { label: 'Age',         value: data.age ? `${data.age} Years` : null },
        { label: 'Email',       value: data.email },
        { label: 'Occupation',  value: data.occupation },
        { label: 'Nationality', value: data.nationality },
    ].filter((item) => item.value);

    return (
        <section
            id="about"
            className="about-section py-5"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="container">
                {/* Section Title */}
                <div className="text-center mb-5" data-aos="fade-up">
                    <h2 className="section-title" style={{ color: "var(--text-color)" }}>About</h2>
                    <div className="title-shape">
                        <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <p className="section-subtitle" style={{ color: "var(--text-color)" }}>
                        {data.subtitle}
                    </p>
                </div>

                <div className="row align-items-center">
                    {/* Profile Image */}
                    <div className="col-lg-6 text-center" data-aos="fade-right">
                        <div className="about-image">
                            <img
                                src={data.pic || "/img/profile/my_image.jpg"}
                                alt={data.name}
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </div>
                    </div>

                    {/* About Content */}
                    <div className="col-lg-6" data-aos="fade-left">
                        <div className="about-content">
                            <h3 className="subtitle">About Me</h3>
                            <h2 className="about-heading" style={{ color: "var(--text-color)" }}>
                                {data.heading}
                            </h2>
                            <p className="lead" style={{ color: "var(--text-color)" }}>
                                {data.shortDescription}
                            </p>
                            <p className="mb-5" style={{ color: "var(--text-color)" }}>
                                {data.longDescription}
                            </p>

                            {/* Personal Info Cards */}
                            <div
                                className="personal-info"
                                style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
                            >
                                {personalInfo.map((item, index) => (
                                    <div key={index} className="info-card">
                                        <p><strong>{item.label}:</strong></p>
                                        <p>{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Resume Button */}
                            {/* {data.resume && (
                                <a
                                    href={data.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary mt-4"
                                >
                                    <i className="bi bi-file-earmark-pdf me-2"></i>
                                    Download Resume
                                </a>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}