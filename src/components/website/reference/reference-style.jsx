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
  const href = "/ask-x?lang=" + language;
  return (
    <div style={{ padding: "48px 24px", textAlign: "center", borderBlock: "1px solid #334155", background: "#0B1118" }}>
      <a href={href} style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "16px 28px", borderRadius: 12, background: "#F8FAFC", color: "#0B1118", fontSize: 20, fontWeight: 600 }}>
        {language === "ko" ? "Ask itriX 대화 시작" : "Open Ask itriX"} <span aria-hidden="true">→</span>
      </a>
      <p style={{ margin: "16px 0 0", color: "#CBD5E1" }}>
        {language === "ko" ? "전체 화면에서 itriX와 대화하세요." : "A full-page workspace for your conversation with itriX."}
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
export { default as NoticePopup } from "../LaunchNotice";
