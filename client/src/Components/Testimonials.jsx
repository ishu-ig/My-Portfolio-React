import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { createTestimonial, getTestimonial } from "../Redux/ActionCreators/TestimonialActionCreators";
import formValidator from "../FormValidators/formValidator";
import imageValidator from "../FormValidators/imageValidator";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/pagination";

/* ── Design tokens (matches your existing dark-editorial Navbar theme) ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Instrument+Sans:wght@400;500;600&display=swap');

  /* ── Swiper pagination dots ── */
  #testimonials .swiper-pagination { position: static; margin-top: 28px; }
  #testimonials .swiper-pagination-bullet {
    width: 6px; height: 6px;
    background: var(--muted-color, #888);
    opacity: 0.35; transition: all 0.25s ease;
    border-radius: 3px;
  }
  #testimonials .swiper-pagination-bullet-active {
    width: 22px; opacity: 1;
    background: var(--primary-color, #6c63ff);
  }

  /* ── Card hover ── */
  .tcard {
    border-radius: 18px;
    padding: 26px 24px 22px;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .tcard::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-color, #6c63ff), transparent);
    opacity: 0;
    transition: opacity 0.28s ease;
  }
  .tcard:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
    border-color: var(--primary-color, #6c63ff);
  }
  .tcard:hover::before { opacity: 1; }

  /* ── Add button ── */
  .t-add-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 22px; border-radius: 999px;
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-color);
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.18s;
  }
  .t-add-btn:hover {
    background: var(--primary-color, #6c63ff);
    border-color: var(--primary-color, #6c63ff);
    color: #fff;
    transform: translateY(-1px);
  }

  /* ── Modal input ── */
  .t-input {
    width: 100%; padding: 10px 14px;
    border-radius: 10px; font-size: 13px;
    font-family: 'Instrument Sans', sans-serif;
    background: var(--bg-color); color: var(--text-color);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .t-input:focus {
    border-color: var(--primary-color, #6c63ff) !important;
    box-shadow: 0 0 0 3px rgba(108,99,255,0.12);
  }

  /* ── Modal overlay animation ── */
  @keyframes modalIn {
    from { opacity:0; transform: scale(0.96) translateY(10px); }
    to   { opacity:1; transform: scale(1) translateY(0); }
  }
  .t-modal-card { animation: modalIn 0.25s cubic-bezier(0.34,1.3,0.64,1) forwards; }

  /* ── Stars ── */
  .t-stars { display: flex; gap: 3px; margin-bottom: 12px; }
  .t-star { color: #f59e0b; font-size: 13px; }
`;

export default function Testimonial() {
  const testimonials = useSelector((state) => state.TestimonialStateData);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({ name: "", pic: "", message: "", active: true });
  const [error, setError] = useState({
    name: "Name Field is Mandatory",
    pic: "Pic Field is Mandatory",
    message: "Message Field is Mandatory",
  });

  useEffect(() => {
    dispatch(getTestimonial());
    AOS.init({ duration: 800, once: false });
    AOS.refresh();
  }, [dispatch]);

  const getInputData = (e) => {
    const { name } = e.target;
    const value = e.target.files ? e.target.files[0] : e.target.value;
    if (name !== "active") {
      setError((prev) => ({
        ...prev,
        [name]: e.target.files ? imageValidator(e) : formValidator(e),
      }));
    }
    setData((prev) => ({ ...prev, [name]: name === "active" ? value === "1" : value }));
  };

  const postSubmit = (e) => {
    e.preventDefault();
    const errorItem = Object.values(error).find((x) => x !== "");
    if (errorItem) { setShow(true); return; }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("pic", data.pic);
    formData.append("active", data.active);
    formData.append("message", data.message);
    dispatch(createTestimonial(formData));
    setShowModal(false);
    setShow(false);
    setData({ name: "", pic: "", message: "", active: true });
  };

  const active = testimonials.filter((x) => x.active);

  return (
    <section
      id="testimonials"
      style={{
        padding: "80px 16px 60px",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        overflowX: "hidden",
      }}
    >
      <style>{STYLES}</style>
      <div className="container">

        {/* ── Section header ── */}
        <div className="text-center mb-5" data-aos="fade-up">
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 11, fontWeight: 600,
            letterSpacing: "3px", textTransform: "uppercase",
            color: "var(--primary-color)", margin: "0 0 10px",
          }}>
            Kind Words
          </p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 800, letterSpacing: "-0.5px",
            color: "var(--text-color)", margin: "0 0 12px",
          }}>
            Client Testimonials
          </h2>
          {/* Wavy underline */}
          <svg viewBox="0 0 100 12" style={{ width: 80, display: "block", margin: "0 auto 16px" }}>
            <path
              d="M0 6 C16 0,25 12,50 6 C75 0,84 12,100 6"
              stroke="var(--primary-color)" strokeWidth="2"
              fill="none" strokeLinecap="round"
            />
          </svg>
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 14.5, color: "var(--muted-color)",
            maxWidth: 420, margin: "0 auto", lineHeight: 1.65,
          }}>
            Hear what people have to say about working with Ishaan.
          </p>
        </div>

        {/* ── Swiper ── */}
        <div data-aos="fade-up" data-aos-delay="100">
          <Swiper
            key={active.length}
            modules={[Autoplay, Pagination]}
            /*
              ❌ EffectFade removed — it locks slidesPerView to 1 on all screens.
              ✅ breakpoints handle responsive slide counts instead.
            */
            slidesPerView={1}
            spaceBetween={20}
            loop={active.length > 1}
            speed={600}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{
              /* mobile default: 1 slide (set above) */
              640: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              768: {
                /* tablet: 2 slides */
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                /* desktop: 3 slides */
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            style={{ paddingBottom: 10 }}
          >
            {active.map((t) => (
              <SwiperSlide key={t._id} style={{ height: "auto" }}>
                <TestimonialCard t={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ── Add button ── */}
        <div className="text-center mt-4" data-aos="fade-up">
          <button className="t-add-btn" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle" />
            Add Your Testimonial
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <TestimonialModal
          show={show}
          error={error}
          data={data}
          getInputData={getInputData}
          postSubmit={postSubmit}
          onClose={() => { setShowModal(false); setShow(false); }}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   CARD
───────────────────────────────────────── */
function TestimonialCard({ t }) {
  return (
    <div className="tcard">
      {/* Stars */}
      <div className="t-stars">
        {[1,2,3,4,5].map((s) => (
          <span key={s} className="t-star"><i className="bi bi-star-fill" /></span>
        ))}
      </div>

      {/* Quote icon */}
      <div style={{
        fontSize: 36, lineHeight: 1,
        color: "var(--primary-color)",
        opacity: 0.25,
        fontFamily: "Georgia, serif",
        marginBottom: 6,
        userSelect: "none",
      }}>"</div>

      {/* Message — flex:1 pushes profile to bottom */}
      <p style={{
        fontFamily: "'Instrument Sans', sans-serif",
        fontSize: 14, lineHeight: 1.75,
        color: "var(--muted-color)",
        fontStyle: "italic",
        flex: 1,
        margin: "0 0 20px",
      }}>
        {t.message}
      </p>

      {/* Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <img
          src={t.pic}
          alt={t.name}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--primary-color)",
            flexShrink: 0,
          }}
        />
        <div>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14, fontWeight: 700,
            color: "var(--text-color)", margin: 0,
          }}>{t.name}</p>
          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 11, color: "var(--primary-color)",
            margin: 0, display: "flex", alignItems: "center", gap: 4,
          }}>
            <i className="bi bi-patch-check-fill" style={{ fontSize: 11 }} />
            Verified Client
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL
───────────────────────────────────────── */
function TestimonialModal({ show, error, getInputData, postSubmit, onClose }) {
  const inputBorder = (err) =>
    `1px solid ${show && err ? "#ef4444" : "var(--border-color)"}`;

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="t-modal-card"
        style={{
          background: "var(--card-bg)",
          color: "var(--text-color)",
          borderRadius: 20,
          width: "100%", maxWidth: 480,
          border: "1px solid var(--border-color)",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-color)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(108,99,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="bi bi-chat-quote-fill" style={{ fontSize: 14, color: "var(--primary-color)" }} />
            </div>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700, fontSize: 15,
              color: "var(--text-color)", margin: 0,
            }}>Share Your Experience</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "var(--bg-color)",
              border: "1px solid var(--border-color)",
              fontSize: 14, cursor: "pointer",
              color: "var(--muted-color)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={postSubmit}>
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Name */}
            <div>
              <label style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--muted-color)", display: "block", marginBottom: 6, letterSpacing: "0.5px", textTransform: "uppercase" }}>Name</label>
              <input
                type="text" name="name"
                onChange={getInputData}
                placeholder="Your full name"
                className="t-input"
                style={{ border: inputBorder(error.name) }}
              />
              {show && error.name && <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: "#ef4444", margin: "5px 0 0" }}>{error.name}</p>}
            </div>

            {/* Message */}
            <div>
              <label style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--muted-color)", display: "block", marginBottom: 6, letterSpacing: "0.5px", textTransform: "uppercase" }}>Message</label>
              <textarea
                name="message"
                onChange={getInputData}
                placeholder="Share your experience working with Ishaan…"
                rows={4}
                className="t-input"
                style={{ border: inputBorder(error.message), resize: "vertical" }}
              />
              {show && error.message && <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: "#ef4444", margin: "5px 0 0" }}>{error.message}</p>}
            </div>

            {/* Photo */}
            <div>
              <label style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "var(--muted-color)", display: "block", marginBottom: 6, letterSpacing: "0.5px", textTransform: "uppercase" }}>Profile Photo</label>
              <input
                type="file" name="pic"
                onChange={getInputData}
                className="t-input"
                style={{ border: inputBorder(error.pic), padding: "8px 14px" }}
              />
              {show && error.pic && <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: "#ef4444", margin: "5px 0 0" }}>{error.pic}</p>}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border-color)",
            display: "flex", justifyContent: "flex-end", gap: 8,
          }}>
            <button
              type="button" onClick={onClose}
              style={{
                padding: "9px 20px", borderRadius: 999,
                border: "1px solid var(--border-color)",
                background: "transparent",
                fontFamily: "'Instrument Sans', sans-serif",
                color: "var(--text-color)", fontSize: 13, cursor: "pointer",
                transition: "background 0.18s",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "9px 22px", borderRadius: 999,
                background: "var(--primary-color)",
                fontFamily: "'Instrument Sans', sans-serif",
                color: "#fff", border: "none",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(108,99,255,0.35)",
                transition: "opacity 0.18s, transform 0.18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}