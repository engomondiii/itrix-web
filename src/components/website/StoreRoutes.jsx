"use client";
import React, { useEffect, useState } from "react";
import { website } from "./reference/reference-style";
export function StoreRoutes({ language = "ko" }) {
  const [policy, setPolicy] = useState(null);
  const ko = language === "ko",
    prefix = ko ? "" : "/en";
  useEffect(() => {
    website("config")
      .then((c) => setPolicy(c.store))
      .catch(() => {});
  }, []);
  const available = (policy?.stores || []).filter((s) => s.available && s.url);
  return (
    <section
      style={{
        padding: "64px clamp(20px,6vw,80px)",
        background: "#080D10",
        color: "#F8FAFC",
        borderTop: "1px solid rgba(214,230,255,.14)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "auto", display: "grid", gap: 24 }}>
        <h2
          style={{
            fontFamily: "'Saira Condensed','Noto Sans KR',sans-serif",
            fontSize: 42,
            color: "#F8FAFC",
          }}
        >
          {ko ? "ASTOP 출시 안내" : "ASTOP availability"}
        </h2>
        <p style={{ color: "#F8FAFC" }}>
          {ko
            ? "ASTOP의 기능과 적용 가능성을 살펴보세요."
            : "Explore ASTOP and its suitability for your workload."}
        </p>
        <p style={{ color: "#F8FAFC" }}>
          {ko
            ? "아래 링크에서 ASTOP 설치 파일을 다운로드하세요. 설치 후에는 앱 내에서 업데이트할 수 있습니다."
            : "Download the ASTOP installer using the link below. Once installed, ASTOP can be updated from within the app."}
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a
            href={prefix + "/astop/download"}
            style={{ padding: "14px 24px", borderRadius: 30, background: "#F8FAFC", color: "#1F2937" }}
          >
            {ko ? "ASTOP 다운로드 ↗" : "Download ASTOP ↗"}
          </a>
          {available.map((store) => (
            <a
              key={store.store}
              href={store.url}
              rel="noopener noreferrer"
              style={{
                padding: "14px 24px",
                borderRadius: 30,
                background: "#F8FAFC",
                color: "#1F2937",
              }}
            >
              {store.store === "apple" ? "Apple App Store" : "Microsoft Store"}{" "}
              ↗
            </a>
          ))}
          <a
            href={prefix + "/partnership"}
            style={{
              padding: "14px 24px",
              border: "1px solid #D6E6FF",
              borderRadius: 30,
            }}
          >
            {ko ? "파트너십 문의 →" : "Partnership inquiry →"}
          </a>
        </div>
      </div>
    </section>
  );
}
