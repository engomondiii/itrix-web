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
            ? "ASTOP의 기능과 적용 가능성을 살펴보고 PoC를 신청할 수 있습니다."
            : "Explore ASTOP and request a PoC to assess it for your workload."}
        </p>
        <p style={{ color: "#F8FAFC" }}>
          {available.length
            ? ko
              ? "확인된 Store에서 구매 및 설치할 수 있습니다. 다른 플랫폼의 출시는 별도로 안내됩니다."
              : "Purchase and installation are available through the confirmed Store below. Other platforms are confirmed separately."
            : ko
              ? "다운로드 및 설치에 관한 확정된 정보는 별도로 안내됩니다. 현재 제공되는 정보만으로는 설치 파일이나 지원 운영체제의 세부 사항을 확인할 수 없습니다."
              : "Confirmed download and installation details will be published separately. A verified installer and detailed system requirements are not available in the current information."}
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
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
