"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLanding() {
  const router = useRouter();


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .al-root {
          font-family: 'Outfit', sans-serif;
          background: #F4F7FF;
          color: #0A0E1A;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Noise texture overlay ── */
        .al-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* ── Nav ── */
        .al-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 1.25rem 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(244,247,255,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 0.5px solid rgba(10,14,26,0.08);
        }

        .al-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .al-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }

        .al-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          color: #0A0E1A;
          letter-spacing: 0.03em;
        }

        .al-logo-text span { color: #2563EB; }

        .al-nav-cta {
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 9px 22px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.03em;
          transition: opacity 0.2s, transform 0.15s;
        }
        .al-nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── Hero ── */
        .al-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 8rem 2rem 4rem;
          overflow: hidden;
        }

        /* Radial glow */
        .al-hero::after {
          content: '';
          position: absolute;
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        /* Grid lines */
        .al-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }

        .al-hero-inner { position: relative; z-index: 1; max-width: 760px; }

        .al-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(37,99,235,0.08);
          border: 0.5px solid rgba(37,99,235,0.28);
          color: #1D4ED8;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 1.75rem;
        }

        .al-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 7vw, 78px);
          font-weight: 700;
          line-height: 1.05;
          color: #060912;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .al-h1 em {
          font-style: italic;
          color: #2563EB;
        }

        .al-sub {
          font-size: 17px;
          font-weight: 300;
          color: rgba(10,14,26,0.52);
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto 2.5rem;
        }

        .al-hero-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .al-btn-primary {
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 14px 32px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }
        .al-btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.3);
        }

        .al-btn-ghost {
          background: rgba(10,14,26,0.05);
          color: #0A0E1A;
          border: 0.5px solid rgba(10,14,26,0.15);
          border-radius: 10px;
          padding: 14px 32px;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 400;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .al-btn-ghost:hover {
          background: rgba(10,14,26,0.09);
          border-color: rgba(37,99,235,0.4);
          transform: translateY(-2px);
        }

        /* ── Stats bar ── */
        .al-stats {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          gap: 4rem;
          padding: 2.5rem 2rem;
          border-top: 0.5px solid rgba(10,14,26,0.08);
          border-bottom: 0.5px solid rgba(10,14,26,0.08);
          background: rgba(255,255,255,0.6);
        }

        .al-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #2563EB;
          line-height: 1;
          margin-bottom: 4px;
        }

        .al-stat-label {
          font-size: 12px;
          color: rgba(10,14,26,0.42);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── Features ── */
        .al-features {
          position: relative;
          z-index: 1;
          padding: 6rem 4rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .al-section-label {
          text-align: center;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #2563EB;
          margin-bottom: 1rem;
        }

        .al-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 400;
          text-align: center;
          color: #060912;
          margin-bottom: 3.5rem;
          line-height: 1.2;
        }

        .al-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .al-feature-card {
          background: rgba(255,255,255,0.8);
          border: 0.5px solid rgba(10,14,26,0.09);
          border-radius: 16px;
          padding: 2rem;
          transition: border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .al-feature-card:hover {
          border-color: rgba(37,99,235,0.3);
          background: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(37,99,235,0.08);
        }

        .al-feature-icon {
          font-size: 28px;
          margin-bottom: 1rem;
          display: block;
        }

        .al-feature-title {
          font-size: 16px;
          font-weight: 500;
          color: #060912;
          margin-bottom: 8px;
        }

        .al-feature-desc {
          font-size: 13.5px;
          color: rgba(10,14,26,0.48);
          line-height: 1.65;
          font-weight: 300;
        }

        /* ── CTA section ── */
        .al-cta {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 5rem 2rem 6rem;
          border-top: 0.5px solid rgba(10,14,26,0.08);
        }

        .al-cta-box {
          max-width: 560px;
          margin: 0 auto;
          background: #ffffff;
          border: 0.5px solid rgba(37,99,235,0.2);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          box-shadow: 0 4px 40px rgba(37,99,235,0.07);
        }

        .al-cta h2 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 400;
          color: #060912;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .al-cta p {
          font-size: 14px;
          color: rgba(10,14,26,0.5);
          margin-bottom: 2rem;
          font-weight: 300;
          line-height: 1.7;
        }

        /* ── Footer ── */
        .al-footer {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 1.5rem;
          border-top: 0.5px solid rgba(10,14,26,0.07);
          font-size: 12px;
          color: rgba(10,14,26,0.28);
        }

        @media (max-width: 768px) {
          .al-nav { padding: 1rem 1.5rem; }
          .al-features { padding: 4rem 1.5rem; }
          .al-features-grid { grid-template-columns: 1fr; }
          .al-stats { gap: 2rem; flex-wrap: wrap; }
        }
      `}</style>

      <div className="al-root">
        {/* ── NAV ── */}
        <nav className="al-nav">
          <div className="al-logo">
            
            <span className="al-logo-text">Plaxonic<span> Technologies</span></span>
          </div>
          <button className="al-nav-cta" onClick={() => router.push("/admin/login")}>
            Admin Login
          </button>
        </nav>

        {/* ── HERO ── */}
        <section className="al-hero">
          <div className="al-grid-bg" />
          <div className="al-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="al-eyebrow">
                <span>◆</span> ADMIN PANEL
              </div>
              <h1 className="al-h1">
                Control all<br />
                <em>the bookings</em><br />
                from one place.
              </h1>
              <p className="al-sub">
                A powerful admin console for approving bookings, managing rooms,
                and keeping your property running at full efficiency.
              </p>
              <div className="al-hero-btns">
                <button className="al-btn-primary" onClick={() => router.push("/admin/login")}>
                  Enter Admin Panel
                  
                </button>
                <button className="al-btn-ghost" onClick={() => router.push("/")}>
                  Employee Portal
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}