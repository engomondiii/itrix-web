"use client";
// Converted from the supplied October 16 design; production state is supplied separately.
import React from "react";
import { css, AskX, NoticePopup, Captcha } from "./reference-style";
export function Template(values) {
  const {
    ckAll,
    ckAnaOn,
    ckBar,
    ckClose,
    ckNec,
    ckOpen,
    ckPanel,
    ckSaveSel,
    ckTgAna,
    mnClose,
    mnOpen,
    mnShow,
  } = values;
  return (
    <>
      <style>{`@media(max-width:820px){nav{gap:8px!important}nav>a img{width:88px!important}.nv-m{gap:6px!important}.nv-m .navlang{gap:0;padding:0}.nv-m .navlang a{padding:5px;font-size:12px}.nv-m .navpoc{padding:0 8px!important;font-size:12px!important}}`}</style>
      <style>
        {
          ".reference-hover-1:hover{color:#F8FAFC;}\n.reference-hover-2:hover{color:#F8FAFC;}\n.reference-hover-3:hover{color:#CBD5E1;}\n\nhtml,body{margin:0;padding:0;background:#020406;-webkit-font-smoothing:antialiased;word-break:keep-all;overflow-wrap:break-word;scroll-behavior:smooth;}\n*{box-sizing:border-box;}\na{color:#F8FAFC;text-decoration:none;}\na:hover{color:#D6E6FF;}\n.askx img{transition:opacity .2s ease;}.askx:hover img{opacity:0.78;}\n.jr-step{display:flex;align-items:center;gap:10px;padding:10px 16px 10px 10px;border-radius:999px;border:1px solid rgba(214,230,255,0.16);background:rgba(214,230,255,0.03);color:#94A3B8;white-space:nowrap;transition:border-color .2s ease,color .2s ease,background .2s ease;}\n.jr-step:hover{border-color:rgba(214,230,255,0.5);color:#F8FAFC;}\n.jr-step .jr-n{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:11px;border:1px solid rgba(214,230,255,0.3);color:#CBD5E1;}\n.jr-step.done{color:#CBD5E1;}\n.jr-step.done .jr-n{background:rgba(214,230,255,0.12);border-color:rgba(214,230,255,0.5);color:#D6E6FF;}\n.jr-step.now{background:#F8FAFC;border-color:#F8FAFC;color:#0B1118;box-shadow:0 0 0 4px rgba(214,230,255,0.14),0 0 24px rgba(214,230,255,0.35);}\n.jr-step.now .jr-n{background:#0B1118;border-color:#0B1118;color:#F8FAFC;}\n.jr-sep{width:18px;height:1px;background:rgba(214,230,255,0.25);flex-shrink:0;}\n.jr-card{position:relative;display:flex;flex-direction:column;gap:12px;padding:28px;border-radius:20px;background:linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 45%, rgba(255,255,255,0) 70%), rgba(8,13,16,0.55);border:1px solid rgba(214,230,255,0.16);box-shadow:inset 0 1px 0 rgba(255,255,255,0.08);}\n.jr-k{font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.12em;color:#94A3B8;}\n.jr-t{font-size:16px;line-height:1.65;color:#E2E8F0;}\n.jr-list{display:flex;flex-direction:column;border-top:1px solid rgba(214,230,255,0.16);}\n.jr-li{display:flex;gap:20px;align-items:flex-start;padding:20px 0;border-bottom:1px solid rgba(214,230,255,0.16);}\n.jr-li .jr-ln{flex-shrink:0;width:32px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.1em;color:#94A3B8;padding-top:4px;}\n.jr-li .jr-lt{font-size:17px;line-height:1.6;color:#F8FAFC;}\n.jr-chip{display:inline-flex;align-items:center;padding:8px 14px;border-radius:999px;border:1px solid rgba(214,230,255,0.24);font-size:14px;color:#E2E8F0;white-space:nowrap;}\n.jr-arrow{color:#64748B;}\n.jr-btn{height:56px;display:inline-flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:#F8FAFC;color:#1F2937 !important;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:18px;font-weight:600;cursor:pointer;border:none;transition:box-shadow .2s ease,opacity .2s ease;}\n.jr-btn:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.5);}\n.jr-btn.off{opacity:0.35;cursor:not-allowed;box-shadow:none;}\n.jr-ghost{height:56px;display:inline-flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:rgba(2,4,6,0.4);border:1px solid rgba(214,230,255,0.5);color:#F8FAFC;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:18px;font-weight:500;}\n.jr-ghost:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.2);color:#F8FAFC;}\n.jr-check{display:flex;align-items:flex-start;gap:14px;padding:18px 20px;border-radius:16px;border:1px solid rgba(214,230,255,0.18);background:rgba(214,230,255,0.03);cursor:pointer;text-align:left;color:#E2E8F0;font-family:'Noto Sans KR',sans-serif;font-size:16px;line-height:1.55;width:100%;transition:border-color .2s ease,background .2s ease;}\n.jr-check:hover{border-color:rgba(214,230,255,0.5);}\n.jr-check .jr-box{flex-shrink:0;width:22px;height:22px;margin-top:1px;border-radius:6px;border:1.5px solid rgba(214,230,255,0.5);display:flex;align-items:center;justify-content:center;color:transparent;font-size:14px;}\n.jr-check.on{border-color:rgba(214,230,255,0.7);background:rgba(214,230,255,0.08);}\n.jr-check.on .jr-box{background:#F8FAFC;border-color:#F8FAFC;color:#0B1118;}\n.jr-plan{display:flex;flex-direction:column;gap:10px;padding:28px;border-radius:20px;border:1px solid rgba(214,230,255,0.22);background:rgba(2,4,6,0.55);cursor:pointer;text-align:left;color:#F8FAFC;font-family:'Noto Sans KR',sans-serif;transition:border-color .2s ease,box-shadow .2s ease;}\n.jr-plan:hover{border-color:rgba(214,230,255,0.6);}\n.jr-plan.on{border-color:#D6E6FF;box-shadow:0 0 0 1px #D6E6FF,0 0 32px rgba(214,230,255,0.18);}\n.jr-radio{width:20px;height:20px;border-radius:50%;border:1.5px solid rgba(214,230,255,0.5);display:flex;align-items:center;justify-content:center;}\n.jr-plan.on .jr-radio::after{content:'';width:10px;height:10px;border-radius:50%;background:#F8FAFC;}\n.jr-input{height:52px;padding:0 18px;border-radius:12px;border:1px solid rgba(214,230,255,0.28);background:rgba(2,4,6,0.6);color:#F8FAFC;font-family:'Noto Sans KR',sans-serif;font-size:15px;outline:none;width:100%;}\n.jr-input:focus{border-color:#D6E6FF;box-shadow:0 0 0 3px rgba(214,230,255,0.15);}\n.jr-input::placeholder{color:#64748B;}\n.jr-toggle{width:52px;height:30px;border-radius:999px;border:1px solid rgba(214,230,255,0.4);background:rgba(214,230,255,0.06);position:relative;cursor:pointer;flex-shrink:0;transition:background .2s ease;}\n.jr-toggle::after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#94A3B8;transition:left .2s ease,background .2s ease;}\n.jr-toggle.on{background:rgba(214,230,255,0.25);border-color:#D6E6FF;}\n.jr-toggle.on::after{left:25px;background:#F8FAFC;}\n.jr-dot{width:8px;height:8px;border-radius:50%;background:#D6E6FF;box-shadow:0 0 10px rgba(214,230,255,0.8);flex-shrink:0;}\n.jr-flow{display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px;}\n.jr-pn{display:flex;flex-direction:column;gap:6px;padding:24px 28px;border-radius:20px;border:1px solid rgba(214,230,255,0.18);background:rgba(214,230,255,0.03);transition:border-color .2s ease;}\n.jr-pn:hover{border-color:rgba(214,230,255,0.6);}\n@media (max-width:860px){.jr-sep{display:none;}}\n.su-steps{display:flex;flex-wrap:wrap;align-items:center;gap:10px 0;}\n.su-field{display:flex;flex-direction:column;gap:8px;}\n.su-label{font-size:14px;color:#CBD5E1;}\n.su-req{color:#94A3B8;font-size:12px;margin-left:4px;}\n.su-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:14px;}\n.su-seg{display:inline-flex;padding:4px;border-radius:12px;border:1px solid rgba(214,230,255,0.22);background:rgba(2,4,6,0.5);gap:4px;}\n.su-seg button{height:40px;padding:0 18px;border-radius:9px;border:none;background:transparent;color:#94A3B8;font-family:'Noto Sans KR',sans-serif;font-size:15px;cursor:pointer;}\n.su-seg button.on{background:#F8FAFC;color:#0B1118;font-weight:700;}\n.su-back{height:56px;display:inline-flex;align-items:center;gap:8px;padding:0 20px;border-radius:14px;border:1px solid rgba(214,230,255,0.3);background:transparent;color:#CBD5E1;font-family:'Noto Sans KR',sans-serif;font-size:15px;cursor:pointer;}\n.su-nav{height:56px !important;padding:0 20px !important;font-family:'Noto Sans KR',sans-serif !important;font-size:15px !important;font-weight:700 !important;}\n.su-back:hover{border-color:rgba(214,230,255,0.7);color:#F8FAFC;}\n.su-sum{position:sticky;top:96px;}\n.su-badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:rgba(214,230,255,0.12);border:1px solid rgba(214,230,255,0.4);font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.08em;color:#D6E6FF;}\n.su-key{font-family:'IBM Plex Mono',monospace;font-size:20px;letter-spacing:0.12em;color:#F8FAFC;padding:14px 18px;border-radius:12px;border:1px dashed rgba(214,230,255,0.45);background:rgba(214,230,255,0.04);}\n.su-table{width:100%;border-collapse:collapse;font-size:15px;}\n.su-table th{text-align:left;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.1em;color:#94A3B8;font-weight:500;padding:0 0 12px;border-bottom:1px solid rgba(214,230,255,0.16);}\n.su-table td{padding:16px 0;border-bottom:1px solid rgba(214,230,255,0.12);color:#E2E8F0;}\n.su-danger{height:48px;display:inline-flex;align-items:center;padding:0 20px;border-radius:12px;border:1px solid rgba(248,113,113,0.5);background:transparent;color:#FCA5A5;font-family:'Noto Sans KR',sans-serif;font-size:15px;cursor:pointer;}\n.su-danger:hover{background:rgba(248,113,113,0.08);}\n.lg-toc a{display:block;padding:8px 0;font-size:14px;color:#94A3B8;border-bottom:1px solid rgba(214,230,255,0.08);}\n.lg-toc a:hover{color:#F8FAFC;}\n.lg-sec{display:flex;flex-direction:column;gap:12px;padding:28px 0;border-top:1px solid rgba(214,230,255,0.12);scroll-margin-top:96px;}\n.lg-sec h2{margin:0;font-size:20px;font-weight:700;color:#F8FAFC;}\n.lg-sec p,.lg-sec li{margin:0;font-size:15px;line-height:1.8;color:#CBD5E1;}\n.lg-sec ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px;}\n.lg-draft{display:inline-flex;align-self:flex-start;align-items:center;gap:8px;padding:6px 12px;border-radius:999px;border:1px solid rgba(251,191,36,0.5);background:rgba(251,191,36,0.08);font-size:12px;color:#FCD34D;}\n.ft-links a{color:#CBD5E1;font-size:14px;}.ft-links a:hover{color:#F8FAFC;}\n.navpoc{height:38px;display:inline-flex;align-items:center;padding:0 18px;border-radius:10px;background:#F8FAFC;color:#0B1118 !important;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:700;white-space:nowrap;transition:box-shadow .2s ease;}\n.navpoc:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.35);color:#0B1118 !important;}\n.navlang{display:inline-flex;padding:3px;border-radius:10px;border:1px solid rgba(214,230,255,0.28);background:rgba(2,4,6,0.5);gap:2px;}\n.navlang a{height:30px;min-width:38px;display:inline-flex;align-items:center;justify-content:center;padding:0 10px;border-radius:7px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.06em;color:#94A3B8 !important;transition:background .2s ease,color .2s ease;}\n.navlang a:hover{color:#F8FAFC !important;}\n.navlang a.on{background:#F8FAFC;color:#0B1118 !important;font-weight:500;}\n.ck-bar{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;justify-content:center;padding:0 20px 20px;pointer-events:none;}\n.ck-card{pointer-events:auto;width:min(1040px,100%);display:flex;flex-wrap:wrap;align-items:center;gap:18px 28px;padding:22px 26px;border-radius:20px;border:1px solid rgba(214,230,255,0.24);background:rgba(11,17,24,0.94);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 24px 70px rgba(0,0,0,0.55);font-family:'Noto Sans KR',sans-serif;}\n.ck-btns{display:flex;flex-wrap:wrap;gap:10px;}\n.ck-b{height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 18px;border-radius:12px;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap;border:1px solid rgba(214,230,255,0.35);background:transparent;color:#E2E8F0;transition:border-color .2s,background .2s,box-shadow .2s;}\n.ck-b:hover{border-color:rgba(214,230,255,0.8);color:#F8FAFC;}\n.ck-b.pri{background:#F8FAFC;border-color:#F8FAFC;color:#0B1118;font-weight:700;}\n.ck-b.pri:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.3);color:#0B1118;}\n.ck-b.txt{border-color:transparent;color:#94A3B8;text-decoration:underline;text-underline-offset:3px;padding:0 6px;}\n.ck-b.txt:hover{color:#F8FAFC;}\n.ck-wrap{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(2,4,6,0.66);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:'Noto Sans KR',sans-serif;}\n.ck-panel{width:min(520px,100%);display:flex;flex-direction:column;gap:18px;padding:28px;border-radius:24px;border:1px solid rgba(214,230,255,0.28);background:#0B1118;box-shadow:0 40px 100px rgba(0,0,0,0.6);}\n.ck-row{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:16px 0;border-top:1px solid rgba(214,230,255,0.12);}\n.ck-tg{width:48px;height:28px;border-radius:999px;border:1px solid rgba(214,230,255,0.4);background:rgba(214,230,255,0.06);position:relative;cursor:pointer;flex-shrink:0;padding:0;transition:background .2s;}\n.ck-tg::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#94A3B8;transition:left .2s,background .2s;}\n.ck-tg.on{background:rgba(214,230,255,0.3);border-color:#D6E6FF;}\n.ck-tg.on::after{left:23px;background:#F8FAFC;}\n.ck-tg.lock{opacity:0.55;cursor:default;}\n.ft-ck{background:none;border:none;padding:0;cursor:pointer;font:inherit;text-align:left;color:#CBD5E1;}\n.ft-ck:hover{color:#F8FAFC;}\n.nv-m{display:none;align-items:center;gap:10px;}\n.nv-burger{width:42px;height:38px;border-radius:10px;border:1px solid rgba(214,230,255,0.3);background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;padding:0;}\n.nv-burger span{width:18px;height:1.5px;background:#F8FAFC;border-radius:2px;}\n.mn-wrap{position:fixed;inset:0;z-index:95;display:flex;flex-direction:column;background:#020406;overflow-y:auto;}\n.mn-top{display:flex;justify-content:space-between;align-items:center;min-height:64px;padding:12px 20px;border-bottom:1px solid rgba(214,230,255,0.14);}\n.mn-x{width:42px;height:38px;border-radius:10px;border:1px solid rgba(214,230,255,0.3);background:transparent;color:#F8FAFC;font-size:18px;cursor:pointer;}\n.mn-list{display:flex;flex-direction:column;padding:12px 20px;}\n.mn-list a.mi{display:flex;justify-content:space-between;align-items:center;height:60px;border-bottom:1px solid rgba(214,230,255,0.1);font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:24px;font-weight:500;color:#F8FAFC;}\n.mn-list a.mi span.ar{color:#64748B;font-size:18px;}\n.mn-foot{display:flex;flex-direction:column;gap:14px;padding:20px 20px 32px;margin-top:auto;}\n.mn-poc{height:54px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:#F8FAFC;color:#0B1118 !important;font-family:'Noto Sans KR',sans-serif;font-size:16px;font-weight:700;}\n@media (max-width:820px){nav .nv-links{display:none !important;}.nv-m{display:flex;}.nv-m .navpoc{height:36px;padding:0 14px;font-size:13px;}nav{min-height:64px !important;}}\n@media (max-width:820px){body{overflow-x:clip;}h1,h2,h3{max-width:100% !important;}h1,h2,h3{width:auto !important;}div[style*=\"span 2\"]{grid-column:auto !important;}section[style*=\"position\"]{max-width:100vw;}}\n"
        }
      </style>
      {"\n"}
      <div
        lang={"ko"}
        style={css(
          "background: #020406; color: #F8FAFC; font-family: 'Noto Sans KR',sans-serif; min-height: 100vh;",
        )}
      >
        {"\n  "}
        <nav
          style={css(
            "position:sticky;top:0;z-index:20;min-height:72px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 32px;padding:12px clamp(20px,5vw,48px);background:rgba(2,4,6,0.78);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid rgba(214,230,255,0.14);",
          )}
        >
          {"\n    "}
          <a
            href={"/"}
            style={css("display:flex;align-items:center;gap:16px;")}
          >
            <img
              src={"/brand/itrix-logo-inverse.svg"}
              alt={"itriX"}
              style={css("width:120px;height:auto;display:block;")}
            />
          </a>
          {"\n    "}
          <div
            className={"nv-links"}
            style={css(
              "display:flex;flex-wrap:wrap;align-items:center;gap:8px 32px;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:500;",
            )}
          >
            {"\n      "}
            <a href={"/#portfolio"} style={css("color:#F8FAFC;")}>
              {"Products"}
            </a>
            {"\n      "}
            <a
              href={"/#technology"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-1"}
            >
              {"Technology"}
            </a>
            {"\n      "}
            <a
              href={"/#why"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-2"}
            >
              {"Company"}
            </a>
            {"\n      "}
            <a
              className={"askx reference-hover-3"}
              href={"/#ask-chat"}
              style={css(
                "display:flex;align-items:center;gap:8px;color:#F8FAFC;",
              )}
            >
              <span
                style={css(
                  "display:inline-flex;align-items:center;gap:7px;white-space:nowrap;pointer-events:none;",
                )}
              >
                {"Ask "}
                <span>itriX</span>
              </span>
            </a>
            {"\n      "}
            <a className={"navpoc"} href={"/poc"}>
              {"PoC 신청"}
            </a>
            {"\n      "}
            <span className={"navlang"} role={"group"} aria-label={"Language"}>
              <a className={"on"} href={"/privacy"} lang={"ko"}>
                {"KO"}
              </a>
              <a className={""} href={"/en/privacy"} lang={"en"}>
                {"EN"}
              </a>
            </span>
            {"\n    "}
          </div>
          {"\n    "}
          <div className={"nv-m"}>
            <span className={"navlang"} role={"group"} aria-label={"Language"}>
              <a className={"on"} href={"/privacy"} lang={"ko"}>
                {"KO"}
              </a>
              <a className={""} href={"/en/privacy"} lang={"en"}>
                {"EN"}
              </a>
            </span>
            <a className={"navpoc"} href={"/poc"}>
              {"PoC 신청"}
            </a>
            <button
              className={"nv-burger"}
              onClick={mnOpen}
              aria-label={"메뉴 열기"}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          {"\n  "}
        </nav>
        {"\n  "}
        <section
          style={css(
            "padding:clamp(48px,6vw,88px) clamp(20px,6vw,80px) clamp(64px,8vw,112px);background:#020406;",
          )}
        >
          {"\n    "}
          <div
            style={css(
              "max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:32px;",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:14px;max-width:760px;",
              )}
            >
              <span
                style={css(
                  "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#D6E6FF;",
                )}
              >
                {"PRIVACY POLICY"}
              </span>
              <h1
                style={css(
                  "margin:0;font-size:clamp(32px,3.4vw,44px);font-weight:700;line-height:1.2;color:#F8FAFC;",
                )}
              >
                {"개인정보처리방침"}
              </h1>
              <p
                style={css(
                  "margin:0;font-size:16px;line-height:1.7;color:#CBD5E1;",
                )}
              >
                {
                  "itriX(이하 “회사”)는 개인정보 보호법 등 관련 법령을 지키며, 이용자의 개인정보를 다음과 같이 처리합니다."
                }
              </p>
            </div>
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start;",
              )}
            >
              {"\n        "}
              <nav
                className={"lg-toc"}
                aria-label={"개인정보처리방침"}
                style={css("flex:1 1 240px;max-width:280px;min-width:0;")}
              >
                <a href={"#s1"}>{"1. 수집하는 개인정보 항목"}</a>
                <a href={"#s2"}>{"2. 개인정보의 수집·이용 목적"}</a>
                <a href={"#s3"}>{"3. 보유 및 이용 기간"}</a>
                <a href={"#s4"}>{"4. 개인정보의 제3자 제공"}</a>
                <a href={"#s5"}>{"5. 개인정보 처리 위탁"}</a>
                <a href={"#s6"}>{"6. 개인정보의 파기"}</a>
                <a href={"#s7"}>{"7. 이용자의 권리와 행사 방법"}</a>
                <a href={"#s8"}>{"8. 개인정보의 안전성 확보 조치"}</a>
                <a href={"#s9"}>{"9. 쿠키의 사용"}</a>
                <a href={"#s10"}>{"10. 개인정보 보호책임자"}</a>
                <a href={"#s11"}>{"11. 방침의 변경"}</a>
              </nav>
              {"\n        "}
              <div
                style={css(
                  "flex:999 1 520px;min-width:0;display:flex;flex-direction:column;",
                )}
              >
                <section id={"s1"} className={"lg-sec"}>
                  <h2>{"1. 수집하는 개인정보 항목"}</h2>
                  <ul>
                    <li>
                      <b>{"PoC 신청"}</b>
                      {
                        " — 필수: 회사명, 담당자 이름, 업무용 이메일, 적용하려는 업무 / 선택: 부서·직책, 연락처, 업종, 사용 중인 AI·자동화 도구, 희망 시작 시기"
                      }
                    </li>
                    <li>
                      <b>{"일반 문의"}</b>
                      {
                        " — 필수: 이름, 이메일, 문의 내용 / 선택: 문의 유형, 회사명"
                      }
                    </li>
                    <li>
                      <b>{"소식 수신(선택)"}</b>
                      {" — 이름, 이메일, 회사명"}
                    </li>
                    <li>
                      <b>{"자동 수집"}</b>
                      {
                        " — 접속 기록, IP 주소, 브라우저 정보, 쿠키 (서비스 운영·보안 목적)"
                      }
                    </li>
                    <li>
                      <b>{"파트너십·대규모 도입"}</b>
                      {
                        " — 필수: 회사·기관명, 담당자 이름, 업무용 이메일, 협력 형태, 적용하려는 업무 / 선택: 부서·직책, 연락처, 업종, 조직 규모, 관심 제품, 도입 규모, 희망 일정"
                      }
                    </li>
                  </ul>
                </section>
                <section id={"s2"} className={"lg-sec"}>
                  <h2>{"2. 개인정보의 수집·이용 목적"}</h2>
                  <ul>
                    <li>{"PoC 신청 검토, 적합성 판단 및 진행 관련 연락"}</li>
                    <li>{"문의 확인 및 답변"}</li>
                    <li>
                      {"수신에 동의한 경우 ASTOP 업데이트와 회사 소식 안내"}
                    </li>
                    <li>{"부정 이용 방지와 서비스 안정성 확보"}</li>
                    <li>
                      {"파트너십·대규모 도입 문의 검토 및 협의 관련 연락"}
                    </li>
                  </ul>
                </section>
                <section id={"s3"} className={"lg-sec"}>
                  <h2>{"3. 보유 및 이용 기간"}</h2>
                  <ul>
                    <li>
                      {
                        "PoC 신청 정보: 신청일로부터 [1년] 또는 PoC 종료 후 [1년]"
                      }
                    </li>
                    <li>{"문의 정보: 답변 완료 후 [1년]"}</li>
                    <li>{"소식 수신 정보: 수신 동의 철회 시까지"}</li>
                    <li>
                      {
                        "관련 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다."
                      }
                    </li>
                    <li>
                      {"파트너십·대규모 도입 문의 정보: 답변 완료 후 [1년]"}
                    </li>
                  </ul>
                </section>
                <section id={"s4"} className={"lg-sec"}>
                  <h2>{"4. 개인정보의 제3자 제공"}</h2>
                  <ul>
                    <li>
                      {
                        "회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따라 요구되는 경우는 예외로 합니다."
                      }
                    </li>
                  </ul>
                </section>
                <section id={"s5"} className={"lg-sec"}>
                  <h2>{"5. 개인정보 처리 위탁"}</h2>
                  <ul>
                    <li>
                      {
                        "서버 호스팅: Railway 등 IWL 서버 — 웹사이트 운영 및 데이터 보관"
                      }
                    </li>
                    <li>
                      {
                        "이메일 발송: [발송 서비스 업체명] — 접수 확인 및 소식 메일 발송"
                      }
                    </li>
                    <li>{"위탁 업체가 바뀌면 이 방침을 통해 알립니다."}</li>
                  </ul>
                </section>
                <section id={"s6"} className={"lg-sec"}>
                  <h2>{"6. 개인정보의 파기"}</h2>
                  <ul>
                    <li>
                      {
                        "보유 기간이 끝나거나 처리 목적이 달성되면 지체 없이 파기합니다."
                      }
                    </li>
                    <li>
                      {
                        "전자 파일은 복구할 수 없는 방법으로 삭제하고, 출력물은 분쇄하거나 소각합니다."
                      }
                    </li>
                  </ul>
                </section>
                <section id={"s7"} className={"lg-sec"}>
                  <h2>{"7. 이용자의 권리와 행사 방법"}</h2>
                  <ul>
                    <li>
                      {
                        "이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다."
                      }
                    </li>
                    <li>
                      {
                        "소식 수신 동의는 메일 하단의 수신 거부 링크나 admin@itrix.co.kr로 언제든 철회할 수 있습니다."
                      }
                    </li>
                    <li>
                      {
                        "요청은 admin@itrix.co.kr로 보내 주시면 지체 없이 처리합니다."
                      }
                    </li>
                  </ul>
                </section>
                <section id={"s8"} className={"lg-sec"}>
                  <h2>{"8. 개인정보의 안전성 확보 조치"}</h2>
                  <ul>
                    <li>
                      {
                        "전송 구간 암호화(HTTPS), 접근 권한 최소화, 접속 기록 보관 등 필요한 보호 조치를 시행합니다."
                      }
                    </li>
                  </ul>
                </section>
                <section id={"s9"} className={"lg-sec"}>
                  <h2>{"9. 쿠키의 사용"}</h2>
                  <ul>
                    <li>
                      {
                        "회사는 사이트 운영과 이용 통계 분석을 위해 쿠키(웹사이트가 이용자의 브라우저에 저장하는 작은 텍스트 파일)를 사용합니다."
                      }
                    </li>
                    <li>
                      <b>{"필수 쿠키"}</b>
                      {
                        " — 언어 선택, 공지 팝업 표시 여부, 쿠키 동의 상태 저장 등 사이트 기본 기능에 사용하며, 사이트 이용을 위해 항상 사용됩니다."
                      }
                    </li>
                    <li>
                      <b>{"분석 쿠키"}</b>
                      {
                        " — 방문 수, 페이지 이용 현황, 유입 경로 등 통계를 수집해 사이트 개선에 활용하며, 이용자가 동의한 경우에만 사용합니다."
                      }
                    </li>
                    <li>
                      {
                        "쿠키 설정은 사이트 하단의 ‘쿠키 설정’에서 언제든 바꿀 수 있습니다. 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수도 있으며, 이 경우 일부 기능이 제한될 수 있습니다."
                      }
                    </li>
                  </ul>
                </section>
                <section id={"s10"} className={"lg-sec"}>
                  <h2>{"10. 개인정보 보호책임자"}</h2>
                  <ul>
                    <li>{"성명: [담당자 이름]"}</li>
                    <li>{"이메일: admin@itrix.co.kr"}</li>
                    <li>
                      {
                        "개인정보 침해 신고·상담: 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118)"
                      }
                    </li>
                  </ul>
                </section>
                <section id={"s11"} className={"lg-sec"}>
                  <h2>{"11. 방침의 변경"}</h2>
                  <ul>
                    <li>
                      {
                        "이 방침은 2026년 [ ]월 [ ]일부터 적용됩니다. 내용이 바뀌면 시행 7일 전에 웹사이트를 통해 알립니다."
                      }
                    </li>
                  </ul>
                </section>
              </div>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n  "}
        <footer
          style={css(
            "background:#020406;border-top:1px solid rgba(214,230,255,0.1);padding:48px clamp(20px,6vw,80px);",
          )}
        >
          {"\n    "}
          <div
            style={css(
              "max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:24px;",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;",
              )}
            >
              {"\n        "}
              <a href={"/"}>
                <img
                  src={"/brand/itrix-logo-inverse.svg"}
                  alt={"itriX"}
                  style={css("width:120px;height:auto;display:block;")}
                />
              </a>
              {"\n        "}
              <nav
                className={"ft-links"}
                aria-label={"Footer"}
                style={css("display:flex;flex-wrap:wrap;gap:8px 24px;")}
              >
                <a href={"/contact"}>{"문의하기"}</a>
                <a href={"/poc"}>{"PoC 신청"}</a>
                <a href={"/privacy"}>{"개인정보처리방침"}</a>
                <a href={"/terms"}>{"이용약관"}</a>
                <button
                  className={"ft-ck"}
                  onClick={ckOpen}
                  style={css("font-size:14px;")}
                >
                  {"쿠키 설정"}
                </button>
              </nav>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:10px;padding-top:20px;border-top:1px solid rgba(214,230,255,0.1);",
              )}
            >
              {"\n        "}
              <div
                style={css(
                  "display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;line-height:1.6;color:#64748B;",
                )}
              >
                <span>{"상호 주식회사 아이트릭스"}</span>
                <span>{"대표자 강명주"}</span>
                <span>{"사업자등록번호 119-87-03826"}</span>
                <span>{"서울시 서초구 효령로 55길 19, 611호"}</span>
                <span>{"admin@itrix.co.kr"}</span>
              </div>
              {"\n        "}
              <div
                style={css(
                  "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.08em;color:#64748B;",
                )}
              >
                {"© 2026 itriX ALL RIGHTS RESERVED. · itrix.co.kr"}
              </div>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </footer>
        {"\n  "}
        {ckBar && (
          <>
            {"\n    "}
            <div
              className={"ck-bar"}
              role={"region"}
              aria-label={"쿠키 사용 안내"}
            >
              <div className={"ck-card"}>
                {"\n      "}
                <div
                  style={css(
                    "flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:6px;",
                  )}
                >
                  {"\n        "}
                  <span
                    style={css("font-size:16px;font-weight:700;color:#F8FAFC;")}
                  >
                    {"쿠키 사용 안내"}
                  </span>
                  {"\n        "}
                  <span
                    style={css(
                      "font-size:14px;line-height:1.65;color:#CBD5E1;",
                    )}
                  >
                    {
                      "itriX는 사이트 운영에 꼭 필요한 쿠키와, 동의하신 경우에 한해 방문 통계를 위한 분석 쿠키를 사용합니다. 자세한 내용은 "
                    }
                    <a
                      href={"/privacy#s9"}
                      style={css(
                        "color:#D6E6FF;text-decoration:underline;text-underline-offset:3px;",
                      )}
                    >
                      {"개인정보처리방침"}
                    </a>
                    {"에서 확인할 수 있습니다."}
                  </span>
                  {"\n      "}
                </div>
                {"\n      "}
                <div className={"ck-btns"}>
                  <button className={"ck-b txt"} onClick={ckOpen}>
                    {"쿠키 설정"}
                  </button>
                  <button className={"ck-b"} onClick={ckNec}>
                    {"필수만 허용"}
                  </button>
                  <button className={"ck-b pri"} onClick={ckAll}>
                    {"모두 허용"}
                  </button>
                </div>
                {"\n    "}
              </div>
            </div>
            {"\n  "}
          </>
        )}
        {"\n  "}
        {ckPanel && (
          <>
            {"\n    "}
            <div
              className={"ck-wrap"}
              role={"dialog"}
              aria-modal={"true"}
              aria-label={"쿠키 설정"}
            >
              <div className={"ck-panel"}>
                {"\n      "}
                <div
                  style={css(
                    "display:flex;justify-content:space-between;align-items:flex-start;gap:16px;",
                  )}
                >
                  <div
                    style={css("display:flex;flex-direction:column;gap:8px;")}
                  >
                    <span
                      style={css(
                        "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.14em;color:#D6E6FF;",
                      )}
                    >
                      {"COOKIES"}
                    </span>
                    <span
                      style={css(
                        "font-size:22px;font-weight:700;color:#F8FAFC;",
                      )}
                    >
                      {"쿠키 설정"}
                    </span>
                  </div>
                  <button
                    className={"ck-b txt"}
                    onClick={ckClose}
                    aria-label={"닫기"}
                    style={css("text-decoration:none;font-size:18px;")}
                  >
                    {"✕"}
                  </button>
                </div>
                {"\n      "}
                <span
                  style={css("font-size:14px;line-height:1.65;color:#CBD5E1;")}
                >
                  {
                    "사용할 쿠키를 선택해 주세요. 설정은 사이트 하단의 ‘쿠키 설정’에서 언제든 바꿀 수 있습니다."
                  }
                </span>
                {"\n      "}
                <div style={css("display:flex;flex-direction:column;")}>
                  {"\n        "}
                  <div className={"ck-row"}>
                    <div
                      style={css("display:flex;flex-direction:column;gap:4px;")}
                    >
                      <span
                        style={css(
                          "font-size:15px;font-weight:700;color:#F8FAFC;",
                        )}
                      >
                        {"필수 쿠키 "}
                        <span
                          style={css(
                            "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:11px;letter-spacing:0.06em;color:#94A3B8;font-weight:400;margin-left:6px;",
                          )}
                        >
                          {"항상 사용"}
                        </span>
                      </span>
                      <span
                        style={css(
                          "font-size:13px;line-height:1.6;color:#94A3B8;",
                        )}
                      >
                        {
                          "언어 선택, 팝업 표시 여부, 쿠키 동의 상태 등 사이트 기본 기능에 필요합니다."
                        }
                      </span>
                    </div>
                    <span
                      className={"ck-tg on lock"}
                      aria-hidden={"true"}
                    ></span>
                  </div>
                  {"\n        "}
                  <div
                    className={"ck-row"}
                    style={css(
                      "border-bottom:1px solid rgba(214,230,255,0.12);",
                    )}
                  >
                    <div
                      style={css("display:flex;flex-direction:column;gap:4px;")}
                    >
                      <span
                        style={css(
                          "font-size:15px;font-weight:700;color:#F8FAFC;",
                        )}
                      >
                        {"분석 쿠키"}
                      </span>
                      <span
                        style={css(
                          "font-size:13px;line-height:1.6;color:#94A3B8;",
                        )}
                      >
                        {
                          "방문 수, 페이지 이용 현황, 유입 경로 등 통계를 수집해 사이트 개선에 활용합니다."
                        }
                      </span>
                    </div>
                    <button
                      className={`ck-tg ${ckAnaOn}`}
                      onClick={ckTgAna}
                      aria-label={"분석 쿠키"}
                    ></button>
                  </div>
                  {"\n      "}
                </div>
                {"\n      "}
                <div
                  style={css(
                    "display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px;",
                  )}
                >
                  <button className={"ck-b"} onClick={ckSaveSel}>
                    {"선택 저장"}
                  </button>
                  <button className={"ck-b pri"} onClick={ckAll}>
                    {"모두 허용"}
                  </button>
                </div>
                {"\n    "}
              </div>
            </div>
            {"\n  "}
          </>
        )}
        {"\n  "}
        {mnShow && (
          <>
            {"\n    "}
            <div
              className={"mn-wrap"}
              role={"dialog"}
              aria-modal={"true"}
              aria-label={"Menu"}
            >
              {"\n      "}
              <div className={"mn-top"}>
                <a href={"/"} onClick={mnClose}>
                  <img
                    src={"/brand/itrix-logo-inverse.svg"}
                    alt={"itriX"}
                    style={css("width:104px;height:auto;display:block;")}
                  />
                </a>
                <button
                  className={"mn-x"}
                  onClick={mnClose}
                  aria-label={"메뉴 닫기"}
                >
                  {"✕"}
                </button>
              </div>
              {"\n      "}
              <div className={"mn-list"}>
                {"\n        "}
                <a className={"mi"} href={"/#portfolio"} onClick={mnClose}>
                  {"Products "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"/#technology"} onClick={mnClose}>
                  {"Technology "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"/#why"} onClick={mnClose}>
                  {"Company "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"/#ask-chat"} onClick={mnClose}>
                  <span
                    style={css(
                      "display:inline-flex;align-items:center;gap:9px;",
                    )}
                  >
                    {"Ask "}
                    <span>itriX</span>
                  </span>{" "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"/contact"} onClick={mnClose}>
                  {"문의하기 "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n      "}
              </div>
              {"\n      "}
              <div className={"mn-foot"}>
                <a className={"mn-poc"} href={"/poc"} onClick={mnClose}>
                  {"PoC 신청 →"}
                </a>
                <div>
                  <span
                    className={"navlang"}
                    role={"group"}
                    aria-label={"Language"}
                  >
                    <a className={"on"} href={"/privacy"} lang={"ko"}>
                      {"KO"}
                    </a>
                    <a className={""} href={"/en/privacy"} lang={"en"}>
                      {"EN"}
                    </a>
                  </span>
                </div>
              </div>
              {"\n    "}
            </div>
            {"\n  "}
          </>
        )}
        {"\n"}
      </div>
      {"\n"}
    </>
  );
}
