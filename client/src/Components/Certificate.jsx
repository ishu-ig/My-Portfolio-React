import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getCertificate } from '../Redux/ActionCreators/CertificateActionCreators';
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Certificates() {
    const CertificateStateData = useSelector(state => state.CertificateStateData);
    const dispatch = useDispatch();
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        dispatch(getCertificate());
        AOS.init({ duration: 900, once: false });
        AOS.refresh();
    }, [dispatch]);

    const active = CertificateStateData.filter(x => x.active);

    return (
        <>
            <style>{`
                .cert-section {
                    padding: 70px 0;
                    background-color: var(--bg-color);
                }

                .cert-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    justify-content: center;
                }

                .cert-card {
                    width: calc(33.33% - 14px);
                    background: var(--card-bg);
                    border-radius: 14px;
                    border: 1px solid var(--border-color);
                    overflow: hidden;
                    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }
                @media (max-width: 992px) {
                    .cert-card { width: calc(50% - 10px); }
                }
                @media (max-width: 359px) {
                    .cert-card { width: 100%; }
                }

                .cert-card:hover {
                    transform: translateY(-7px);
                    border-color: var(--primary-color);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
                }

                .cert-ribbon {
                    position: absolute; top: 12px; right: 0;
                    background: var(--primary-color); color: #fff;
                    font-size: 10px; font-weight: 500;
                    padding: 3px 10px 3px 8px;
                    border-radius: 4px 0 0 4px;
                    z-index: 2; display: flex; align-items: center; gap: 4px;
                }

                .cert-img-wrap {
                    display: block;
                    position: relative;
                    overflow: hidden;
                    height: 155px;
                    text-decoration: none;
                }
                @media (max-width: 768px) {
                    .cert-img-wrap { height: 120px; }
                }
                .cert-img-wrap img {
                    width: 100%; height: 100%;
                    object-fit: cover; display: block;
                    transition: transform 0.3s;
                    background-color: var(--card-bg);
                }
                .cert-card:hover .cert-img-wrap img { transform: scale(1.06); }

                .cert-img-overlay {
                    position: absolute; inset: 0;
                    background: rgba(10,18,45,0.6);
                    opacity: 0;
                    transition: opacity 0.22s;
                    display: flex; align-items: center; justify-content: center;
                }
                .cert-card:hover .cert-img-overlay { opacity: 1; }

                .cert-overlay-btn {
                    background: #fff; color: #111;
                    font-size: 11px; font-weight: 500;
                    padding: 5px 14px; border-radius: 999px;
                    display: flex; align-items: center; gap: 5px;
                }

                .cert-body {
                    padding: 12px 14px 14px;
                    flex: 1; display: flex; flex-direction: column;
                }
                .cert-issuer {
                    display: flex; align-items: center; gap: 5px; margin-bottom: 6px;
                }
                .cert-issuer-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--primary-color); flex-shrink: 0;
                }
                .cert-issuer-name {
                    font-size: 11px; color: var(--primary-color); font-weight: 500;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .cert-name {
                    font-size: 13px; font-weight: 600; color: var(--text-color);
                    margin: 0 0 auto; line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    padding-bottom: 10px;
                }
                .cert-footer {
                    display: flex; align-items: center; justify-content: space-between;
                    padding-top: 10px;
                    border-top: 1px solid var(--border-color);
                    margin-top: 10px;
                }
                .cert-badge {
                    font-size: 10px; font-weight: 500;
                    background: var(--primary-color); color: #fff;
                    padding: 2px 9px; border-radius: 999px;
                }
                .cert-open-link {
                    font-size: 11px; color: var(--primary-color);
                    text-decoration: none;
                    display: flex; align-items: center; gap: 3px;
                }
                .cert-open-link:hover { text-decoration: underline; }

                .cert-stats {
                    display: flex; align-items: center; justify-content: center;
                    gap: 32px; padding: 14px 24px;
                    background: var(--card-bg);
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    margin-bottom: 36px;
                    flex-wrap: wrap;
                }
                .cert-stat { text-align: center; }
                .cert-stat-n {
                    font-size: 1.4rem; font-weight: 600;
                    color: var(--primary-color); display: block;
                }
                .cert-stat-l { font-size: 11px; color: var(--muted-color); }
                .cert-stat-divider {
                    width: 1px; height: 32px; background: var(--border-color);
                }
                @media (max-width: 400px) {
                    .cert-stat-divider { display: none; }
                    .cert-stats { gap: 16px; }
                }
            `}</style>

            <section id="certificate" className="cert-section">
                <div className="container">

                    {/* Header */}
                    <div className="text-center mb-4" data-aos="fade-up">
                        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--primary-color)", margin: "0 0 8px" }}>
                            Achievements
                        </p>
                        <h2 style={{ fontSize: "2rem", fontWeight: 600, color: "var(--text-color)", margin: "0 0 10px" }}>
                            Certificates
                        </h2>
                        <svg viewBox="0 0 80 16" style={{ width: 70, display: "block", margin: "0 auto 14px" }}>
                            <path d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8" stroke="var(--primary-color)" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </svg>
                        <p style={{ fontSize: 15, color: "var(--muted-color)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
                            Professional certifications that validate my expertise and commitment to continuous learning.
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="cert-stats" data-aos="fade-up" data-aos-delay="100">
                        {[
                            { n: `${active.length}+`, l: "Certificates" },
                            { n: `${new Set(active.map(c => c.issuedBy)).size}`, l: "Issuers" },
                            { n: `${new Set(active.map(c => c.category)).size || "3"}`, l: "Domains" },
                        ].map((s, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className="cert-stat-divider" />}
                                <div className="cert-stat">
                                    <span className="cert-stat-n">{s.n}</span>
                                    <span className="cert-stat-l">{s.l}</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="cert-grid">
                        {active.map((cert, index) => (
                            <div
                                key={cert._id}
                                className="cert-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 70}
                                onMouseEnter={() => setHovered(cert._id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {/* Verified ribbon */}
                                <div className="cert-ribbon">
                                    <i className="bi bi-patch-check-fill" style={{ fontSize: 10 }}></i>
                                    Verified
                                </div>

                                {/* Image */}
                                <Link to={cert.pic} target="_blank" className="cert-img-wrap">
                                    <img src={cert.pic} alt={cert.name} loading="lazy" />
                                    <div className="cert-img-overlay">
                                        <span className="cert-overlay-btn">
                                            <i className="bi bi-box-arrow-up-right" style={{ fontSize: 12 }}></i>
                                            View Certificate
                                        </span>
                                    </div>
                                </Link>

                                {/* Body */}
                                <div className="cert-body">
                                    <div className="cert-issuer">
                                        <span className="cert-issuer-dot" />
                                        <span className="cert-issuer-name">{cert.issuedBy}</span>
                                    </div>
                                    <p className="cert-name">{cert.name}</p>
                                    <div className="cert-footer">
                                        <span className="cert-badge">{cert.category || "Certified"}</span>
                                        <Link to={cert.pic} target="_blank" className="cert-open-link">
                                            Open <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
}