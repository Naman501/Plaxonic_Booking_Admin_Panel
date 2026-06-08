"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!employeeId || !password) { toast.error("Please fill in all fields"); return; }
    try {
      setLoading(true);
      await api.post("/auth/login", { employeeId, password });
      toast.success("Access granted");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Access denied");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .alog-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          background: #F4F7FF;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .alog-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }

        /* Left panel */
        .alog-left {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          overflow: hidden;
        }

        .alog-left-bg {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, #1A3A8F 0%, #1D4ED8 50%, #2563EB 100%);
        }

        /* Animated orb */
        .alog-orb {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: orbPulse 4s ease-in-out infinite;
        }

        @keyframes orbPulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%,-50%) scale(1.1); opacity: 0.7; }
        }

        .alog-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
        }

        .alog-left-content { position: relative; z-index: 1; }

        .alog-brand {
          display: flex; align-items: center; gap: 10px;
        }

        .alog-brand-icon {
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.2);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .alog-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #ffffff;
        }

        .alog-brand-name span { color: rgba(255,255,255,0.7); }

        .alog-left-mid { position: relative; z-index: 1; }

        .alog-left-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 0.5px solid rgba(255,255,255,0.25);
          color: #ffffff;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 20px;
          margin-bottom: 1.25rem;
        }

        .alog-left-h {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 1rem;
        }

        .alog-left-h em { font-style: italic; color: rgba(255,255,255,0.75); }

        .alog-left-p {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          font-weight: 300;
          line-height: 1.7;
          max-width: 300px;
        }

        .alog-left-bottom {
          position: relative; z-index: 1;
          display: flex; gap: 2.5rem;
        }

        .alog-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 22px; color: #ffffff; line-height: 1;
        }
        .alog-stat-label { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 3px; }

        /* Right panel */
        .alog-right {
          width: 480px;
          background: #ffffff;
          border-left: 0.5px solid rgba(10,14,26,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          position: relative;
          z-index: 1;
        }

        .alog-form { width: 100%; max-width: 360px; }

        .alog-form-header { margin-bottom: 2.25rem; }

        .alog-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 400;
          color: #060912;
          margin-bottom: 6px;
        }

        .alog-form-sub {
          font-size: 13px;
          color: rgba(10,14,26,0.42);
          font-weight: 300;
        }

        .alog-field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(10,14,26,0.45);
          margin-bottom: 7px;
        }

        .alog-field-wrap {
          border: 0.5px solid rgba(10,14,26,0.14);
          border-radius: 10px;
          background: #F4F7FF;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          height: 50px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .alog-field-wrap:focus-within {
          border-color: rgba(37,99,235,0.6);
          box-shadow: 0 0 0 3px rgba(37,99,235,0.08);
          background: #ffffff;
        }

        .alog-field-wrap input {
          border: none;
          background: transparent;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          color: #0A0E1A;
          width: 100%;
          outline: none;
        }

        .alog-field-wrap input::placeholder { color: rgba(10,14,26,0.28); }

        .alog-toggle-pw {
          background: none; border: none; cursor: pointer;
          color: rgba(10,14,26,0.3); display: flex;
          transition: color 0.2s;
        }
        .alog-toggle-pw:hover { color: #2563EB; }

        .alog-submit {
          width: 100%;
          height: 50px;
          background: linear-gradient(135deg, #2563EB, #1D4ED8);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 8px;
          letter-spacing: 0.02em;
        }
        .alog-submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37,99,235,0.3);
        }
        .alog-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .alog-divider {
          height: 0.5px;
          background: rgba(10,14,26,0.08);
          margin: 1.5rem 0;
        }

        .alog-back {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(10,14,26,0.35);
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'Outfit', sans-serif;
          width: 100%;
          transition: color 0.2s;
        }
        .alog-back:hover { color: #2563EB; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        @media (max-width: 768px) {
          .alog-left { display: none; }
          .alog-right { width: 100%; background: #F4F7FF; border: none; }
        }
      `}</style>

      <div className="alog-root">

        {/* ── LEFT ── */}
        <div className="alog-left">
          <div className="alog-left-bg" />
          <div className="alog-orb" />
          <div className="alog-grid" />

          <div className="alog-left-content alog-brand">
            <span className="alog-brand-name">Plaxonic<span> Technologies</span></span>
          </div>

          <div className="alog-left-mid">
            <div className="alog-left-tag">◆ Admin Console</div>
            <h2 className="alog-left-h">
              Room Booking<br />
              <em>Admin Console</em>
            </h2>
            <p className="alog-left-p">
              Approve requests, manage rooms, and oversee all property
              operations from a single, powerful interface.
            </p>
          </div>

          <div className="alog-left-bottom">
            {[["'", "^"], ["`", "/"], [".", ";"]].map(([v, l]) => (
              <div key={l}>
                <div className="alog-stat-val">{v}</div>
                <div className="alog-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="alog-right">
          <motion.div
            className="alog-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="alog-form-header">
              <h1 className="alog-form-title">Admin sign in</h1>
              <p className="alog-form-sub">Restricted access — authorised personnel only.</p>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="alog-field-label">Admin EmployeeId</label>
              <div className="alog-field-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(10,14,26,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="text"
                  placeholder="EMPLOYEE ID"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <label className="alog-field-label" style={{ margin: 0 }}>Password</label>
              </div>
              <div className="alog-field-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(10,14,26,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  autoComplete="current-password"
                />
                <button className="alog-toggle-pw" onClick={() => setShowPw(!showPw)} type="button">
                  {showPw ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button className="alog-submit" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <>
                  <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                  </svg>
                  Verifying…
                </>
              ) : (
                <>
                  Access Dashboard
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            <div className="alog-divider" />

            <button className="alog-back" onClick={() => router.push("/")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to landing page
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}