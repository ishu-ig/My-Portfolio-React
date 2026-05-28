import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreators/BlogActionCreators";
import BlogCard from "../Components/BlogCard";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Blog() {
    const dispatch = useDispatch();
    const BlogStateData = useSelector((state) => state.BlogStateData);

    useEffect(() => {
        dispatch(getBlog());
        AOS.init({ duration: 1000 });
    }, [dispatch]);

    return (
        <section
            id="Blogs"
            className="py-5"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="container text-center">

                {/* Title */}
                <h2 className="section-title" data-aos="fade-up" style={{ color: "var(--text-color)" }}>
                    Latest Blogs
                </h2>

                <div className="title-shape" data-aos="fade-up" data-aos-delay="100">
                    <svg viewBox="0 0 200 20">
                        <path
                            d="M 0,10 C 40,0 60,20 100,10 C 140,0 160,20 200,10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

                <p
                    className="section-description mb-4"
                    data-aos="fade-up"
                    data-aos-delay={200}
                >
                    Explore expert articles, health tips, and the latest insights in AI-driven healthcare.
                </p>

                {/* Blog Grid */}
                <div className="row g-4 mt-4">
                    {Array.isArray(BlogStateData) &&
                        BlogStateData.filter((b) => b.active)
                            .slice(0, 9) // show only 6 on homepage
                            .map((blog, index) => (
                                <div
                                    key={blog._id}
                                    className="col-6 col-md-4 col-lg-4"
                                >
                                    <BlogCard blog={blog} index={index} />
                                </div>
                            ))}
                </div>

                {/* View More Blogs Button */}
                <div className="text-center mt-4">
                    <Link
                        to="/blog"
                        className="btn btn-secondary px-4 py-2"
                        style={{
                            borderRadius: "8px",
                            fontWeight: 600,
                            fontSize: "1rem",
                        }}
                    >
                        View More Blogs →
                    </Link>
                </div>

            </div>
        </section>
    );
}
