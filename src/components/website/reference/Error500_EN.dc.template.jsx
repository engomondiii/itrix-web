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
        lang={"en"}
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
          <a href={"/en/"}>
            <img
              src={"/brand/fa5afd04db046644e14564cf63d6de02.png"}
              alt={"itriX"}
              style={css(
                "width:120px;height:auto;display:block;filter:invert(1);",
              )}
            />
          </a>
          <span className={"navlang"} role={"group"} aria-label={"Language"}>
            <a className={""} href={"/500"} lang={"ko"}>
              {"KO"}
            </a>
            <a className={"on"} href={"/en/500"} lang={"en"}>
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
                "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(96px,14vw,160px);font-weight:600;line-height:1;color:#F8FAFC;letter-spacing:-0.02em;",
              )}
            >
              {"500"}
            </span>
            {"\n      "}
            <h1
              style={css(
                "margin:0;font-size:clamp(26px,2.8vw,36px);font-weight:700;color:#F8FAFC;",
              )}
            >
              {"Something went wrong"}
            </h1>
            {"\n      "}
            <p
              style={css(
                "margin:0;font-size:16px;line-height:1.7;color:#CBD5E1;",
              )}
            >
              {
                "Our server ran into a temporary problem. Please try again in a moment. If you were submitting a form, it may not have been sent — please check."
              }
            </p>
            {"\n      \n      "}
            <div
              style={css(
                "display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:8px;",
              )}
            >
              <button className={"jr-btn"} onClick={reload}>
                {"Try again"}
              </button>
              <a className={"jr-ghost"} href={"/en/"}>
                {"Go home"}
              </a>
            </div>
            {"\n      "}
            <span style={css("font-size:14px;color:#64748B;")}>
              {"If this keeps happening, let us know at admin@itrix.co.kr."}
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
