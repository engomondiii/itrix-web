"use client";
// Converted from the supplied October 16 design; production state is supplied separately.
import React from "react";
import { css, AskX, NoticePopup, Captcha } from "./reference-style";
export function Template(values) {
  const { reload } = values;
  return (
    <>
      <style>
        {
          "\nhtml,body{margin:0;padding:0;background:#020406;-webkit-font-smoothing:antialiased;word-break:keep-all;}\n*{box-sizing:border-box;}\na{color:#F8FAFC;text-decoration:none;}\n.jr-btn{height:56px;display:inline-flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:#F8FAFC;color:#1F2937 !important;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:18px;font-weight:600;cursor:pointer;border:none;transition:box-shadow .2s ease;}\n.jr-btn:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.5);}\n.jr-ghost{height:56px;display:inline-flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:rgba(2,4,6,0.4);border:1px solid rgba(214,230,255,0.5);color:#F8FAFC;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:18px;font-weight:500;}\n.jr-ghost:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.2);}\n.navlang{display:inline-flex;padding:3px;border-radius:10px;border:1px solid rgba(214,230,255,0.28);background:rgba(2,4,6,0.5);gap:2px;}\n.navlang a{height:30px;min-width:38px;display:inline-flex;align-items:center;justify-content:center;padding:0 10px;border-radius:7px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.06em;color:#94A3B8 !important;}\n.navlang a:hover{color:#F8FAFC !important;}\n.navlang a.on{background:#F8FAFC;color:#0B1118 !important;font-weight:500;}\n"
        }
      </style>
      {"\n"}
      <div
        lang={"ko"}
        style={css(
          "min-height:100vh;display:flex;flex-direction:column;background:radial-gradient(50% 60% at 50% 30%, rgba(120,160,175,0.16) 0%, rgba(2,4,6,0) 70%), #020406;color:#F8FAFC;font-family:'Noto Sans KR',sans-serif;",
        )}
      >
        {"\n  "}
        <div
          style={css(
            "display:flex;justify-content:space-between;align-items:center;padding:22px clamp(20px,5vw,48px);border-bottom:1px solid rgba(214,230,255,0.1);",
          )}
        >
          <a href={"/"}>
            <img
              src={"/brand/fa5afd04db046644e14564cf63d6de02.png"}
              alt={"itriX"}
              style={css(
                "width:120px;height:auto;display:block;filter:invert(1);",
              )}
            />
          </a>
          <span className={"navlang"} role={"group"} aria-label={"Language"}>
            <a className={"on"} href={"/maintenance"} lang={"ko"}>
              {"KO"}
            </a>
            <a className={""} href={"/en/maintenance"} lang={"en"}>
              {"EN"}
            </a>
          </span>
        </div>
        {"\n  "}
        <div
          style={css(
            "flex:1;display:flex;align-items:center;justify-content:center;padding:64px 20px 96px;",
          )}
        >
          {"\n    "}
          <div
            style={css(
              "max-width:640px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:20px;",
            )}
          >
            {"\n      "}
            <span
              style={css(
                "display:inline-flex;align-items:center;gap:10px;height:36px;padding:0 16px;border-radius:999px;border:1px solid rgba(251,191,36,0.45);background:rgba(251,191,36,0.08);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.08em;color:#FCD34D;",
              )}
            >
              <span
                style={css(
                  "width:8px;height:8px;border-radius:50%;background:#FCD34D;box-shadow:0 0 10px rgba(252,211,77,0.8);",
                )}
              ></span>
              {"점검 중"}
            </span>
            {"\n      "}
            <h1
              style={css(
                "margin:0;font-size:clamp(26px,2.8vw,36px);font-weight:700;color:#F8FAFC;",
              )}
            >
              {"더 나은 서비스를 위해 점검하고 있습니다"}
            </h1>
            {"\n      "}
            <p
              style={css(
                "margin:0;font-size:16px;line-height:1.7;color:#CBD5E1;",
              )}
            >
              {
                "점검 시간 동안 사이트와 PoC 신청, 문의 접수를 잠시 이용할 수 없습니다. 점검이 끝나면 바로 정상 운영됩니다."
              }
            </p>
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:4px;padding:16px 22px;border-radius:14px;border:1px solid rgba(214,230,255,0.16);background:rgba(214,230,255,0.04);",
              )}
            >
              <span style={css("font-size:12px;color:#64748B;")}>
                {"점검 시간"}
              </span>
              <span
                style={css(
                  "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:16px;color:#F8FAFC;",
                )}
              >
                {"2026.10.20(화) 02:00 ~ 04:00 (KST)"}
              </span>
            </div>
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:8px;",
              )}
            >
              <button className={"jr-btn"} onClick={reload}>
                {"새로고침"}
              </button>
            </div>
            {"\n      "}
            <span style={css("font-size:14px;color:#64748B;")}>
              {"급한 문의는 admin@itrix.co.kr로 보내 주세요."}
            </span>
            {"\n    "}
          </div>
          {"\n  "}
        </div>
        {"\n  "}
        <div
          style={css(
            "padding:20px;text-align:center;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.08em;color:#475569;",
          )}
        >
          {"© 2026 itriX · itrix.co.kr"}
        </div>
        {"\n"}
      </div>
      {"\n"}
    </>
  );
}
