import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../Redux/ActionCreators/BlogActionCreators";
import {
  getComment,
  createComment,
} from "../Redux/ActionCreators/CommentActionCreators";

import { Link, useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function BlogDetail() {
  const { _id } = useParams();
  const dispatch = useDispatch();

  const BlogStateData = useSelector((state) => state.BlogStateData);
  const CommentStateData = useSelector((state) => state.CommentStateData);

  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);

  // Show initially only 2 comments
  const [visibleComments, setVisibleComments] = useState(2);

  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    commentText: "",
  });

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success");

  // Load Blogs
  useEffect(() => {
    dispatch(getBlog());
    AOS.init({ duration: 1000 });
  }, [dispatch]);

  // Load Comments
  useEffect(() => {
    dispatch(getComment());
  }, [dispatch]);

  // Set Blog + Similar Blogs
  useEffect(() => {
    if (BlogStateData?.length > 0) {
      const selected = BlogStateData.find((item) => item._id === _id);
      setBlog(selected || null);

      if (selected) {
        const sims = BlogStateData.filter(
          (item) =>
            item._id !== _id &&
            item.category?.toLowerCase() === selected.category?.toLowerCase()
        );
        setSimilarBlogs(sims);
      }
    }
  }, [BlogStateData, _id]);

  // ============================
  // SUBMIT COMMENT USING REDUX
  // ============================
  const submitComment = () => {
    if (!commentForm.name || !commentForm.email || !commentForm.commentText) {
      setAlertType("danger");
      setAlertMsg("All fields are required!");
      return;
    }

    const data = {
      ...commentForm,
      blogId: _id, // Required for backend
    };

    dispatch(createComment(data));

    setAlertType("success");
    setAlertMsg("Comment submitted successfully!");

    setCommentForm({ name: "", email: "", commentText: "" });

    setTimeout(() => {
      dispatch(getComment());
    }, 500);

    setTimeout(() => {
      const modal = document.getElementById("commentModal");
      const modalInstance = window.bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setAlertMsg(null);
    }, 1200);
  };

  if (!blog) return <div className="text-center py-5">Loading blog...</div>;

  // FILTER COMMENTS BY BLOG ID
  const blogComments = CommentStateData.filter((c) => c?.blogId?._id === _id);

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="container" style={{ maxWidth: "900px" }}>
        {/* BLOG TITLE */}
        <h1 className="text-center fw-bold mb-3">{blog.title}</h1>

        <p className="text-center mb-4">
          ✍ {blog.author || "Admin"} | 📅 {new Date(blog.date).toDateString()}
        </p>

        {/* BLOG IMAGE */}
        <img
          src={blog.pic}
          alt={blog.title}
          className="img-fluid rounded shadow-sm w-100 mb-4"
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />

        {/* BLOG CONTENT */}
        <div
          dangerouslySetInnerHTML={{ __html: blog.longDescription }}
          style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
        />

        {/* TAGS */}
        {blog.tags && (
          <div className="mt-4">
            <strong>Tags:</strong>
            <div className="mt-2">
              {blog.tags.split(",").map((tag, index) => (
                <span key={index} className="badge bg-secondary me-2">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------- COMMENTS SECTION ------------------------ */}
        <div
          className="mt-5 p-4 rounded shadow-sm card"
          style={{ backgroundColor: "var(--bg-color)" }}
        >
          <h4 className="fw-bold">Comments ({blogComments.length})</h4>

          {/* Display LIMITED Comments */}
          {blogComments.length > 0 ? (
            blogComments.slice(0, visibleComments).map((item) => (
              <div
                key={item._id}
                className="p-3 rounded mb-3 shadow-sm "
                style={{
                  backgroundColor: "var(--bg-color)",
                  color: "var(--text-color)",
                  border: "1px solid rgba(150,150,150,0.4)", // ⭐ Highlighted border added
                  borderRadius: "8px",
                }}
              >
                <h6 className="fw-bold" style={{ color: "var(--text-color)" }}>
                  {item.name}
                </h6>
                <p className="mt-2">{item.commentText}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

          {/* Show More / Show Less */}
          {blogComments.length > visibleComments && (
            <button
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => setVisibleComments(blogComments.length)}
            >
              Show More Comments
            </button>
          )}

          {visibleComments > 2 && (
            <button
              className="btn btn-outline-secondary btn-sm mt-2 ms-2"
              onClick={() => setVisibleComments(2)}
            >
              Show Less
            </button>
          )}

          {/* Floating PLUS Button */}
          <div className="text-end mt-3">
            <button
              className="btn btn-primary rounded-circle shadow"
              style={{
                width: "45px",
                height: "45px",
                fontSize: "24px",
                padding: 0,
                lineHeight: "45px",
                textAlign: "center",
              }}
              data-bs-toggle="modal"
              data-bs-target="#commentModal"
            >
              +
            </button>
          </div>
        </div>

        {/* ----------------------- COMMENT MODAL ------------------------ */}
        <div className="modal fade" id="commentModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{ backgroundColor: "var(--bg-color)" }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Add a Comment</h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                {alertMsg && (
                  <div className={`alert alert-${alertType}`}>{alertMsg}</div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={commentForm.name}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={commentForm.email}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Comment</label>
                  <textarea
                    className="form-control"
                    style={{ height: "120px" }}
                    value={commentForm.commentText}
                    onChange={(e) =>
                      setCommentForm({
                        ...commentForm,
                        commentText: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={submitComment}>
                  Submit Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------- RECOMMENDED BLOGS ------------------------ */}
        <div className="mt-5" data-aos="fade-up" data-aos-delay="200">
          <h4 className="fw-bold mb-3">Recommended Blogs</h4>

          {similarBlogs.length === 0 ? (
            <p className="text-muted">No similar blogs found.</p>
          ) : (
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={15}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500 }}
              breakpoints={{
                576: { slidesPerView: 1.2 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 2.5 },
              }}
            >
              {similarBlogs.map((item) => (
                <SwiperSlide key={item._id}>
                  <Link
                    to={`/blog/${item._id}`}
                    className="text-decoration-none"
                  >
                    <div className="card shadow-sm border-0">
                      <img
                        src={item.pic}
                        alt={item.title}
                        className="w-100"
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h6 className="fw-bold">{item.title}</h6>
                        <p
                          className="text-muted"
                          style={{ fontSize: "0.9rem", color: "var(--text-color)" }}
                        >
                          {item.shortDescription?.slice(0, 90)}...
                        </p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Bottom Buttons */}
        <div className="text-center mt-5">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/blog" className="btn btn-primary">
              📚 More Blogs
            </Link>

            <Link to="/" className="btn btn-primary">
              🏠 Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
