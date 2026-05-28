"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreators/BlogActionCreators";
import BlogCard from "./BlogCard";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

export default function Blog() {
    const dispatch = useDispatch();
    const BlogStateData = useSelector((state) => state.BlogStateData);

    useEffect(() => {
        dispatch(getBlog());
        AOS.init({ duration: 1000 });
    }, [dispatch]);

    return (
        <section
            id="blog"
            className="py-5"
            style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
        >
            <div className="container text-center">

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
                    style={{ color: "var(--text-color)" }}
                    data-aos="fade-up"
                    data-aos-delay={200}
                >
                    Explore expert articles, health tips, and the latest insights in AI-driven healthcare.
                </p>

                <Swiper
                    freeMode={true}
                    modules={[FreeMode]}
                    className="mySwiper"
                    loop={true}
                    breakpoints={{
                        0:    { slidesPerView: 2, spaceBetween: 10 },
                        768:  { slidesPerView: 2, spaceBetween: 16 },
                        992:  { slidesPerView: 3, spaceBetween: 20 },
                        1200: { slidesPerView: 3.3, spaceBetween: 20 },
                    }}
                >
                    {Array.isArray(BlogStateData) &&
                        BlogStateData.filter((b) => b.active).map((blog, index) => (
                            <SwiperSlide key={blog._id}>
                                <BlogCard blog={blog} index={index} />
                            </SwiperSlide>
                        ))}
                </Swiper>

                <div className="text-center mt-4">
                    <Link
                        to="/blog"
                        className="btn btn-secondary px-4 py-2"
                        style={{
                            borderRadius: "8px",
                            fontWeight: "600",
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