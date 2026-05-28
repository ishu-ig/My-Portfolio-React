"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getResume } from "../Redux/ActionCreators/ResumeActionCreators";

/* ─────────────────────────────────────────
   DESIGN TOKENS  (override or extend your
   existing CSS vars as needed)
───────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

  :root {
    --nb-font-brand : 'Syne', sans-serif;
    --nb-font-nav   : 'Instrument Sans', sans-serif;
    --nb-font-mono  : 'DM Mono', monospace;
    --nb-accent     : #e8ff47;
    --nb-accent2    : #ff6b35;
    --nb-radius     : 100px;
    --nb-pill-h     : 56px;
  }

  /* ── Nav pill ── */
  .nb-pill {
    height: var(--nb-pill-h);
    border-radius: var(--nb-radius);
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 10px 0 18px;
    transition: box-shadow 0.35s ease, background 0.35s ease, border-color 0.35s ease;
  }
  .nb-pill.scrolled-light {
    background: rgba(255,255,255,0.82) !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset;
  }
  .nb-pill.scrolled-dark {
    background: rgba(14,14,20,0.88) !important;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset;
  }

  /* ── Brand ── */
  .nb-brand {
    font-family: var(--nb-font-brand);
    font-weight: 800;
    font-size: 17px;
    letter-spacing: -0.5px;
    text-decoration: none;
    flex-shrink: 0;
    position: relative;
    padding-right: 20px;
  }
  .nb-brand::after {
    content: '';
    position: absolute;
    right: 0; top: 50%; transform: translateY(-50%);
    width: 1px; height: 22px;
    background: currentColor;
    opacity: 0.15;
  }

  /* ── Nav links ── */
  .nb-link {
    font-family: var(--nb-font-nav) !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    letter-spacing: 0.01em;
    padding: 6px 11px !important;
    border-radius: 6px;
    text-decoration: none !important;
    position: relative;
    white-space: nowrap;
    transition: color 0.18s ease !important;
  }
  .nb-link::after {
    content: '';
    position: absolute;
    bottom: 2px; left: 11px; right: 11px;
    height: 1.5px;
    background: var(--nb-accent);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    border-radius: 2px;
  }
  .nb-link:hover::after { transform: scaleX(1); transform-origin: left; }

  /* ── Icon button ── */
  .nb-icon-btn {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: none; cursor: pointer; flex-shrink: 0;
    font-size: 15px;
    transition: background 0.2s, transform 0.15s;
  }
  .nb-icon-btn:hover { transform: scale(1.08); }

  /* ── Social link ── */
  .nb-social-a {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 50%;
    text-decoration: none; font-size: 15px;
    transition: transform 0.18s, opacity 0.18s;
    opacity: 0.6;
  }
  .nb-social-a:hover { opacity: 1; transform: translateY(-2px); }

  /* ── Mobile menu ── */
  .nb-mobile-menu {
    border-radius: 18px;
    overflow: hidden;
    animation: menuDrop 0.22s cubic-bezier(0.34,1.4,0.64,1) forwards;
  }
  @keyframes menuDrop {
    from { opacity:0; transform: translateY(-10px) scale(0.97); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }

  /* ── Chat float btn ── */
  .chat-float-btn {
    position: fixed; bottom: 24px; right: 24px;
    width: 54px; height: 54px; border-radius: 50%;
    border: none; cursor: pointer; z-index: 1050;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: #fff;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
  }
  .chat-float-btn:hover { transform: scale(1.12) rotate(8deg); }
  .chat-float-btn .pulse-ring {
    position: absolute; inset: -4px;
    border-radius: 50%;
    animation: pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite;
  }
  @keyframes pulseRing {
    0%,100% { box-shadow: 0 0 0 0 rgba(232,255,71,0.35); }
    50%      { box-shadow: 0 0 0 10px rgba(232,255,71,0); }
  }

  /* ── Scrollbar hide ── */
  .no-scroll::-webkit-scrollbar { display: none; }
  .no-scroll { scrollbar-width: none; }

  @media (max-width: 991px) {
    .nb-desktop-links { display: none !important; }
    .nb-desktop-right  { display: none !important; }
  }
  @media (min-width: 992px) {
    .nb-hamburger     { display: none !important; }
    .nb-desktop-links { display: flex !important; }
    .nb-desktop-right { display: flex !important; }
  }

  /* ── Tablet: 768–991px ── */
  @media (min-width: 768px) and (max-width: 991px) {
    #header { padding: 14px 32px 0 32px !important; }
    .nb-pill { padding: 0 16px 0 24px !important; height: 60px !important; }
    .nb-brand { font-size: 18px !important; padding-right: 24px !important; }
    .nb-icon-btn { width: 40px !important; height: 40px !important; font-size: 16px !important; }
    .nb-mobile-menu {
      padding: 16px 20px 20px 20px !important;
      margin-bottom: 14px !important;
    }
    .nb-mobile-menu-links {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 8px !important;
    }
    .nb-mobile-menu-links a { text-align: center !important; padding: 9px 10px !important; font-size: 13.5px !important; }
    .nb-mobile-socials { margin-top: 14px !important; padding-top: 14px !important; padding-bottom: 4px !important; }
    .nb-mobile-socials a { font-size: 20px !important; }
  }

  /* ── Small mobile: <480px ── */
  @media (max-width: 480px) {
    #header { padding: 10px 12px !important; }
    .nb-pill { padding: 0 8px 0 14px !important; }
    .nb-brand { font-size: 15px !important; }
  }
`;

/* ─────────────────────────────────────────
   NAVBAR
───────────────────────────────────────── */
export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showChat, setShowChat]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const dispatch = useDispatch();
  const resume   = useSelector((state) => state.ResumeStateData);
  const navigate = useNavigate();

  useEffect(() => { dispatch(getResume()); }, [dispatch]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu when resizing to desktop breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (e, item) => {
    if (item === "Home") return;
    e.preventDefault();
    const hash = `#${item.toLowerCase()}`;
    const isHome = window.location.pathname === "/" || window.location.pathname === "/index.html";
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + hash);
    }
    setMenuOpen(false);
  };

  const navItems = ["Home","About","Skills","Resume","Certificate","Portfolio","Testimonials","Services","Blog","Contact"];
  const socials  = [
    { icon: "bi-github",    url: resume?.contact?.github || "#" },
    { icon: "bi-linkedin",  url: resume?.contact?.linkedin || "#" },
    { icon: "bi-instagram", url: "https://www.instagram.com/_ishaan_12" },
  ];

  const isDark = theme === "dark";
  const pillBg = scrolled
    ? (isDark ? "rgba(14,14,20,0.88)" : "rgba(255,255,255,0.82)")
    : (isDark ? "rgba(14,14,20,0.55)" : "rgba(255,255,255,0.55)");
  const pillBorder = isDark
    ? "1px solid rgba(255,255,255,0.07)"
    : "1px solid rgba(0,0,0,0.07)";
  const textColor = isDark ? "#f0f0f0" : "#111";
  const mutedColor = isDark ? "rgba(240,240,240,0.5)" : "rgba(17,17,17,0.45)";

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <header
        id="header"
        style={{
          position: "fixed", top: 0, left: 0, right: 0,
          zIndex: 1040,
          padding: "14px 20px 0",
          pointerEvents: "none",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", pointerEvents: "auto" }}>
          {/* ── Main pill ── */}
          <div
            className={`nb-pill ${scrolled ? (isDark ? "scrolled-dark" : "scrolled-light") : ""}`}
            style={{
              background: pillBg,
              border: pillBorder,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            {/* Brand */}
            <Link to="/" className="nb-brand" style={{ color: textColor }}>
              <span style={{ color: "var(--nb-accent)" }}>✦</span> Portfolio
            </Link>

            {/* Desktop nav links */}
            <nav className="nb-desktop-links" style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden" }}>
              {navItems.map((item, i) => (
                item === "Home"
                  ? <Link key={i} to="/" className="nb-link" style={{ color: mutedColor }}>{item}</Link>
                  : <a
                      key={i}
                      href={`/#${item.toLowerCase()}`}
                      className="nb-link"
                      style={{ color: mutedColor }}
                      onClick={(e) => handleNavClick(e, item)}
                    >{item}</a>
              ))}
            </nav>

            {/* Desktop right cluster */}
            <div className="nb-desktop-right" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flexShrink: 0 }}>
              {/* Divider */}
              <span style={{ width: 1, height: 20, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", margin: "0 6px" }} />

              {socials.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer"
                   className="nb-social-a" style={{ color: textColor }}>
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}

              <span style={{ width: 1, height: 20, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", margin: "0 4px" }} />

              {/* Theme toggle */}
              <button
                className="nb-icon-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{
                  background: isDark ? "rgba(232,255,71,0.1)" : "rgba(0,0,0,0.05)",
                  color: isDark ? "var(--nb-accent)" : "#444",
                }}
              >
                <i className={`bi bi-${isDark ? "sun" : "moon-stars"}`} />
              </button>
            </div>

            {/* Mobile controls */}
            <div className="nb-hamburger" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
              <button
                className="nb-icon-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{ background: isDark ? "rgba(232,255,71,0.1)" : "rgba(0,0,0,0.05)", color: isDark ? "var(--nb-accent)" : "#444" }}
              >
                <i className={`bi bi-${isDark ? "sun" : "moon-stars"}`} />
              </button>
              <button
                className="nb-icon-btn"
                onClick={() => setMenuOpen(p => !p)}
                aria-label="Toggle menu"
                style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", color: textColor }}
              >
                <i className={`bi bi-${menuOpen ? "x-lg" : "list"}`} />
              </button>
            </div>
          </div>

          {/* ── Mobile dropdown ── */}
          {menuOpen && (
            <div
              className="nb-mobile-menu"
              style={{
                marginTop: 8,
                background: isDark ? "rgba(14,14,20,0.96)" : "rgba(255,255,255,0.97)",
                border: pillBorder,
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
                padding: "12px",
              }}
            >
              <div className="nb-mobile-menu-links" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {navItems.map((item, i) => (
                  <a
                    key={i}
                    href={item === "Home" ? "/" : `/#${item.toLowerCase()}`}
                    onClick={(e) => handleNavClick(e, item)}
                    style={{
                      fontFamily: "var(--nb-font-nav)",
                      fontSize: 13, fontWeight: 500,
                      color: mutedColor,
                      padding: "7px 14px",
                      borderRadius: 30,
                      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                      textDecoration: "none",
                      transition: "background 0.15s, color 0.15s",
                    }}
                  >{item}</a>
                ))}
              </div>

              {/* Mobile socials */}
              <div className="nb-mobile-socials" style={{ display: "flex", gap: 14, marginTop: 12, paddingTop: 12, borderTop: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.06)" }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer"
                     style={{ color: mutedColor, fontSize: 18, textDecoration: "none", opacity: 0.7 }}>
                    <i className={`bi ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Floating chat button ── */}
      <button
        className="chat-float-btn"
        onClick={() => setShowChat(p => !p)}
        aria-label={showChat ? "Close chat" : "Open assistant"}
        style={{
          background: showChat
            ? "linear-gradient(135deg, #1a1a2e, #16213e)"
            : "linear-gradient(135deg, #0f0f17, #1e1e2e)",
          boxShadow: showChat
            ? "0 8px 28px rgba(0,0,0,0.4)"
            : "0 8px 28px rgba(232,255,71,0.25), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <span className="pulse-ring" />
        <i className={`bi bi-${showChat ? "x-lg" : "stars"}`} style={{ position: "relative", zIndex: 1 }} />
      </button>

      {showChat && <ChatModal setShowChat={setShowChat} />}
    </>
  );
}

/* ─────────────────────────────────────────
   CHAT MODAL
───────────────────────────────────────── */
const ChatModal = ({ setShowChat }) => (
  <>
    <style>{`
      @keyframes chatSlideUp {
        from { opacity:0; transform: translateY(16px) scale(0.96); }
        to   { opacity:1; transform: translateY(0) scale(1); }
      }
      @keyframes dotPulse {
        0%,60%,100% { transform: scale(0.75); opacity: 0.4; }
        30%           { transform: scale(1);    opacity: 1;   }
      }
      .chat-dot-anim { display:inline-block; width:5px; height:5px; border-radius:50%; background:var(--nb-accent); margin:0 2px; animation: dotPulse 1.4s ease-in-out infinite; }
      .chat-dot-anim:nth-child(2) { animation-delay:0.2s; }
      .chat-dot-anim:nth-child(3) { animation-delay:0.4s; }

      .qchip {
        font-family: 'DM Mono', monospace;
        font-size: 11px; letter-spacing: 0.03em;
        padding: 5px 12px; border-radius: 20px;
        border: 1px solid rgba(232,255,71,0.2);
        background: rgba(232,255,71,0.06);
        color: rgba(232,255,71,0.7);
        cursor: pointer; white-space: nowrap; flex-shrink: 0;
        transition: all 0.18s ease;
      }
      .qchip:hover {
        background: rgba(232,255,71,0.14);
        color: #e8ff47;
        border-color: rgba(232,255,71,0.5);
        transform: translateY(-1px);
      }

      .chat-send-btn {
        width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer;
        background: var(--nb-accent); color: #0f0f17;
        display: flex; align-items: center; justify-content: center;
        font-size: 15px; flex-shrink: 0;
        transition: transform 0.18s, box-shadow 0.18s;
        box-shadow: 0 4px 14px rgba(232,255,71,0.3);
      }
      .chat-send-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(232,255,71,0.4); }

      .chat-input-field {
        flex: 1; background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 24px; padding: 10px 16px;
        font-family: 'Instrument Sans', sans-serif;
        font-size: 13.5px; color: #f0f0f0;
        outline: none; transition: border-color 0.2s;
      }
      .chat-input-field::placeholder { color: rgba(255,255,255,0.25); }
      .chat-input-field:focus { border-color: rgba(232,255,71,0.4); }
    `}</style>

    <div
      style={{
        position: "fixed",
        bottom: 92, right: 24,
        width: 380, maxWidth: "calc(100vw - 32px)",
        zIndex: 1049,
        fontFamily: "'Instrument Sans', sans-serif",
        animation: "chatSlideUp 0.3s cubic-bezier(0.34,1.4,0.64,1) forwards",
      }}
    >
      <div style={{
        borderRadius: 22,
        overflow: "hidden",
        background: "#0e0e14",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(232,255,71,0.04) inset",
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: "16px 18px",
          background: "linear-gradient(135deg, #131320 0%, #1a1a2e 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {/* Avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #e8ff47 0%, #b8d400 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#0f0f17",
            boxShadow: "0 0 0 3px rgba(232,255,71,0.15)",
          }}>
            <i className="bi bi-stars" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#f0f0f0", letterSpacing: "-0.2px" }}>
              Ishaan's Assistant
            </div>
            <div style={{ fontSize: 11, color: "rgba(240,240,240,0.4)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8ff47", display: "inline-block", boxShadow: "0 0 6px #e8ff47" }} />
              Online · Ask me anything
            </div>
          </div>

          <button
            onClick={() => setShowChat(false)}
            style={{
              width: 30, height: 30, borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.07)", color: "rgba(240,240,240,0.6)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.13)"; e.currentTarget.style.color = "#f0f0f0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(240,240,240,0.6)"; }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <ChatbotUI />
      </div>
    </div>
  </>
);

/* ─────────────────────────────────────────
   CHATBOT UI
───────────────────────────────────────── */
const ChatbotUI = () => {
  const dispatch = useDispatch();
  const resume   = useSelector((state) => state.ResumeStateData);

  const [messages, setMessages] = useState([{
    sender: "bot",
    text: "👋 Hi! Ask me about Ishaan's skills, projects, experience, services, certificates, or contact info.",
  }]);
  const [input, setInput]       = useState("");
  const [typing, setTyping]     = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => { dispatch(getResume()); }, [dispatch]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const getFullAbout = () => {
    const a = resume?.about;
    if (!a) return "About info not available yet.";
    return [
      `👤 About Ishaan\n${a.summary || ""}`,
      a.skills?.length      ? `⭐ Skills:\n${a.skills.map(s=>"• "+s).join("\n")}`           : "",
      a.education?.length   ? `🎓 Education:\n${a.education.map(e=>"• "+e).join("\n")}`     : "",
      a.experience?.length  ? `💼 Experience:\n${a.experience.map(e=>"• "+e).join("\n")}`   : "",
      a.projects?.length    ? `💡 Projects:\n${a.projects.map(p=>"• "+p).join("\n")}`       : "",
    ].filter(Boolean).join("\n\n");
  };

  const botReply = (q) => {
    if (!resume) return "⏳ Loading data, please try again in a moment.";
    const nq = q.toLowerCase().trim();

    if (nq.includes("about")) return getFullAbout();
    if (nq.includes("contact")) {
      const c = resume.contact;
      if (!c) return "📞 Contact info not available.";
      return `📬 Contact Ishaan\n📧 ${c.email||"N/A"}\n🐙 GitHub: ${c.github||"N/A"}\n💼 LinkedIn: ${c.linkedin||"N/A"}`;
    }

    const skill = resume.skills?.find(s => nq.includes(s.name.toLowerCase()));
    if (skill)   { setActiveItem({ type:"skill", data:skill }); return `🧠 ${skill.name}\n${skill.description}\n⭐ Proficiency: ${skill.level}%`; }
    if (activeItem?.type==="skill") {
      if (nq.includes("level"))       return `⭐ Level: ${activeItem.data.level}%`;
      if (nq.includes("description")) return activeItem.data.description;
    }

    const project = resume.projects?.find(p => nq.includes(p.name.toLowerCase()));
    if (project) { setActiveItem({ type:"project", data:project }); return `💡 ${project.name}\n${project.shortDescription}\n\nAsk: technology · category · live · github`; }
    if (activeItem?.type==="project") {
      const p = activeItem.data;
      if (nq.includes("tech"))     return `🛠 Tech: ${p.tech}`;
      if (nq.includes("category")) return `📂 Category: ${p.category}`;
      if (nq.includes("live"))     return p.liveUrl     ? `🌐 ${p.liveUrl}`     : "Live URL not set.";
      if (nq.includes("github"))   return p.githubRepo  ? `🐙 ${p.githubRepo}`  : "GitHub not set.";
    }

    const service = resume.services?.find(s => nq.includes(s.name.toLowerCase()));
    if (service) { setActiveItem({ type:"service", data:service }); return `🛠️ ${service.name}\n${service.shortDescription}\n\nAsk: price · duration · technology · details`; }
    if (activeItem?.type==="service") {
      const s = activeItem.data;
      if (nq.includes("price"))    return `💰 Starting at ₹${s.price}`;
      if (nq.includes("duration")) return `⏳ Delivery: ${s.duration} days`;
      if (nq.includes("tech"))     return `🛠 Tech: ${s.technology}`;
      if (nq.includes("detail"))   return s.longDescription?.replace(/<\/?[^>]+>/g, "") || "No details.";
    }

    if (nq.includes("skills"))      return resume.skills?.map(s=>`• ${s.name}  ${s.level}%`).join("\n")       || "No skills found.";
    if (nq.includes("projects"))    return resume.projects?.map(p=>`💡 ${p.name}\n   ${p.shortDescription}`).join("\n\n") || "No projects.";
    if (nq.includes("services"))    return resume.services?.map(s=>`🛠️ ${s.name}\n   ${s.shortDescription}`).join("\n\n") || "No services.";
    if (nq.includes("experience"))  return resume.experience?.map(e=>`💼 ${e.jobTitle} @ ${e.companyName}`).join("\n")   || "No experience.";
    if (nq.includes("certificate")) return resume.certificates?.map(c=>`📜 ${c.name} — ${c.issuedBy}`).join("\n")       || "No certificates.";

    return "🤖 Try asking about:\nskills · projects · services · experience · certificates · contact · about";
  };

  const sendMessage = (msg = null) => {
    const final = (msg || input).trim();
    if (!final) return;
    setMessages(prev => [...prev, { sender:"user", text:final }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender:"bot", text: botReply(final) }]);
      setTyping(false);
    }, 700);
  };

  const quickActions = ["About","Skills","Projects","Services","Experience","Certificates","Contact"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:460, background:"#0e0e14" }}>

      {/* ── Messages ── */}
      <div
        className="no-scroll"
        style={{ flex:1, overflowY:"auto", padding:"16px 14px", display:"flex", flexDirection:"column", gap:12 }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display:"flex",
              justifyContent: msg.sender==="user" ? "flex-end" : "flex-start",
              alignItems:"flex-end", gap:8,
            }}
          >
            {msg.sender==="bot" && (
              <div style={{
                width:28, height:28, borderRadius:"50%", flexShrink:0,
                background:"linear-gradient(135deg,#e8ff47,#b8d400)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, color:"#0f0f17",
              }}>
                <i className="bi bi-stars" />
              </div>
            )}
            <div style={{
              maxWidth:"74%",
              padding:"10px 14px",
              borderRadius: msg.sender==="user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.sender==="user"
                ? "linear-gradient(135deg, #e8ff47 0%, #c8df2a 100%)"
                : "rgba(255,255,255,0.05)",
              color: msg.sender==="user" ? "#0f0f17" : "rgba(240,240,240,0.9)",
              fontSize:"13.5px", lineHeight:1.6, fontWeight: msg.sender==="user" ? 600 : 400,
              whiteSpace:"pre-line",
              border: msg.sender==="bot" ? "1px solid rgba(255,255,255,0.07)" : "none",
              boxShadow: msg.sender==="user"
                ? "0 4px 14px rgba(232,255,71,0.25)"
                : "0 2px 8px rgba(0,0,0,0.2)",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <div style={{
              width:28, height:28, borderRadius:"50%",
              background:"linear-gradient(135deg,#e8ff47,#b8d400)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, color:"#0f0f17",
            }}>
              <i className="bi bi-stars" />
            </div>
            <div style={{
              padding:"12px 16px", borderRadius:"18px 18px 18px 4px",
              background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.07)",
              display:"flex", alignItems:"center",
            }}>
              <span className="chat-dot-anim" />
              <span className="chat-dot-anim" />
              <span className="chat-dot-anim" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Quick action chips ── */}
      <div
        className="no-scroll"
        style={{
          display:"flex", gap:6, padding:"10px 14px",
          overflowX:"auto",
          background:"rgba(255,255,255,0.02)",
          borderTop:"1px solid rgba(255,255,255,0.05)",
        }}
      >
        {quickActions.map((label, i) => (
          <button key={i} className="qchip" onClick={() => sendMessage(label.toLowerCase())}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding:"10px 14px 14px",
        background:"rgba(255,255,255,0.02)",
        borderTop:"1px solid rgba(255,255,255,0.05)",
        display:"flex", gap:8, alignItems:"center",
      }}>
        <input
          type="text"
          className="chat-input-field"
          placeholder="Ask me anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && sendMessage()}
        />
        <button className="chat-send-btn" onClick={() => sendMessage()} aria-label="Send">
          <i className="bi bi-arrow-up" />
        </button>
      </div>
    </div>
  );
};