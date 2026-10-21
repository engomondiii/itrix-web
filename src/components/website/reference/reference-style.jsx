"use client";
import React, { useEffect, useRef, useState } from "react";

export function css(text) {
  const result = {};
  for (const declaration of String(text || "").split(/;(?![^()]*\))/)) {
    const colon = declaration.indexOf(":");
    if (colon < 0) continue;
    let key = declaration.slice(0, colon).trim();
    if (!key) continue;
    key = key.startsWith("--")
      ? key
      : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    result[key] = declaration
      .slice(colon + 1)
      .trim()
      .replace(/\s*!important$/, "");
  }
  return result;
}
export async function website(path, data) {
  const response = await fetch("/api/website/" + path, {
    method: data ? "POST" : "GET",
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  const value = await response.json();
  if (!response.ok)
    throw new Error(
      typeof value.detail === "string" ? value.detail : JSON.stringify(value),
    );
  return value;
}
export function AskX({ language }) {
  const [failed, setFailed] = useState(false);
  const [topic, setTopic] = useState("");
  const panel = useRef(null);
  useEffect(() => {
    const syncTopic = () =>
      setTopic(
        new URLSearchParams(location.search).get("topic") === "astop"
          ? "&topic=astop"
          : "",
      );
    const topicTimer = setTimeout(syncTopic, 0);
    const readyTimer = setTimeout(() => setFailed(true), 20000);
    const observer = new IntersectionObserver(entries => { if (window.matchMedia('(max-width:820px)').matches && entries.some(e => e.isIntersecting && e.intersectionRatio >= .35)) { panel.current?.classList.add('axc-in'); observer.disconnect(); } }, {threshold:[.35]});
    if (panel.current) observer.observe(panel.current);
    const onMessage = (e) => {
      if (e.origin === location.origin && e.source === panel.current?.querySelector('iframe')?.contentWindow && e.data?.type === 'itrix-chat-ready') { clearTimeout(readyTimer); setFailed(false); }
    };
    window.addEventListener("message", onMessage);
    return () => {
      clearTimeout(topicTimer); clearTimeout(readyTimer); observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, []);
  const prefix = language === "en" ? "/en" : "";
  return (
    <div ref={panel} className="axc"
      style={{ position:"relative",
        border: "1px solid #D6E6FF",
        borderRadius: 28,
        overflow: "hidden",
        background: "#F8FAFC",
      }}
    >
      <div className="axc-ring"/><div className="axc-skin"/>
      {!failed && (
        <iframe
          title={
            language === "ko" ? "Ask X AI 상담" : "Ask X AI sales assistant"
          }
          src={"/ask-x?lang=" + language + topic}
          style={{
            width: "100%",
            height: "min(760px, 85dvh)",
            minHeight: 520,
            border: 0,
            display: "block",
          }}
          onError={() => setFailed(true)}
        />
      )}
      <p style={{ padding: 16, margin: 0, color: "#1F2937", fontSize: 14 }}>
        {failed
          ? language === "ko"
            ? "현재 상담을 연결할 수 없습니다. "
            : "Chat is currently unavailable. "
          : language === "ko"
            ? "추가 도움이 필요하세요? "
            : "Need more help? "}
        <a
          style={{ color: "#1F2937", textDecoration: "underline" }}
          href={prefix + "/contact"}
        >
          {language === "ko" ? "문의" : "Contact"}
        </a>
        {" · "}
        <a
          style={{ color: "#1F2937", textDecoration: "underline" }}
          href={prefix + "/poc"}
        >
          {language === "ko" ? "PoC 신청" : "Request a PoC"}
        </a>
      </p>
    </div>
  );
}
export function Captcha({ onToken, language }) {
  const element = useRef(null);
  const callback = useRef(onToken);
  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);
  const [error, setError] = useState("");
  useEffect(() => {
    let dead = false,
      widget;
    const start = async () => {
      const config = await website("config");
      if (!config.captcha_site_key) throw new Error("unavailable");
      if (!window.turnstile)
        await new Promise((resolve, reject) => {
          const existing = document.querySelector("script[data-turnstile]");
          if (existing) {
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", reject, { once: true });
            return;
          }
          const script = document.createElement("script");
          script.dataset.turnstile = "true";
          script.src =
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      if (dead || !element.current) return;
      widget = window.turnstile.render(element.current, {
        sitekey: config.captcha_site_key,
        action: "website_intake",
        language,
        callback: (token) => callback.current(token),
        "expired-callback": () => callback.current(""),
        "error-callback": () => callback.current(""),
      });
    };
    const reset = () => {
      if (widget !== undefined) window.turnstile?.reset(widget);
      callback.current("");
    };
    window.addEventListener("itrix-captcha-reset", reset);
    start().catch(
      () =>
        !dead &&
        setError(
          language === "ko"
            ? "스팸 방지가 준비 중입니다. admin@itrix.co.kr로 문의하세요."
            : "Spam protection is not available. Contact admin@itrix.co.kr.",
        ),
    );
    return () => {
      window.removeEventListener("itrix-captcha-reset", reset);
      dead = true;
      if (widget !== undefined) window.turnstile?.remove(widget);
    };
  }, [language]);
  return (
    <div>
      <div ref={element} />
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export function NoticePopup({ language }) {
  const [notice, setNotice] = useState(null);
  const kst = () =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  useEffect(() => {
    let hidden = false;
    try {
      hidden = localStorage.getItem("itrixNoticeHide") === kst();
    } catch {}
    if (!hidden)
      website("config")
        .then((c) => setNotice(c.notice?.[language] || null))
        .catch(() => {});
  }, [language]);
  if (!notice) return null;
  function close(today) {
    try {
      if (today) localStorage.setItem("itrixNoticeHide", kst());
    } catch {}
    setNotice(null);
  }
  return (
    <div
      className="nt-wrap"
      role="dialog"
      aria-modal="true"
      aria-label={notice.title}
    >
      <div
        className="nt-card"
        style={{ padding: 28, color: "#F8FAFC", maxWidth: 620 }}
      >
        <p>{notice.label}</p>
        <h2>{notice.title}</h2>
        <p>{notice.intro}</p>
        <dl>
          {notice.rows.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 20, padding: 10 }}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <a
          href={notice.link}
          style={{
            display: "inline-block",
            padding: 14,
            background: "#F8FAFC",
            color: "#1F2937",
            borderRadius: 30,
          }}
        >
          {notice.button}
        </a>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 20,
          }}
        >
          <button onClick={() => close(true)}>
            {language === "ko"
              ? "오늘 하루 보지 않기"
              : "Don’t show again today"}
          </button>
          <button onClick={() => close(false)}>
            {language === "ko" ? "닫기" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
