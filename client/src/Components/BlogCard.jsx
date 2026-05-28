"use client";
import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog, index }) {
    if (!blog) return null;

    return (
        <>
            <style>{`
                .blog-card { height: 470px; }
                .blog-img-wrap { height: 200px; }

                @media (max-width: 767px) {
                    .blog-card { height: 340px; }
                    .blog-img-wrap { height: 130px; }
                    .blog-card .blog-meta { font-size: 0.72rem; }
                    .blog-card .blog-title { font-size: 0.9rem; }
                    .blog-card .blog-desc { -webkit-line-clamp: 2; }
                    .blog-card .blog-btn { padding: 6px; font-size: 0.8rem; }
                }
            `}</style>

            <div
                className="blog-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                style={{
                    backgroundColor: "var(--card-bg, #fff)",
                    color: "var(--text-color)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
            >
                {/* Image */}
                <div
                    className="blog-img-wrap"
                    style={{
                        width: "100%",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={blog.pic}
                        alt={blog.title}
                        style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                        }}
                        className="blog-img"
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0, left: 0,
                            width: "100%",
                            height: "60px",
                            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-3" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                    {/* Meta Row */}
                    <p
                        className="blog-meta mb-2"
                        style={{
                            color: "var(--text-color)",
                            fontSize: "0.85rem",
                            opacity: 0.8,
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <span>✍ {blog.author || "Admin"}</span>
                        <span>📅 {new Date(blog.date).toDateString()}</span>
                    </p>

                    {/* Title */}
                    <h5
                        className="blog-title"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            lineHeight: "1.4",
                            marginBottom: "8px",
                        }}
                    >
                        {blog.title}
                    </h5>

                    {/* Short Description */}
                    <p
                        className="blog-desc"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            opacity: 0.85,
                            fontSize: "0.95rem",
                            flex: 1,
                        }}
                    >
                        {blog.shortDescription}
                    </p>

                    {/* Button */}
                    <Link
                        to={`/blogDetail/${blog._id}`}
                        className="btn blog-btn mt-3"
                        style={{
                            background: "var(--secondary-color)",
                            color: "#fff",
                            padding: "10px",
                            borderRadius: "8px",
                            fontWeight: 600,
                            transition: "0.3s ease",
                        }}
                    >
                        Read More →
                    </Link>
                </div>
            </div>
        </>
    );
}