"use client";
import { useEffect, useRef, useState } from "react";
const day = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
export default function LaunchNotice({ language }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const ko = language === "ko";
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setOpen(localStorage.getItem("itrixNoticeHide") !== day());
      } catch {
        setOpen(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const first = dialog.current?.querySelector("a,button");
    first?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const items = dialog.current?.querySelectorAll("a,button");
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open]);
  function close(today) {
    if (today)
      try {
        localStorage.setItem("itrixNoticeHide", day());
      } catch {}
    setOpen(false);
  }
  if (!open) return null;
  return (
    <div
      ref={dialog}
      className="r3nt-wrap"
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-notice-title"
    >
      <style>
        {
          ".r3nt-wrap{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-start;justify-content:center;padding:96px 20px 20px;overflow-y:auto;background:rgba(2,4,6,0.66);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}\n.r3nt-card{width:min(560px,100%);display:flex;flex-direction:column;border-radius:24px;overflow:hidden;border:1px solid rgba(214,230,255,0.28);background:#0B1118;box-shadow:0 40px 100px rgba(0,0,0,0.6);}\n.r3nt-head{display:flex;flex-direction:column;gap:14px;padding:32px 28px 24px;background:radial-gradient(80% 120% at 100% 0%, rgba(120,160,175,0.22) 0%, rgba(11,17,24,0) 70%);}\n.r3nt-k{font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.14em;color:#D6E6FF;}\n.r3nt-title{margin:0;font-size:26px;font-weight:700;line-height:1.3;color:#F8FAFC;}\n.r3nt-badges{display:flex;flex-wrap:wrap;gap:8px;}\n.r3nt-badge{display:inline-flex;align-items:center;height:28px;padding:0 12px;border-radius:999px;border:1px solid rgba(214,230,255,0.4);background:rgba(214,230,255,0.08);font-size:13px;font-weight:500;color:#D6E6FF;}\n.r3nt-q{margin:0;font-size:17px;font-weight:500;line-height:1.6;color:#E2E8F0;}\n.r3nt-q em{font-style:normal;color:#F8FAFC;}\n.r3nt-body{display:flex;flex-direction:column;gap:20px;padding:0 28px 26px;}\n.r3nt-stat{display:flex;align-items:center;gap:18px;padding:18px 20px;border-radius:16px;border:1px solid rgba(214,230,255,0.18);background:rgba(214,230,255,0.04);}\n.r3nt-num{flex-shrink:0;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:44px;font-weight:700;line-height:1;color:#F8FAFC;}\n.r3nt-num small{font-size:24px;}\n.r3nt-stat p{margin:0;font-size:15px;line-height:1.6;color:#CBD5E1;}\n.r3nt-stat p b{color:#F8FAFC;font-weight:700;}\n.r3nt-note{font-size:12px;color:#94A3B8;}\n.r3nt-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;}\n.r3nt-btn{height:52px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;font-size:15px;font-weight:700;text-decoration:none;transition:background .2s,box-shadow .2s,border-color .2s;}\n.r3nt-btn.sub{border:1px solid rgba(214,230,255,0.5);color:#F8FAFC;background:rgba(2,4,6,0.4);}\n.r3nt-btn.sub:hover{border-color:#D6E6FF;box-shadow:0 0 0 4px rgba(214,230,255,0.15);}\n.r3nt-btn.pri{background:#F8FAFC;color:#0B1118;}\n.r3nt-btn.pri:hover{background:#D6E6FF;}\n.r3nt-btn:focus-visible,.r3nt-foot button:focus-visible{outline:2px solid #D6E6FF;outline-offset:3px;}\n.r3nt-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 28px;border-top:1px solid rgba(214,230,255,0.12);background:rgba(214,230,255,0.03);}\n.r3nt-foot button{background:none;border:none;color:#94A3B8;font-family:'Noto Sans KR',sans-serif;font-size:14px;cursor:pointer;padding:6px 0;}\n.r3nt-foot button:hover{color:#F8FAFC;}\n@media (max-width:520px){\n  .r3nt-wrap{padding:16px 12px;}\n  .r3nt-head{padding:26px 22px 20px;} .r3nt-body{padding:0 22px 22px;} .r3nt-foot{padding:12px 22px;}\n  .r3nt-title{font-size:22px;} .r3nt-q{font-size:16px;}\n  .r3nt-btns{grid-template-columns:1fr;}\n  .r3nt-btn.pri{order:-1;}\n}\n"
        }
      </style>
      <div className="r3nt-card">
        <div className="r3nt-head">
          <span className="r3nt-k">
            {ko
              ? "공고 · ASTOP 공개 실증"
              : "ANNOUNCEMENT · ASTOP PUBLIC VALIDATION"}
          </span>
          <h2 className="r3nt-title" id="launch-notice-title">
            {ko
              ? "ASTOP 공개 실증 참여기업 모집"
              : "Now recruiting ASTOP public validation partners"}
          </h2>
          <div className="r3nt-badges">
            <span className="r3nt-badge">
              {ko ? "5곳 모집" : "5 companies"}
            </span>
            <span className="r3nt-badge">
              {ko ? "3개월 무상" : "3 months free"}
            </span>
          </div>
          <p className="r3nt-q">
            {ko
              ? "새 정보 없이 AI만 다시 부르는 ‘빈손 호출’, 토큰값이 얼마나 새고 있을까요?"
              : "How many tokens are leaking through ‘empty-handed calls’ that re-invoke AI without new information?"}
          </p>
        </div>
        <div className="r3nt-body">
          <div className="r3nt-stat">
            <span className="r3nt-num">
              78<small>%</small>
            </span>
            <p>
              {ko
                ? "자체 실험 기준 AI 사용료 최대 78% 절감 — 우리 회사 업무 1개로 직접 확인해 보세요."
                : "Up to 78% lower AI usage costs in our internal tests — see it for yourself with one of your own workflows."}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                gap: "6px 12px",
                padding: "14px 18px",
                borderRadius: 14,
                border: "1px solid rgba(214,230,255,0.28)",
                background: "rgba(214,230,255,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono','Noto Sans KR',monospace",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  color: "#94A3B8",
                }}
              >
                {ko ? "신청 기간" : "Applications"}
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: 1.5,
                  color: "#F8FAFC",
                }}
              >
                {ko
                  ? "2026년 11월 2일(월) ~ 11월 13일(금)"
                  : "November 2 (Mon) – November 13 (Fri), 2026"}
              </span>
            </div>
            <span
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: "#94A3B8",
                paddingLeft: 2,
              }}
            >
              {ko
                ? "* 이메일로 11월 17일(화)에 개별 통지 드리겠습니다."
                : "* We will notify each applicant by email on November 17 (Tue)."}
            </span>
          </div>
          <div className="r3nt-btns">
            <a
              className="r3nt-btn sub"
              href="#astop"
              onClick={() => close(false)}
            >
              {ko ? "실증 프로그램 자세히 보기" : "Learn about the program"}
            </a>
            <a
              className="r3nt-btn pri"
              href="https://forms.gle/FoGcs7LHhoTbmhtf8"
              target="_blank"
              rel="noopener"
            >
              {ko ? "참여 신청하기" : "Apply now"} ↗
            </a>
          </div>
        </div>
        <div className="r3nt-foot">
          <button onClick={() => close(true)}>
            {ko ? "오늘 하루 보지 않기" : "Don’t show today"}
          </button>
          <button onClick={() => close(false)}>
            {ko ? "닫기 ✕" : "Close ✕"}
          </button>
        </div>
      </div>
    </div>
  );
}
