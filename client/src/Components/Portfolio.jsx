import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPortfolio } from '../Redux/ActionCreators/PortfolioActionCreators';
import { Link } from 'react-router-dom';

export default function Portfolio() {
    const PortfolioStateData = useSelector(state => state.PortfolioStateData);
    const dispatch = useDispatch();
    const [activeFilter, setActiveFilter] = useState('all');
    const [hoveredId, setHoveredId] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        dispatch(getPortfolio());
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    const activeItems = PortfolioStateData.filter(x => x.active);
    const categories = ['all', ...new Set(activeItems.map(x => x.category))];
    const filtered = activeItems.filter(
        x => activeFilter === 'all' || x.category === activeFilter
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=DM+Sans:wght@400;500&display=swap');

                .pf-section { padding: 80px 0 100px; background: var(--bg-color); color: var(--text-color); }

                .pf-eyebrow {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 11px; font-weight: 500; letter-spacing: 3px;
                    text-transform: uppercase; color: var(--primary-color);
                    margin: 0 0 10px;
                }
                .pf-title {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 4vw, 2.8rem);
                    font-weight: 600; margin: 0 0 16px;
                    color: var(--text-color); line-height: 1.15;
                }
                .pf-squiggle { width: 70px; display: block; margin: 0 auto 18px; }
                .pf-subtitle {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px; color: var(--muted-color);
                    max-width: 460px; margin: 0 auto; line-height: 1.7;
                }

                .pf-filters {
                    display: flex; flex-wrap: wrap; gap: 8px;
                    justify-content: center; margin-bottom: 40px;
                }
                .pf-pill {
                    font-family: 'DM Sans', sans-serif;
                    padding: 7px 20px; border-radius: 999px;
                    font-size: 13px; font-weight: 500;
                    cursor: pointer; transition: all 0.22s ease;
                    text-transform: capitalize;
                    border: 1.5px solid var(--border-color);
                    background: transparent;
                    color: var(--muted-color);
                }
                .pf-pill:hover:not(.pf-pill--active) {
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                }
                .pf-pill--active {
                    background: var(--primary-color);
                    border-color: var(--primary-color);
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(var(--primary-rgb, 108,99,255), 0.35);
                }

                .pf-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 24px;
                    justify-content: center;
                }

                .pf-card {
                    width: calc(33.33% - 16px);
                    border-radius: 16px;
                    overflow: hidden;
                    background: var(--card-bg, #fff);
                    border: 1px solid var(--border-color);
                    transition: transform 0.28s cubic-bezier(.22,1,.36,1),
                                border-color 0.28s ease,
                                box-shadow 0.28s ease;
                    opacity: 0;
                    transform: translateY(22px);
                    animation: pf-fadein 0.45s ease forwards;
                    min-width: 0;
                }

                @media (max-width: 992px) {
                    .pf-grid { gap: 20px; }
                    .pf-card { width: calc(50% - 10px); }
                }
                @media (max-width: 768px) {
                    .pf-grid { gap: 14px; }
                    .pf-card { width: calc(50% - 7px); }
                }
                @media (max-width: 359px) {
                    .pf-card { width: 100%; }
                }

                .pf-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--primary-color);
                    box-shadow: 0 16px 48px rgba(0,0,0,0.13);
                }

                @keyframes pf-fadein {
                    to { opacity: 1; transform: translateY(0); }
                }

                .pf-img-wrap {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                    background: var(--card-bg);
                }
                @media (max-width: 768px) {
                    .pf-img-wrap { height: 130px; }
                }
                .pf-img-wrap img {
                    width: 100%; height: 100%; object-fit: cover;
                    display: block;
                    transition: transform 0.38s cubic-bezier(.22,1,.36,1);
                }
                .pf-card:hover .pf-img-wrap img { transform: scale(1.06); }

                .pf-badge {
                    position: absolute; top: 8px; left: 8px;
                    background: var(--primary-color); color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 10px; font-weight: 600;
                    letter-spacing: 0.5px; text-transform: capitalize;
                    padding: 3px 9px; border-radius: 999px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
                }

                .pf-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(160deg, rgba(10,14,40,0.72) 0%, rgba(10,14,40,0.55) 100%);
                    display: flex; align-items: center; justify-content: center;
                    gap: 14px;
                    opacity: 0;
                    transition: opacity 0.25s ease;
                    backdrop-filter: blur(2px);
                }
                .pf-card:hover .pf-overlay { opacity: 1; }

                .pf-action-btn {
                    width: 38px; height: 38px; border-radius: 50%;
                    background: rgba(255,255,255,0.95);
                    display: flex; align-items: center; justify-content: center;
                    color: #111; text-decoration: none;
                    font-size: 15px;
                    border: none; cursor: pointer;
                    transition: transform 0.18s ease, background 0.18s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.18);
                }
                .pf-action-btn:hover {
                    transform: scale(1.12);
                    background: var(--primary-color);
                    color: #fff;
                }

                .pf-card-body { padding: 11px 13px 13px; }
                .pf-card-name {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px; font-weight: 500;
                    color: var(--text-color);
                    margin: 0 0 4px;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
                .pf-card-cat {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 11px; color: var(--muted-color);
                    margin: 0; display: flex; align-items: center; gap: 4px;
                }
                @media (max-width: 400px) {
                    .pf-card-cat-text { display: none; }
                }

                .pf-card-footer {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    margin-top: 10px; padding-top: 10px;
                    border-top: 1px solid var(--border-color);
                }
                .pf-view-link {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 11.5px; font-weight: 500;
                    color: var(--primary-color); text-decoration: none;
                    display: flex; align-items: center; gap: 4px;
                    transition: gap 0.18s ease;
                    white-space: nowrap;
                }
                .pf-view-link:hover { gap: 8px; }
                .pf-live-link {
                    font-size: 15px; color: var(--muted-color);
                    text-decoration: none; transition: color 0.18s;
                    flex-shrink: 0;
                }
                .pf-live-link:hover { color: var(--primary-color); }

                .pf-empty {
                    text-align: center; padding: 60px 20px;
                    font-family: 'DM Sans', sans-serif;
                    color: var(--muted-color); font-size: 15px;
                    width: 100%;
                }
            `}</style>

            <section id="portfolio" className="pf-section">
                <div className="container-fluid px-4 px-lg-5 text-center mb-5" data-aos="fade-up">
                    <p className="pf-eyebrow">My Work</p>
                    <h2 className="pf-title">Portfolio</h2>
                    <svg className="pf-squiggle" viewBox="0 0 80 16">
                        <path
                            d="M0 8 C13 0,20 16,40 8 C60 0,67 16,80 8"
                            stroke="var(--primary-color)" strokeWidth="2"
                            fill="none" strokeLinecap="round"
                        />
                    </svg>
                    <p className="pf-subtitle">
                        Showcasing my best works in web design, graphics, motion, and branding.
                    </p>
                </div>

                <div className="container-fluid px-4 px-lg-5" data-aos="fade-up">
                    <div className="pf-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`pf-pill${activeFilter === cat ? ' pf-pill--active' : ''}`}
                                onClick={() => setActiveFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="container-fluid px-4 px-lg-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="pf-grid">
                        {filtered.length === 0 && (
                            <div className="pf-empty">No projects found in this category.</div>
                        )}
                        {filtered.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="pf-card"
                                style={{ animationDelay: `${index * 60}ms` }}
                                onMouseEnter={() => setHoveredId(item._id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className="pf-img-wrap">
                                    <img src={item.pic} alt={item.name} loading="lazy" />
                                    <span className="pf-badge">{item.category}</span>
                                    <div className="pf-overlay">
                                        <a
                                            href={item.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pf-action-btn"
                                            title="Live Preview"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </a>
                                        <Link
                                            to={`/projectDetail/${item._id}`}
                                            className="pf-action-btn"
                                            title="View Details"
                                        >
                                            <i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>

                                <div className="pf-card-body">
                                    <p className="pf-card-name">{item.name}</p>
                                    <p className="pf-card-cat">
                                        <i className="bi bi-grid-3x3-gap"></i>
                                        <span className="pf-card-cat-text">{item.category}</span>
                                    </p>
                                    <div className="pf-card-footer">
                                        <Link
                                            to={`/projectDetail/${item._id}`}
                                            className="pf-view-link"
                                        >
                                            View details <i className="bi bi-arrow-right"></i>
                                        </Link>
                                        {item.liveUrl && (
                                            <a
                                                href={item.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pf-live-link"
                                                title="Open live site"
                                            >
                                                <i className="bi bi-box-arrow-up-right"></i>
                                            </a>
                                        )}
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