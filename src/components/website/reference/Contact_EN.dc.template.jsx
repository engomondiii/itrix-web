"use client";
// Converted from the supplied October 16 design; production state is supplied separately.
import React from "react";
import { css, AskX, NoticePopup, Captcha } from "./reference-style";
export function Template(values) {
  const {
    again,
    agreePriv,
    ckAll,
    ckAnaOn,
    ckBar,
    ckClose,
    ckNec,
    ckOpen,
    ckPanel,
    ckSaveSel,
    ckTgAna,
    closeM,
    e_cap,
    e_email,
    e_msg,
    e_name,
    e_priv,
    ec_company,
    ec_email,
    ec_msg,
    ec_name,
    in_company,
    in_email,
    in_msg,
    in_name,
    isFailed,
    isIdle,
    isSending,
    isSent,
    mPriv,
    mnClose,
    mnOpen,
    mnShow,
    notSent,
    openPriv,
    privOn,
    send,
    set_ty0,
    set_ty1,
    set_ty2,
    set_ty3,
    tgPriv,
    ty0,
    ty1,
    ty2,
    ty3,
    v_company,
    v_email,
    v_msg,
    v_name,
  } = values;
  return (
    <>
      <style>
        {
          ".reference-hover-1:hover{color:#F8FAFC;}\n.reference-hover-2:hover{color:#F8FAFC;}\n.reference-hover-3:hover{color:#CBD5E1;}\n\nhtml,body{margin:0;padding:0;background:#020406;-webkit-font-smoothing:antialiased;word-break:keep-all;overflow-wrap:break-word;scroll-behavior:smooth;}\n*{box-sizing:border-box;}\na{color:#F8FAFC;text-decoration:none;}\na:hover{color:#D6E6FF;}\n.askx img{transition:opacity .2s ease;}.askx:hover img{opacity:0.78;}\n.jr-step{display:flex;align-items:center;gap:10px;padding:10px 16px 10px 10px;border-radius:999px;border:1px solid rgba(214,230,255,0.16);background:rgba(214,230,255,0.03);color:#94A3B8;white-space:nowrap;transition:border-color .2s ease,color .2s ease,background .2s ease;}\n.jr-step:hover{border-color:rgba(214,230,255,0.5);color:#F8FAFC;}\n.jr-step .jr-n{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:11px;border:1px solid rgba(214,230,255,0.3);color:#CBD5E1;}\n.jr-step.done{color:#CBD5E1;}\n.jr-step.done .jr-n{background:rgba(214,230,255,0.12);border-color:rgba(214,230,255,0.5);color:#D6E6FF;}\n.jr-step.now{background:#F8FAFC;border-color:#F8FAFC;color:#0B1118;box-shadow:0 0 0 4px rgba(214,230,255,0.14),0 0 24px rgba(214,230,255,0.35);}\n.jr-step.now .jr-n{background:#0B1118;border-color:#0B1118;color:#F8FAFC;}\n.jr-sep{width:18px;height:1px;background:rgba(214,230,255,0.25);flex-shrink:0;}\n.jr-card{position:relative;display:flex;flex-direction:column;gap:12px;padding:28px;border-radius:20px;background:linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 45%, rgba(255,255,255,0) 70%), rgba(8,13,16,0.55);border:1px solid rgba(214,230,255,0.16);box-shadow:inset 0 1px 0 rgba(255,255,255,0.08);}\n.jr-k{font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.12em;color:#94A3B8;}\n.jr-t{font-size:16px;line-height:1.65;color:#E2E8F0;}\n.jr-list{display:flex;flex-direction:column;border-top:1px solid rgba(214,230,255,0.16);}\n.jr-li{display:flex;gap:20px;align-items:flex-start;padding:20px 0;border-bottom:1px solid rgba(214,230,255,0.16);}\n.jr-li .jr-ln{flex-shrink:0;width:32px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.1em;color:#94A3B8;padding-top:4px;}\n.jr-li .jr-lt{font-size:17px;line-height:1.6;color:#F8FAFC;}\n.jr-chip{display:inline-flex;align-items:center;padding:8px 14px;border-radius:999px;border:1px solid rgba(214,230,255,0.24);font-size:14px;color:#E2E8F0;white-space:nowrap;}\n.jr-arrow{color:#64748B;}\n.jr-btn{height:56px;display:inline-flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:#F8FAFC;color:#1F2937 !important;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:18px;font-weight:600;cursor:pointer;border:none;transition:box-shadow .2s ease,opacity .2s ease;}\n.jr-btn:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.5);}\n.jr-btn.off{opacity:0.35;cursor:not-allowed;box-shadow:none;}\n.jr-ghost{height:56px;display:inline-flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:rgba(2,4,6,0.4);border:1px solid rgba(214,230,255,0.5);color:#F8FAFC;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:18px;font-weight:500;}\n.jr-ghost:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.2);color:#F8FAFC;}\n.jr-check{display:flex;align-items:flex-start;gap:14px;padding:18px 20px;border-radius:16px;border:1px solid rgba(214,230,255,0.18);background:rgba(214,230,255,0.03);cursor:pointer;text-align:left;color:#E2E8F0;font-family:'Noto Sans KR',sans-serif;font-size:16px;line-height:1.55;width:100%;transition:border-color .2s ease,background .2s ease;}\n.jr-check:hover{border-color:rgba(214,230,255,0.5);}\n.jr-check .jr-box{flex-shrink:0;width:22px;height:22px;margin-top:1px;border-radius:6px;border:1.5px solid rgba(214,230,255,0.5);display:flex;align-items:center;justify-content:center;color:transparent;font-size:14px;}\n.jr-check.on{border-color:rgba(214,230,255,0.7);background:rgba(214,230,255,0.08);}\n.jr-check.on .jr-box{background:#F8FAFC;border-color:#F8FAFC;color:#0B1118;}\n.jr-plan{display:flex;flex-direction:column;gap:10px;padding:28px;border-radius:20px;border:1px solid rgba(214,230,255,0.22);background:rgba(2,4,6,0.55);cursor:pointer;text-align:left;color:#F8FAFC;font-family:'Noto Sans KR',sans-serif;transition:border-color .2s ease,box-shadow .2s ease;}\n.jr-plan:hover{border-color:rgba(214,230,255,0.6);}\n.jr-plan.on{border-color:#D6E6FF;box-shadow:0 0 0 1px #D6E6FF,0 0 32px rgba(214,230,255,0.18);}\n.jr-radio{width:20px;height:20px;border-radius:50%;border:1.5px solid rgba(214,230,255,0.5);display:flex;align-items:center;justify-content:center;}\n.jr-plan.on .jr-radio::after{content:'';width:10px;height:10px;border-radius:50%;background:#F8FAFC;}\n.jr-input{height:52px;padding:0 18px;border-radius:12px;border:1px solid rgba(214,230,255,0.28);background:rgba(2,4,6,0.6);color:#F8FAFC;font-family:'Noto Sans KR',sans-serif;font-size:15px;outline:none;width:100%;}\n.jr-input:focus{border-color:#D6E6FF;box-shadow:0 0 0 3px rgba(214,230,255,0.15);}\n.jr-input::placeholder{color:#64748B;}\n.jr-toggle{width:52px;height:30px;border-radius:999px;border:1px solid rgba(214,230,255,0.4);background:rgba(214,230,255,0.06);position:relative;cursor:pointer;flex-shrink:0;transition:background .2s ease;}\n.jr-toggle::after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#94A3B8;transition:left .2s ease,background .2s ease;}\n.jr-toggle.on{background:rgba(214,230,255,0.25);border-color:#D6E6FF;}\n.jr-toggle.on::after{left:25px;background:#F8FAFC;}\n.jr-dot{width:8px;height:8px;border-radius:50%;background:#D6E6FF;box-shadow:0 0 10px rgba(214,230,255,0.8);flex-shrink:0;}\n.jr-flow{display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px;}\n.jr-pn{display:flex;flex-direction:column;gap:6px;padding:24px 28px;border-radius:20px;border:1px solid rgba(214,230,255,0.18);background:rgba(214,230,255,0.03);transition:border-color .2s ease;}\n.jr-pn:hover{border-color:rgba(214,230,255,0.6);}\n@media (max-width:860px){.jr-sep{display:none;}}\n.su-steps{display:flex;flex-wrap:wrap;align-items:center;gap:10px 0;}\n.su-field{display:flex;flex-direction:column;gap:8px;}\n.su-label{font-size:14px;color:#CBD5E1;}\n.su-req{color:#94A3B8;font-size:12px;margin-left:4px;}\n.su-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:14px;}\n.su-seg{display:inline-flex;padding:4px;border-radius:12px;border:1px solid rgba(214,230,255,0.22);background:rgba(2,4,6,0.5);gap:4px;}\n.su-seg button{height:40px;padding:0 18px;border-radius:9px;border:none;background:transparent;color:#94A3B8;font-family:'Noto Sans KR',sans-serif;font-size:15px;cursor:pointer;}\n.su-seg button.on{background:#F8FAFC;color:#0B1118;font-weight:700;}\n.su-back{height:56px;display:inline-flex;align-items:center;gap:8px;padding:0 20px;border-radius:14px;border:1px solid rgba(214,230,255,0.3);background:transparent;color:#CBD5E1;font-family:'Noto Sans KR',sans-serif;font-size:15px;cursor:pointer;}\n.su-nav{height:56px !important;padding:0 20px !important;font-family:'Noto Sans KR',sans-serif !important;font-size:15px !important;font-weight:700 !important;}\n.su-back:hover{border-color:rgba(214,230,255,0.7);color:#F8FAFC;}\n.su-sum{position:sticky;top:96px;}\n.su-badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:rgba(214,230,255,0.12);border:1px solid rgba(214,230,255,0.4);font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.08em;color:#D6E6FF;}\n.su-key{font-family:'IBM Plex Mono',monospace;font-size:20px;letter-spacing:0.12em;color:#F8FAFC;padding:14px 18px;border-radius:12px;border:1px dashed rgba(214,230,255,0.45);background:rgba(214,230,255,0.04);}\n.su-table{width:100%;border-collapse:collapse;font-size:15px;}\n.su-table th{text-align:left;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.1em;color:#94A3B8;font-weight:500;padding:0 0 12px;border-bottom:1px solid rgba(214,230,255,0.16);}\n.su-table td{padding:16px 0;border-bottom:1px solid rgba(214,230,255,0.12);color:#E2E8F0;}\n.su-danger{height:48px;display:inline-flex;align-items:center;padding:0 20px;border-radius:12px;border:1px solid rgba(248,113,113,0.5);background:transparent;color:#FCA5A5;font-family:'Noto Sans KR',sans-serif;font-size:15px;cursor:pointer;}\n.su-danger:hover{background:rgba(248,113,113,0.08);}\n.ft-links a{color:#CBD5E1;font-size:14px;}.ft-links a:hover{color:#F8FAFC;}\n.jr-input.bad{border-color:#F87171 !important;box-shadow:0 0 0 3px rgba(248,113,113,0.15);}\n.fe{font-size:13px;color:#FCA5A5;}\n.cs-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}\n.cs-more{background:none;border:none;padding:0 2px;color:#94A3B8;font-family:'Noto Sans KR',sans-serif;font-size:13px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;white-space:nowrap;}\n.cs-more:hover{color:#F8FAFC;}\n.cap{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;border-radius:12px;border:1px dashed rgba(214,230,255,0.35);background:rgba(214,230,255,0.03);}\n.cap.bad{border-color:#F87171;}\n.cap-box{width:24px;height:24px;border-radius:6px;border:1.5px solid rgba(214,230,255,0.6);display:flex;align-items:center;justify-content:center;font-size:14px;color:transparent;background:transparent;cursor:pointer;flex-shrink:0;}\n.cap-box.on{background:#F8FAFC;color:#0B1118;border-color:#F8FAFC;}\n.spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(11,17,24,0.25);border-top-color:#0B1118;animation:spin .8s linear infinite;}\n@keyframes spin{to{transform:rotate(360deg);}}\n.cs-modal{position:fixed;inset:0;z-index:60;display:flex;align-items:flex-start;justify-content:center;padding:120px 20px 20px;background:rgba(2,4,6,0.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}\n.cs-modal-in{width:min(560px,100%);display:flex;flex-direction:column;gap:18px;padding:32px;border-radius:24px;border:1px solid rgba(214,230,255,0.25);background:#0B1118;box-shadow:0 40px 100px rgba(0,0,0,0.6);}\n.cs-table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;}\n.cs-table th{width:30%;text-align:left;vertical-align:top;padding:12px 12px 12px 0;color:#94A3B8;font-weight:500;border-bottom:1px solid rgba(214,230,255,0.12);}\n.cs-table td{padding:12px 0;color:#E2E8F0;border-bottom:1px solid rgba(214,230,255,0.12);}\n.su-type.on{background:#F8FAFC !important;color:#0B1118 !important;border-color:#F8FAFC;font-weight:700;}\n.navpoc{height:38px;display:inline-flex;align-items:center;padding:0 18px;border-radius:10px;background:#F8FAFC;color:#0B1118 !important;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:700;white-space:nowrap;transition:box-shadow .2s ease;}\n.navpoc:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.35);color:#0B1118 !important;}\n.navlang{display:inline-flex;padding:3px;border-radius:10px;border:1px solid rgba(214,230,255,0.28);background:rgba(2,4,6,0.5);gap:2px;}\n.navlang a{height:30px;min-width:38px;display:inline-flex;align-items:center;justify-content:center;padding:0 10px;border-radius:7px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.06em;color:#94A3B8 !important;transition:background .2s ease,color .2s ease;}\n.navlang a:hover{color:#F8FAFC !important;}\n.navlang a.on{background:#F8FAFC;color:#0B1118 !important;font-weight:500;}\n.ck-bar{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;justify-content:center;padding:0 20px 20px;pointer-events:none;}\n.ck-card{pointer-events:auto;width:min(1040px,100%);display:flex;flex-wrap:wrap;align-items:center;gap:18px 28px;padding:22px 26px;border-radius:20px;border:1px solid rgba(214,230,255,0.24);background:rgba(11,17,24,0.94);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 24px 70px rgba(0,0,0,0.55);font-family:'Noto Sans KR',sans-serif;}\n.ck-btns{display:flex;flex-wrap:wrap;gap:10px;}\n.ck-b{height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 18px;border-radius:12px;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap;border:1px solid rgba(214,230,255,0.35);background:transparent;color:#E2E8F0;transition:border-color .2s,background .2s,box-shadow .2s;}\n.ck-b:hover{border-color:rgba(214,230,255,0.8);color:#F8FAFC;}\n.ck-b.pri{background:#F8FAFC;border-color:#F8FAFC;color:#0B1118;font-weight:700;}\n.ck-b.pri:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.3);color:#0B1118;}\n.ck-b.txt{border-color:transparent;color:#94A3B8;text-decoration:underline;text-underline-offset:3px;padding:0 6px;}\n.ck-b.txt:hover{color:#F8FAFC;}\n.ck-wrap{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(2,4,6,0.66);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:'Noto Sans KR',sans-serif;}\n.ck-panel{width:min(520px,100%);display:flex;flex-direction:column;gap:18px;padding:28px;border-radius:24px;border:1px solid rgba(214,230,255,0.28);background:#0B1118;box-shadow:0 40px 100px rgba(0,0,0,0.6);}\n.ck-row{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:16px 0;border-top:1px solid rgba(214,230,255,0.12);}\n.ck-tg{width:48px;height:28px;border-radius:999px;border:1px solid rgba(214,230,255,0.4);background:rgba(214,230,255,0.06);position:relative;cursor:pointer;flex-shrink:0;padding:0;transition:background .2s;}\n.ck-tg::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#94A3B8;transition:left .2s,background .2s;}\n.ck-tg.on{background:rgba(214,230,255,0.3);border-color:#D6E6FF;}\n.ck-tg.on::after{left:23px;background:#F8FAFC;}\n.ck-tg.lock{opacity:0.55;cursor:default;}\n.ft-ck{background:none;border:none;padding:0;cursor:pointer;font:inherit;text-align:left;color:#CBD5E1;}\n.ft-ck:hover{color:#F8FAFC;}\n.nv-m{display:none;align-items:center;gap:10px;}\n.nv-burger{width:42px;height:38px;border-radius:10px;border:1px solid rgba(214,230,255,0.3);background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;padding:0;}\n.nv-burger span{width:18px;height:1.5px;background:#F8FAFC;border-radius:2px;}\n.mn-wrap{position:fixed;inset:0;z-index:95;display:flex;flex-direction:column;background:#020406;overflow-y:auto;}\n.mn-top{display:flex;justify-content:space-between;align-items:center;min-height:64px;padding:12px 20px;border-bottom:1px solid rgba(214,230,255,0.14);}\n.mn-x{width:42px;height:38px;border-radius:10px;border:1px solid rgba(214,230,255,0.3);background:transparent;color:#F8FAFC;font-size:18px;cursor:pointer;}\n.mn-list{display:flex;flex-direction:column;padding:12px 20px;}\n.mn-list a.mi{display:flex;justify-content:space-between;align-items:center;height:60px;border-bottom:1px solid rgba(214,230,255,0.1);font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:24px;font-weight:500;color:#F8FAFC;}\n.mn-list a.mi span.ar{color:#64748B;font-size:18px;}\n.mn-foot{display:flex;flex-direction:column;gap:14px;padding:20px 20px 32px;margin-top:auto;}\n.mn-poc{height:54px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:#F8FAFC;color:#0B1118 !important;font-family:'Noto Sans KR',sans-serif;font-size:16px;font-weight:700;}\n@media (max-width:820px){nav .nv-links{display:none !important;}.nv-m{display:flex;}.nv-m .navpoc{height:36px;padding:0 14px;font-size:13px;}nav{min-height:64px !important;}}\n@media (max-width:820px){body{overflow-x:clip;}h1,h2,h3{max-width:100% !important;}h1,h2,h3{width:auto !important;}div[style*=\"span 2\"]{grid-column:auto !important;}section[style*=\"position\"]{max-width:100vw;}}\n"
        }
      </style>
      {"\n"}
      <div
        lang={"en"}
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
            href={"/en/"}
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
            <a href={"/en/#portfolio"} style={css("color:#F8FAFC;")}>
              {"Products"}
            </a>
            {"\n      "}
            <a
              href={"/en/#technology"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-1"}
            >
              {"Technology"}
            </a>
            {"\n      "}
            <a
              href={"/en/#why"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-2"}
            >
              {"Company"}
            </a>
            {"\n      "}
            <a
              className={"askx reference-hover-3"}
              href={"/en/#ask-chat"}
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
            <a className={"navpoc"} href={"/en/poc"}>
              {"Request a PoC"}
            </a>
            {"\n      "}
            <span className={"navlang"} role={"group"} aria-label={"Language"}>
              <a className={""} href={"/contact"} lang={"ko"}>
                {"KO"}
              </a>
              <a className={"on"} href={"/en/contact"} lang={"en"}>
                {"EN"}
              </a>
            </span>
            {"\n    "}
          </div>
          {"\n    "}
          <div className={"nv-m"}>
            <a className={"navpoc"} href={"/en/poc"}>
              {"Request a PoC"}
            </a>
            <button
              className={"nv-burger"}
              onClick={mnOpen}
              aria-label={"Open menu"}
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
            "padding:clamp(48px,6vw,88px) clamp(20px,6vw,80px) clamp(64px,8vw,112px);background:radial-gradient(60% 60% at 90% 0%, rgba(120,160,175,0.14) 0%, rgba(2,4,6,0) 70%), #020406;",
          )}
        >
          {"\n    "}
          <div
            style={css(
              "max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:40px;",
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
                {"CONTACT"}
              </span>
              <h1
                style={css(
                  "margin:0;font-size:clamp(34px,3.6vw,48px);font-weight:700;line-height:1.2;color:#F8FAFC;",
                )}
              >
                {"How can we help?"}
              </h1>
              <p
                style={css(
                  "margin:0;font-size:17px;line-height:1.7;color:#CBD5E1;",
                )}
              >
                {
                  "Send us your questions about the product, installation or anything else. We’ll reply by email within 2 business days."
                }
              </p>
            </div>
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-wrap:wrap;align-items:flex-start;gap:24px;",
              )}
            >
              {"\n        "}
              <div style={css("flex:999 1 560px;min-width:0;")}>
                {"\n          "}
                <div
                  className={"jr-card"}
                  style={css("gap:20px;padding:32px;")}
                >
                  {"\n            "}
                  <div
                    style={css("display:flex;flex-direction:column;gap:8px;")}
                  >
                    <span className={"jr-k"}>{"GENERAL INQUIRY"}</span>
                    <span
                      style={css(
                        "font-size:24px;font-weight:700;color:#F8FAFC;",
                      )}
                    >
                      {"General inquiry"}
                    </span>
                    <span style={css("font-size:15px;color:#94A3B8;")}>
                      {"We’ll reply by email within 2 business days."}
                    </span>
                  </div>
                  {"\n            "}
                  {notSent && (
                    <>
                      {"\n              "}
                      <div
                        style={css(
                          "display:flex;flex-direction:column;gap:16px;",
                        )}
                      >
                        {"\n                "}
                        <div className={"su-field"}>
                          <span className={"su-label"}>
                            {"Topic"}
                            <span className={"su-req"}>{"Optional"}</span>
                          </span>
                          <div
                            style={css("display:flex;flex-wrap:wrap;gap:8px;")}
                          >
                            <button
                              className={`jr-chip su-type ${ty0}`}
                              onClick={set_ty0}
                              style={css(
                                "cursor:pointer;background:transparent;font-family:'Noto Sans KR',sans-serif;",
                              )}
                            >
                              {"Product · install"}
                            </button>
                            <button
                              className={`jr-chip su-type ${ty1}`}
                              onClick={set_ty1}
                              style={css(
                                "cursor:pointer;background:transparent;font-family:'Noto Sans KR',sans-serif;",
                              )}
                            >
                              {"PoC"}
                            </button>
                            <button
                              className={`jr-chip su-type ${ty2}`}
                              onClick={set_ty2}
                              style={css(
                                "cursor:pointer;background:transparent;font-family:'Noto Sans KR',sans-serif;",
                              )}
                            >
                              {"Technology"}
                            </button>
                            <button
                              className={`jr-chip su-type ${ty3}`}
                              onClick={set_ty3}
                              style={css(
                                "cursor:pointer;background:transparent;font-family:'Noto Sans KR',sans-serif;",
                              )}
                            >
                              {"Other"}
                            </button>
                          </div>
                        </div>
                        {"\n                "}
                        <div className={"su-row"}>
                          <label className={"su-field"}>
                            <span className={"su-label"}>
                              {"Name"}
                              <span className={"su-req"}>{"Required"}</span>
                            </span>
                            <input
                              className={`jr-input ${ec_name}`}
                              type={"text"}
                              placeholder={""}
                              value={v_name}
                              onChange={in_name}
                              aria-label={"Name"}
                            />
                            {e_name && (
                              <>
                                <span className={"fe"}>{e_name}</span>
                              </>
                            )}
                          </label>
                          <label className={"su-field"}>
                            <span className={"su-label"}>
                              {"Email"}
                              <span className={"su-req"}>{"Required"}</span>
                            </span>
                            <input
                              className={`jr-input ${ec_email}`}
                              type={"email"}
                              placeholder={"name@company.com"}
                              value={v_email}
                              onChange={in_email}
                              aria-label={"Email"}
                            />
                            {e_email && (
                              <>
                                <span className={"fe"}>{e_email}</span>
                              </>
                            )}
                          </label>
                        </div>
                        {"\n                "}
                        <label className={"su-field"}>
                          <span className={"su-label"}>
                            {"Company"}
                            <span className={"su-req"}>{"Optional"}</span>
                          </span>
                          <input
                            className={`jr-input ${ec_company}`}
                            type={"text"}
                            placeholder={""}
                            value={v_company}
                            onChange={in_company}
                            aria-label={"Company"}
                          />
                        </label>
                        {"\n                "}
                        <label className={"su-field"}>
                          <span className={"su-label"}>
                            {"Message"}
                            <span className={"su-req"}>{"Required"}</span>
                          </span>
                          <textarea
                            className={`jr-input ${ec_msg}`}
                            rows={"5"}
                            placeholder={"Tell us what you need help with."}
                            value={v_msg}
                            onChange={in_msg}
                            aria-label={"Message"}
                            style={css(
                              "height:auto;padding:14px 18px;resize:vertical;line-height:1.6;",
                            )}
                          ></textarea>
                          {e_msg && (
                            <>
                              <span className={"fe"}>{e_msg}</span>
                            </>
                          )}
                        </label>
                        {"\n                "}
                        <div
                          style={css(
                            "display:flex;flex-direction:column;gap:8px;",
                          )}
                        >
                          {"\n                  "}
                          <div className={"cs-row"}>
                            <button
                              className={`jr-check ${privOn}`}
                              onClick={tgPriv}
                              style={css("flex:1 1 auto;width:auto;")}
                            >
                              <span className={"jr-box"}>{"✓"}</span>
                              <span>
                                {
                                  "[Required] I agree to the collection and use of personal information to answer my inquiry."
                                }
                              </span>
                            </button>
                            <button className={"cs-more"} onClick={openPriv}>
                              {"Details"}
                            </button>
                          </div>
                          {"\n                  "}
                          {e_priv && (
                            <>
                              <span className={"fe"}>{e_priv}</span>
                            </>
                          )}
                          {"\n                  \n                "}
                        </div>
                        {"\n                "}
                        <div
                          style={css(
                            "display:flex;flex-direction:column;gap:6px;",
                          )}
                        >
                          {"\n                  "}
                          <Captcha
                            onToken={values.onCaptcha}
                            language={values.language}
                          />
                          {"\n                  "}
                          {e_cap && (
                            <>
                              <span className={"fe"}>{e_cap}</span>
                            </>
                          )}
                          {"\n                "}
                        </div>
                        {"\n                "}
                        {isIdle && (
                          <>
                            <button
                              className={"jr-btn"}
                              onClick={send}
                              style={css("align-self:flex-start;")}
                            >
                              {"Send inquiry "}
                              <span>{"→"}</span>
                            </button>
                          </>
                        )}
                        {"\n                "}
                        {isSending && (
                          <>
                            <button
                              className={"jr-btn off"}
                              disabled={"disabled"}
                              style={css(
                                "align-self:flex-start;cursor:progress;",
                              )}
                            >
                              <span className={"spin"}></span>
                              {"Sending…"}
                            </button>
                          </>
                        )}
                        {"\n                "}
                        {isFailed && (
                          <>
                            <div
                              style={css(
                                "display:flex;flex-direction:column;gap:12px;padding:18px 20px;border-radius:14px;border:1px solid rgba(248,113,113,0.5);background:rgba(248,113,113,0.06);",
                              )}
                            >
                              <span
                                style={css(
                                  "font-size:16px;font-weight:700;color:#FCA5A5;",
                                )}
                              >
                                {"Couldn’t send"}
                              </span>
                              <span
                                style={css(
                                  "font-size:14px;line-height:1.6;color:#E2E8F0;",
                                )}
                              >
                                {
                                  "A network problem stopped us from sending your request. Please try again shortly or email admin@itrix.co.kr."
                                }
                              </span>
                              <button
                                className={"su-back"}
                                onClick={send}
                                style={css(
                                  "align-self:flex-start;height:44px;",
                                )}
                              >
                                {"Try again"}
                              </button>
                            </div>
                          </>
                        )}
                        {"\n              "}
                      </div>
                      {"\n            "}
                    </>
                  )}
                  {"\n            "}
                  {isSent && (
                    <>
                      {"\n              "}
                      <div
                        style={css(
                          "display:flex;flex-direction:column;gap:14px;padding:24px;border-radius:16px;border:1px solid rgba(214,230,255,0.4);background:rgba(214,230,255,0.06);",
                        )}
                      >
                        <span
                          style={css(
                            "display:flex;align-items:center;gap:10px;font-size:20px;font-weight:700;color:#F8FAFC;",
                          )}
                        >
                          <span className={"jr-dot"}></span>
                          {"Inquiry received"}
                        </span>
                        <span
                          style={css(
                            "font-size:15px;line-height:1.6;color:#CBD5E1;",
                          )}
                        >
                          {"We’ll reply to your email within 2 business days."}
                        </span>
                        <button
                          className={"su-back"}
                          onClick={again}
                          style={css("align-self:flex-start;height:44px;")}
                        >
                          {"Write a new inquiry"}
                        </button>
                      </div>
                      {"\n            "}
                    </>
                  )}
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "flex:1 1 320px;max-width:400px;min-width:0;display:flex;flex-direction:column;gap:16px;",
                )}
              >
                {"\n          "}
                <a
                  href={"/en/poc"}
                  className={"jr-pn"}
                  style={css(
                    "gap:10px;padding:28px;border-color:rgba(214,230,255,0.45);background:rgba(214,230,255,0.06);",
                  )}
                >
                  <span className={"jr-k"}>{"PoC"}</span>
                  <span
                    style={css("font-size:20px;font-weight:700;color:#F8FAFC;")}
                  >
                    {"Request a PoC"}
                  </span>
                  <span
                    style={css("font-size:14px;line-height:1.6;color:#94A3B8;")}
                  >
                    {
                      "Want to validate ASTOP on your own workload? Send us a PoC request."
                    }
                  </span>
                  <span
                    style={css("font-size:15px;font-weight:500;color:#F8FAFC;")}
                  >
                    {"Request a PoC →"}
                  </span>
                </a>
                {"\n          "}
                <a
                  href={"/en/partnership"}
                  className={"jr-pn"}
                  style={css("gap:10px;padding:28px;")}
                >
                  <span className={"jr-k"}>{"PARTNERSHIP"}</span>
                  <span
                    style={css("font-size:20px;font-weight:700;color:#F8FAFC;")}
                  >
                    {"Partnership · large-scale adoption"}
                  </span>
                  <span
                    style={css("font-size:14px;line-height:1.6;color:#94A3B8;")}
                  >
                    {
                      "For joint validation, Technical Validation, Licensing or large-organization adoption, contact us through Partnership."
                    }
                  </span>
                  <span
                    style={css("font-size:15px;font-weight:500;color:#F8FAFC;")}
                  >
                    {"Partnership inquiry →"}
                  </span>
                </a>
                {"\n          "}
                <div className={"jr-card"} style={css("gap:18px;")}>
                  <div
                    style={css("display:flex;flex-direction:column;gap:6px;")}
                  >
                    <span className={"jr-k"}>{"EMAIL"}</span>
                    <a
                      href={"mailto:admin@itrix.co.kr"}
                      style={css("font-size:17px;")}
                    >
                      {"admin@itrix.co.kr"}
                    </a>
                  </div>
                  <div
                    style={css("display:flex;flex-direction:column;gap:6px;")}
                  >
                    <span className={"jr-k"}>{"OFFICE"}</span>
                    <span
                      style={css(
                        "font-size:15px;line-height:1.5;color:#E2E8F0;",
                      )}
                    >
                      {"611, 19 Hyoryeong-ro 55-gil, Seocho-gu, Seoul"}
                    </span>
                  </div>
                </div>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n    "}
          {mPriv && (
            <>
              {"\n      "}
              <div className={"cs-modal"} role={"dialog"} aria-modal={"true"}>
                <div className={"cs-modal-in"}>
                  {"\n        "}
                  <div
                    style={css(
                      "display:flex;justify-content:space-between;gap:12px;align-items:flex-start;",
                    )}
                  >
                    <span
                      style={css(
                        "font-size:20px;font-weight:700;line-height:1.35;color:#F8FAFC;",
                      )}
                    >
                      {
                        "Consent to collection and use of personal information (required)"
                      }
                    </span>
                    <button
                      onClick={closeM}
                      aria-label={"Close"}
                      style={css(
                        "border:none;background:transparent;color:#94A3B8;font-size:22px;cursor:pointer;line-height:1;",
                      )}
                    >
                      {"✕"}
                    </button>
                  </div>
                  {"\n        "}
                  <table className={"cs-table"}>
                    <tbody>
                      <tr>
                        <th scope={"row"}>{"Items collected"}</th>
                        <td>
                          {"Required: name, email, message"}
                          <br />
                          {"Optional: company, topic"}
                        </td>
                      </tr>
                      <tr>
                        <th scope={"row"}>{"Purpose"}</th>
                        <td>{"Reviewing and answering your inquiry"}</td>
                      </tr>
                      <tr>
                        <th scope={"row"}>{"Retention"}</th>
                        <td>
                          {
                            "Kept for [1 year] after we reply, then deleted (longer where required by law)"
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {"\n        "}
                  <span
                    style={css("font-size:13px;line-height:1.6;color:#94A3B8;")}
                  >
                    {
                      "You may decline, but submitting an inquiry will not be possible without it."
                    }
                  </span>
                  {"\n        "}
                  <button
                    className={"jr-btn"}
                    onClick={agreePriv}
                    style={css(
                      "justify-content:center;height:48px;font-size:16px;",
                    )}
                  >
                    {"OK"}
                  </button>
                  {"\n      "}
                </div>
              </div>
              {"\n    "}
            </>
          )}
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
              <a href={"/en/"}>
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
                <a href={"/en/contact"}>{"Contact"}</a>
                <a href={"/en/poc"}>{"Request a PoC"}</a>
                <a href={"/en/privacy"}>{"Privacy Policy"}</a>
                <a href={"/en/terms"}>{"Terms of Use"}</a>
                <button
                  className={"ft-ck"}
                  onClick={ckOpen}
                  style={css("font-size:14px;")}
                >
                  {"Cookie settings"}
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
                <span>{"[Legal entity name]"}</span>
                <span>{"CEO Myungjoo Kang"}</span>
                <span>{"Business Reg. No. [000-00-00000]"}</span>
                <span>{"611, 19 Hyoryeong-ro 55-gil, Seocho-gu, Seoul"}</span>
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
              aria-label={"We use cookies"}
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
                    {"We use cookies"}
                  </span>
                  {"\n        "}
                  <span
                    style={css(
                      "font-size:14px;line-height:1.65;color:#CBD5E1;",
                    )}
                  >
                    {
                      "itriX uses cookies that the site needs to work and, only with your consent, analytics cookies for visit statistics. Learn more in our "
                    }
                    <a
                      href={"/en/privacy#s9"}
                      style={css(
                        "color:#D6E6FF;text-decoration:underline;text-underline-offset:3px;",
                      )}
                    >
                      {"Privacy Policy"}
                    </a>
                    {"."}
                  </span>
                  {"\n      "}
                </div>
                {"\n      "}
                <div className={"ck-btns"}>
                  <button className={"ck-b txt"} onClick={ckOpen}>
                    {"Cookie settings"}
                  </button>
                  <button className={"ck-b"} onClick={ckNec}>
                    {"Necessary only"}
                  </button>
                  <button className={"ck-b pri"} onClick={ckAll}>
                    {"Accept all"}
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
              aria-label={"Cookie settings"}
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
                      {"Cookie settings"}
                    </span>
                  </div>
                  <button
                    className={"ck-b txt"}
                    onClick={ckClose}
                    aria-label={"Close"}
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
                    "Choose which cookies we may use. You can change this any time under “Cookie settings” at the bottom of the site."
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
                        {"Necessary cookies "}
                        <span
                          style={css(
                            "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:11px;letter-spacing:0.06em;color:#94A3B8;font-weight:400;margin-left:6px;",
                          )}
                        >
                          {"Always on"}
                        </span>
                      </span>
                      <span
                        style={css(
                          "font-size:13px;line-height:1.6;color:#94A3B8;",
                        )}
                      >
                        {
                          "Keep basic features working, such as your language, popup display and cookie choice."
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
                        {"Analytics cookies"}
                      </span>
                      <span
                        style={css(
                          "font-size:13px;line-height:1.6;color:#94A3B8;",
                        )}
                      >
                        {
                          "Collect statistics such as visits, page usage and referral sources to improve the site."
                        }
                      </span>
                    </div>
                    <button
                      className={`ck-tg ${ckAnaOn}`}
                      onClick={ckTgAna}
                      aria-label={"Analytics cookies"}
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
                    {"Save choices"}
                  </button>
                  <button className={"ck-b pri"} onClick={ckAll}>
                    {"Accept all"}
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
                <a href={"/en/"} onClick={mnClose}>
                  <img
                    src={"/brand/itrix-logo-inverse.svg"}
                    alt={"itriX"}
                    style={css("width:104px;height:auto;display:block;")}
                  />
                </a>
                <button
                  className={"mn-x"}
                  onClick={mnClose}
                  aria-label={"Close menu"}
                >
                  {"✕"}
                </button>
              </div>
              {"\n      "}
              <div className={"mn-list"}>
                {"\n        "}
                <a className={"mi"} href={"/en/#portfolio"} onClick={mnClose}>
                  {"Products "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"/en/#technology"} onClick={mnClose}>
                  {"Technology "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"/en/#why"} onClick={mnClose}>
                  {"Company "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"/en/#ask-chat"} onClick={mnClose}>
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
                <a className={"mi"} href={"/en/contact"} onClick={mnClose}>
                  {"Contact "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n      "}
              </div>
              {"\n      "}
              <div className={"mn-foot"}>
                <a className={"mn-poc"} href={"/en/poc"} onClick={mnClose}>
                  {"Request a PoC →"}
                </a>
                <div>
                  <span
                    className={"navlang"}
                    role={"group"}
                    aria-label={"Language"}
                  >
                    <a className={""} href={"/contact"} lang={"ko"}>
                      {"KO"}
                    </a>
                    <a className={"on"} href={"/en/contact"} lang={"en"}>
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
