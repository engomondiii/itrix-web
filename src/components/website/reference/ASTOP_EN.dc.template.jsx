"use client";
import { FooterLinks } from "../FooterLinks";
import { FORM_LINKS } from "../formLinks";
import EmptyCalls from "../EmptyCalls";
// Converted from the supplied October 16 design; production state is supplied separately.
import React from "react";
import { StoreRoutes } from "../StoreRoutes";
import { css, AskX, NoticePopup, Captcha } from "./reference-style";
export function Template(values) {
  const {
    askAstop,
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
          ".reference-hover-1:hover{color:#F8FAFC;}\n.reference-hover-2:hover{color:#F8FAFC;}\n.reference-hover-3:hover{color:#F8FAFC;}\n.reference-hover-4:hover{color:#CBD5E1;}\n.reference-hover-5:hover{color:#1F2937;box-shadow:0 0 0 4px rgba(214,230,255,0.64);}\n.reference-hover-6:hover{color:#F8FAFC;box-shadow:0 0 0 4px rgba(214,230,255,0.3);}\n\nhtml,body{margin:0;padding:0;background:#020406;-webkit-font-smoothing:antialiased;word-break:keep-all;overflow-wrap:break-word;scroll-behavior:smooth;}\n*{box-sizing:border-box;}\na{color:#F8FAFC;text-decoration:none;}\na:hover{color:#D6E6FF;}\n.price-card{transition:border-color .2s ease,box-shadow .2s ease;}\n.price-card .price-label{transition:color .2s ease;}\n.price-card:hover{border-color:#D6E6FF !important;box-shadow:0 0 0 1px #D6E6FF;}\n.price-card:hover .price-label{color:#D6E6FF !important;}\n\n@keyframes astop-slow{\n0.00%{left:0%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n2.54%{left:5%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n4.82%{left:5%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n7.11%{left:5%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n11.68%{left:14%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n13.96%{left:14%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n16.24%{left:14%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n20.81%{left:23%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n23.10%{left:23%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n25.38%{left:23%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n29.95%{left:32%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n32.23%{left:32%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n34.52%{left:32%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n39.09%{left:41%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n41.37%{left:41%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n43.66%{left:41%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n48.22%{left:50%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n50.51%{left:50%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n52.79%{left:50%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n57.36%{left:59%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n59.65%{left:59%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n61.93%{left:59%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n66.50%{left:68%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n68.78%{left:68%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n71.07%{left:68%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n75.64%{left:77%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n77.92%{left:77%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n80.20%{left:77%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n84.77%{left:86%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n87.06%{left:86%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n89.34%{left:86%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n96.45%{left:100%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n98.6%{left:100%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}99.7%{left:100%;opacity:0;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}100%{left:0%;opacity:0;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}}\n@keyframes astop-fast{\n0.00%{left:0%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n23.94%{left:70%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n30.92%{left:70%;opacity:1;box-shadow:0 0 0 14px rgba(214,230,255,0.10),0 0 28px rgba(214,230,255,0.95);}\n37.91%{left:70%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n48.17%{left:100%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}\n98.6%{left:100%;opacity:1;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}99.7%{left:100%;opacity:0;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}100%{left:0%;opacity:0;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);}}\n@keyframes astop-slow-fill{\n0.00%{width:0%;opacity:1;}\n2.54%{width:5%;opacity:1;}\n4.82%{width:5%;opacity:1;}\n7.11%{width:5%;opacity:1;}\n11.68%{width:14%;opacity:1;}\n13.96%{width:14%;opacity:1;}\n16.24%{width:14%;opacity:1;}\n20.81%{width:23%;opacity:1;}\n23.10%{width:23%;opacity:1;}\n25.38%{width:23%;opacity:1;}\n29.95%{width:32%;opacity:1;}\n32.23%{width:32%;opacity:1;}\n34.52%{width:32%;opacity:1;}\n39.09%{width:41%;opacity:1;}\n41.37%{width:41%;opacity:1;}\n43.66%{width:41%;opacity:1;}\n48.22%{width:50%;opacity:1;}\n50.51%{width:50%;opacity:1;}\n52.79%{width:50%;opacity:1;}\n57.36%{width:59%;opacity:1;}\n59.65%{width:59%;opacity:1;}\n61.93%{width:59%;opacity:1;}\n66.50%{width:68%;opacity:1;}\n68.78%{width:68%;opacity:1;}\n71.07%{width:68%;opacity:1;}\n75.64%{width:77%;opacity:1;}\n77.92%{width:77%;opacity:1;}\n80.20%{width:77%;opacity:1;}\n84.77%{width:86%;opacity:1;}\n87.06%{width:86%;opacity:1;}\n89.34%{width:86%;opacity:1;}\n96.45%{width:100%;opacity:1;}\n98.6%{width:100%;opacity:1;}99.7%{width:100%;opacity:0;}100%{width:0%;opacity:0;}}\n@keyframes astop-fast-fill{\n0.00%{width:0%;opacity:1;}\n23.94%{width:70%;opacity:1;}\n30.92%{width:70%;opacity:1;}\n37.91%{width:70%;opacity:1;}\n48.17%{width:100%;opacity:1;}\n98.6%{width:100%;opacity:1;}99.7%{width:100%;opacity:0;}100%{width:0%;opacity:0;}}\n@keyframes tick-flash{0%{background:#F8FAFC;box-shadow:0 0 12px rgba(214,230,255,0.9);transform:scaleY(1.45);}4%{background:rgba(214,230,255,0.75);box-shadow:none;transform:scaleY(1);}100%{background:rgba(214,230,255,0.35);box-shadow:none;transform:scaleY(1);}}\n@keyframes event-pulse{0%{transform:scale(1.7);box-shadow:0 0 0 14px rgba(214,230,255,0.12),0 0 36px rgba(214,230,255,1);}12%{transform:scale(1);box-shadow:0 0 0 6px rgba(214,230,255,0.16),0 0 24px rgba(214,230,255,0.5);}100%{transform:scale(1);box-shadow:0 0 0 6px rgba(214,230,255,0.16),0 0 24px rgba(214,230,255,0.5);}}\n@keyframes label-pop{0%{transform:translateX(-50%) translateY(-4px);box-shadow:0 0 24px rgba(214,230,255,0.8);}12%,100%{transform:translateX(-50%) translateY(0);box-shadow:none;}}\n@keyframes end-fast{0.00%{background:#3B82F6;border-color:#60A5FA;box-shadow:0 0 0 6px rgba(59,130,246,0.22),0 0 22px rgba(59,130,246,0.95);}3.25%{background:transparent;border-color:rgba(214,230,255,0.45);box-shadow:none;}5.92%{background:#3B82F6;border-color:#60A5FA;box-shadow:0 0 0 6px rgba(59,130,246,0.22),0 0 22px rgba(59,130,246,0.95);}9.17%{background:transparent;border-color:rgba(214,230,255,0.45);box-shadow:none;}11.83%{background:#3B82F6;border-color:#60A5FA;box-shadow:0 0 0 6px rgba(59,130,246,0.22),0 0 22px rgba(59,130,246,0.95);}15.09%{background:transparent;border-color:rgba(214,230,255,0.45);box-shadow:none;}17.75%{background:#3B82F6;border-color:#60A5FA;box-shadow:0 0 0 6px rgba(59,130,246,0.22),0 0 22px rgba(59,130,246,0.95);}21.01%{background:transparent;border-color:rgba(214,230,255,0.45);box-shadow:none;}23.67%{background:#3B82F6;border-color:#60A5FA;box-shadow:0 0 0 6px rgba(59,130,246,0.22),0 0 22px rgba(59,130,246,0.95);}26.92%{background:transparent;border-color:rgba(214,230,255,0.45);box-shadow:none;}29.59%{background:#3B82F6;border-color:#60A5FA;box-shadow:0 0 0 6px rgba(59,130,246,0.22),0 0 22px rgba(59,130,246,0.95);}32.84%{background:transparent;border-color:rgba(214,230,255,0.45);box-shadow:none;}35.50%{background:#3B82F6;border-color:#60A5FA;box-shadow:0 0 0 6px rgba(59,130,246,0.22),0 0 22px rgba(59,130,246,0.95);}51.23%{background:#3B82F6;border-color:#60A5FA;box-shadow:0 0 0 6px rgba(59,130,246,0.22),0 0 22px rgba(59,130,246,0.95);}51.83%,100%{background:transparent;border-color:rgba(214,230,255,0.45);box-shadow:none;}}\n.lane-dot{position:absolute;z-index:3;left:0;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#F8FAFC;box-shadow:0 0 0 4px rgba(214,230,255,0.18),0 0 20px rgba(214,230,255,0.8);animation-duration:8.45s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;}\n.lane-dot.slow{animation-name:astop-slow;}.lane-dot.fast{animation-name:astop-fast;}\n.lane-fill{position:absolute;z-index:1;left:0;top:50%;height:2px;margin-top:-1px;width:0;background:linear-gradient(90deg,rgba(214,230,255,0) 0%,rgba(214,230,255,0.85) 100%);animation-duration:8.45s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;}\n.lane-fill.slow{animation-name:astop-slow-fill;}.lane-fill.fast{animation-name:astop-fast-fill;}\n.lane-tick{position:absolute;z-index:2;top:50%;width:2px;height:26px;margin:-13px 0 0 -1px;border-radius:1px;background:rgba(214,230,255,0.35);animation:tick-flash 8.45s linear infinite;}\n.lane-event{animation:event-pulse 8.45s ease-out infinite;animation-delay:2.02s;}\n.lane-label{animation:label-pop 8.45s ease-out infinite;animation-delay:2.02s;}\n.lane-end{position:absolute;z-index:2;left:100%;top:50%;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;border:1.5px solid rgba(214,230,255,0.45);background:transparent;animation-duration:8.45s;animation-timing-function:steps(1,end);animation-iteration-count:infinite;}\n.lane-end.slow{animation:none;}.lane-end.fast{animation-name:end-fast;animation-delay:4.07s;}\n@media (prefers-reduced-motion: reduce){.lane-dot,.lane-fill,.lane-tick,.lane-event,.lane-label,.lane-end{animation:none;}.lane-dot{left:100%;}.lane-fill{width:100%;}.lane-end.fast{background:#3B82F6;border-color:#60A5FA;}}\n.lane-call{position:absolute;top:50%;transform:translate(-50%,18px);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:11px;letter-spacing:0.04em;color:#94A3B8;white-space:nowrap;pointer-events:none;}\n.lane-token{position:absolute;z-index:3;top:50%;opacity:0;transform:translate(-50%,-34px);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:11px;font-weight:600;letter-spacing:0.02em;color:#D6E6FF;text-shadow:0 0 10px rgba(214,230,255,0.8);white-space:nowrap;pointer-events:none;animation:token-float 8.45s ease-out infinite;}\n@keyframes token-float{0%{opacity:0;transform:translate(-50%,-34px) scale(0.9);}2%{opacity:1;transform:translate(-50%,-34px) scale(1);}9%{opacity:1;transform:translate(-50%,-34px) scale(1);}13%{opacity:0;transform:translate(-50%,-34px) scale(1);}100%{opacity:0;transform:translate(-50%,-34px) scale(1);}}\n.lane-token.side{transform:translate(14px,-50%);animation-name:token-side;}\n@keyframes token-side{0%{opacity:0;transform:translate(14px,-50%);}3%{opacity:1;transform:translate(18px,-50%);}14%{opacity:0;transform:translate(36px,-50%);}100%{opacity:0;transform:translate(36px,-50%);}}\n.lane-idle{position:absolute;top:50%;transform:translate(-50%,18px);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:11px;letter-spacing:0.06em;color:#64748B;white-space:nowrap;pointer-events:none;}\n.lane-result{position:absolute;top:50%;transform:translate(-50%,18px);font-size:12px;font-weight:700;color:#E2E8F0;white-space:nowrap;pointer-events:none;}\n@media (prefers-reduced-motion: reduce){.lane-token{display:none;}}\n.stat-glow{position:relative;overflow:hidden;isolation:isolate;border-color:rgba(234,242,255,0.32) !important;background:radial-gradient(90% 140% at 0% 0%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%), linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0) 60%), rgba(4,8,12,0.5) !important;animation:stat-halo 8s ease-in-out infinite;}\n.stat-glow::before{content:'';position:absolute;inset:0;z-index:2;border-radius:inherit;pointer-events:none;background:linear-gradient(105deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.10) 44%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.10) 56%, rgba(255,255,255,0) 65%);background-size:260% 100%;background-repeat:no-repeat;mix-blend-mode:screen;background-position:130% 0;}\n.stat-glow::after{content:'';position:absolute;inset:0;z-index:2;border-radius:inherit;pointer-events:none;box-shadow:inset 0 1px 0 rgba(234,242,255,0.30), inset 0 0 0 1px rgba(255,255,255,0.06);}\n@keyframes stat-sweep{0%{background-position:130% 0;}65%,100%{background-position:-30% 0;}}\n.stat-glow.is-in::before,.stat-glow.is-in .stat-num{animation:stat-sweep 5s cubic-bezier(.45,0,.25,1) 0s infinite both;}\n@keyframes stat-halo{0%,100%{box-shadow:0 0 0 1px rgba(255,255,255,0.06), 0 0 40px rgba(255,255,255,0.06), 0 24px 60px rgba(0,0,0,0.4);}50%{box-shadow:0 0 0 1px rgba(255,255,255,0.14), 0 0 80px rgba(255,255,255,0.16), 0 24px 60px rgba(0,0,0,0.4);}}\n.stat-num{background:linear-gradient(105deg, #E2E8F0 0%, #F1F5F9 35%, #FFFFFF 47%, #FFFFFF 53%, #F1F5F9 65%, #E2E8F0 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent !important;font-size:clamp(64px,7vw,96px) !important;font-weight:700 !important;background-position:130% 0;filter:drop-shadow(0 0 22px rgba(255,255,255,0.35));}\n@media (prefers-reduced-motion: reduce){.stat-glow,.stat-glow::before,.stat-num{animation:none;}}\n.askx img{transition:opacity .2s ease;}.askx:hover img{opacity:0.78;}\n.su-badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;background:rgba(214,230,255,0.12);border:1px solid rgba(214,230,255,0.4);font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.08em;color:#D6E6FF;}\n@keyframes hbGlow{0%,100%{box-shadow:0 0 0 0 rgba(214,230,255,0);}12%{box-shadow:0 0 0 3px rgba(214,230,255,0.45),0 0 22px rgba(214,230,255,0.28);}26%{box-shadow:0 0 0 0 rgba(214,230,255,0);}}\n.hb{animation:hbGlow 7s ease-in-out infinite;}\n.hb2{animation-delay:1.2s;}.hb3{animation-delay:2.4s;}\n.hb:hover{animation:none;}\n@media (prefers-reduced-motion:reduce){.hb{animation:none;}}\n.navlogin{height:38px;display:inline-flex;align-items:center;padding:0 16px;border-radius:10px;border:1px solid rgba(214,230,255,0.4);color:#F8FAFC !important;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:500;white-space:nowrap;transition:background .2s ease,border-color .2s ease;}\n.navlogin:hover{background:rgba(214,230,255,0.08);border-color:rgba(214,230,255,0.8);}\n.navlang{display:inline-flex;padding:3px;border-radius:10px;border:1px solid rgba(214,230,255,0.28);background:rgba(2,4,6,0.5);gap:2px;}\n.navlang a{height:30px;min-width:38px;display:inline-flex;align-items:center;justify-content:center;padding:0 10px;border-radius:7px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.06em;color:#94A3B8 !important;transition:background .2s ease,color .2s ease;}\n.navlang a:hover{color:#F8FAFC !important;}\n.navlang a.on{background:#F8FAFC;color:#0B1118 !important;font-weight:500;}\n.navpoc{height:38px;display:inline-flex;align-items:center;padding:0 18px;border-radius:10px;background:#F8FAFC;color:#0B1118 !important;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:700;white-space:nowrap;transition:box-shadow .2s ease;}\n.navpoc:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.35);color:#0B1118 !important;}\n.ft-links a{color:#CBD5E1;font-size:14px;}.ft-links a:hover{color:#F8FAFC;}\n.ck-bar{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;justify-content:center;padding:0 20px 20px;pointer-events:none;}\n.ck-card{pointer-events:auto;width:min(1040px,100%);display:flex;flex-wrap:wrap;align-items:center;gap:18px 28px;padding:22px 26px;border-radius:20px;border:1px solid rgba(214,230,255,0.24);background:rgba(11,17,24,0.94);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 24px 70px rgba(0,0,0,0.55);font-family:'Noto Sans KR',sans-serif;}\n.ck-btns{display:flex;flex-wrap:wrap;gap:10px;}\n.ck-b{height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 18px;border-radius:12px;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap;border:1px solid rgba(214,230,255,0.35);background:transparent;color:#E2E8F0;transition:border-color .2s,background .2s,box-shadow .2s;}\n.ck-b:hover{border-color:rgba(214,230,255,0.8);color:#F8FAFC;}\n.ck-b.pri{background:#F8FAFC;border-color:#F8FAFC;color:#0B1118;font-weight:700;}\n.ck-b.pri:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.3);color:#0B1118;}\n.ck-b.txt{border-color:transparent;color:#94A3B8;text-decoration:underline;text-underline-offset:3px;padding:0 6px;}\n.ck-b.txt:hover{color:#F8FAFC;}\n.ck-wrap{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(2,4,6,0.66);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:'Noto Sans KR',sans-serif;}\n.ck-panel{width:min(520px,100%);display:flex;flex-direction:column;gap:18px;padding:28px;border-radius:24px;border:1px solid rgba(214,230,255,0.28);background:#0B1118;box-shadow:0 40px 100px rgba(0,0,0,0.6);}\n.ck-row{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:16px 0;border-top:1px solid rgba(214,230,255,0.12);}\n.ck-tg{width:48px;height:28px;border-radius:999px;border:1px solid rgba(214,230,255,0.4);background:rgba(214,230,255,0.06);position:relative;cursor:pointer;flex-shrink:0;padding:0;transition:background .2s;}\n.ck-tg::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#94A3B8;transition:left .2s,background .2s;}\n.ck-tg.on{background:rgba(214,230,255,0.3);border-color:#D6E6FF;}\n.ck-tg.on::after{left:23px;background:#F8FAFC;}\n.ck-tg.lock{opacity:0.55;cursor:default;}\n.ft-ck{background:none;border:none;padding:0;cursor:pointer;font:inherit;text-align:left;color:#CBD5E1;}\n.ft-ck:hover{color:#F8FAFC;}\n.nv-m{display:none;align-items:center;gap:10px;}\n.nv-burger{width:42px;height:38px;border-radius:10px;border:1px solid rgba(214,230,255,0.3);background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;padding:0;}\n.nv-burger span{width:18px;height:1.5px;background:#F8FAFC;border-radius:2px;}\n.mn-wrap{position:fixed;inset:0;z-index:95;display:flex;flex-direction:column;background:#020406;overflow-y:auto;}\n.mn-top{display:flex;justify-content:space-between;align-items:center;min-height:64px;padding:12px 20px;border-bottom:1px solid rgba(214,230,255,0.14);}\n.mn-x{width:42px;height:38px;border-radius:10px;border:1px solid rgba(214,230,255,0.3);background:transparent;color:#F8FAFC;font-size:18px;cursor:pointer;}\n.mn-list{display:flex;flex-direction:column;padding:12px 20px;}\n.mn-list a.mi{display:flex;justify-content:space-between;align-items:center;height:60px;border-bottom:1px solid rgba(214,230,255,0.1);font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:24px;font-weight:500;color:#F8FAFC;}\n.mn-list a.mi span.ar{color:#64748B;font-size:18px;}\n.mn-foot{display:flex;flex-direction:column;gap:14px;padding:20px 20px 32px;margin-top:auto;}\n.mn-poc{height:54px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:#F8FAFC;color:#0B1118 !important;font-family:'Noto Sans KR',sans-serif;font-size:16px;font-weight:700;}\n@media (max-width:820px){nav .nv-links{display:none !important;}.nv-m{display:flex;}.nv-m .navpoc{height:36px;padding:0 14px;font-size:13px;}nav{min-height:64px !important;}}\n@media (max-width:820px){body{overflow-x:clip;}h1,h2,h3{max-width:100% !important;}h1,h2,h3{width:auto !important;}div[style*=\"span 2\"]{grid-column:auto !important;}section[style*=\"position\"]{max-width:100vw;}}\n@media (max-width:820px){\n.m-x{display:none !important;}\n.lane-wrap-m{margin:0 30px 0 6px !important;}\n.lane-tick.mk1,.lane-call.mk1,.lane-token.mk1{left:5% !important;}.lane-tick.mk1,.lane-token.mk1{animation-delay:0.21s !important;}\n.lane-tick.mk2,.lane-call.mk2,.lane-token.mk2{left:21% !important;}.lane-tick.mk2,.lane-token.mk2{animation-delay:1.58s !important;}\n.lane-tick.mk3,.lane-call.mk3,.lane-token.mk3{left:37% !important;}.lane-tick.mk3,.lane-token.mk3{animation-delay:2.95s !important;}\n.lane-tick.mk4,.lane-call.mk4,.lane-token.mk4{left:53% !important;}.lane-tick.mk4,.lane-token.mk4{animation-delay:4.32s !important;}\n.lane-tick.mk5,.lane-call.mk5,.lane-token.mk5{left:69% !important;}.lane-tick.mk5,.lane-token.mk5{animation-delay:5.69s !important;}\n.lane-tick.mk6,.lane-call.mk6,.lane-token.mk6{left:85% !important;}.lane-tick.mk6,.lane-token.mk6{animation-delay:7.06s !important;}\n.crit-grid{grid-template-columns:repeat(3,minmax(0,1fr)) !important;gap:8px !important;}\n.crit-grid > div{padding:14px 10px !important;border-radius:14px !important;gap:6px !important;}\n.crit-grid > div > span:nth-child(1){font-size:11px !important;}\n.crit-grid > div > span:nth-child(2){font-size:17px !important;}\n.crit-grid > div > span:nth-child(3){font-size:12px !important;line-height:1.5 !important;}\n}\n"
        }
      </style>
      {"\n"}
      <div
        lang={"en"}
        style={css(
          "background:#020406;color:#F8FAFC;font-family:'Noto Sans KR',sans-serif;min-height:100vh;",
        )}
      >
        {"\n\n  "}
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
            {"\n      "}
            <img
              src={"/brand/itrix-logo-inverse.svg"}
              alt={"itriX"}
              style={css("width:120px;height:auto;display:block;")}
            />
            {"\n    "}
          </a>
          {"\n    "}
          <div
            className={"nv-links"}
            style={css(
              "display:flex;flex-wrap:wrap;align-items:center;gap:8px 32px;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:500;",
            )}
          >
            {"\n      "}
            <a
              href={"/en/#portfolio"}
              style={css("color:#F8FAFC;")}
              className={" reference-hover-1"}
            >
              {"Products"}
            </a>
            {"\n      "}
            <a
              href={"/en/#technology"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-2"}
            >
              {"Technology"}
            </a>
            {"\n      "}
            <a
              href={"/en/#why"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-3"}
            >
              {"Company"}
            </a>
            {"\n      "}
            <a
              className={"askx reference-hover-4"}
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
            <a
              target="_blank"
              rel="noopener"
              className={"navpoc"}
              href={FORM_LINKS.en.poc}
            >
              {"Request a PoC ↗"}
            </a>
            {"\n      "}
            <span className={"navlang"} role={"group"} aria-label={"Language"}>
              <a className={""} href={"/astop"} lang={"ko"}>
                {"KO"}
              </a>
              <a className={"on"} href={"/en/astop"} lang={"en"}>
                {"EN"}
              </a>
            </span>
            {"\n    "}
          </div>
          {"\n    "}
          <div className={"nv-m"}>
            <span className={"navlang"} role={"group"} aria-label={"Language"}>
              <a className={""} href={"/astop"} lang={"ko"}>
                {"KO"}
              </a>
              <a className={"on"} href={"/en/astop"} lang={"en"}>
                {"EN"}
              </a>
            </span>
            <a
              target="_blank"
              rel="noopener"
              className={"navpoc"}
              href={FORM_LINKS.en.poc}
            >
              {"Request a PoC ↗"}
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
        <main id="content" tabIndex={-1}>
        {"\n\n  "}
        <section
          style={css(
            "position:relative;overflow:hidden;padding:clamp(80px,11vw,160px) clamp(20px,6vw,80px);background:#020406;",
          )}
        >
          {"\n    "}
          <img
            src={"/brand/2f7ac2dac19e93fa2824a767d193d084.jpg"}
            alt={""}
            style={css(
              "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;pointer-events:none;",
            )}
          />
          <div
            style={css(
              "position:absolute;inset:0;background:linear-gradient(90deg, #020406 0%, rgba(2,4,6,0.88) 35%, rgba(2,4,6,0.4) 75%, rgba(2,4,6,0.25) 100%), linear-gradient(180deg, rgba(2,4,6,0) 60%, rgba(2,4,6,0.7) 100%);pointer-events:none;",
            )}
          ></div>
          {"\n    "}
          <div
            style={css(
              "position:relative;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:32px;",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;font-weight:500;letter-spacing:0.12em;color:#CBD5E1;",
              )}
            >
              <a href={"/en/#portfolio"} style={css("color:#CBD5E1;")}>
                {"PRODUCTS"}
              </a>
              <span>{"/"}</span>
              <span style={css("color:#F8FAFC;")}>{"ASTOP"}</span>
            </div>
            {"\n      "}
            <h1
              style={css(
                "margin:0;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(72px,11vw,144px);font-weight:600;line-height:0.95;letter-spacing:-0.02em;color:#F8FAFC;",
              )}
            >
              {"ASTOP"}
            </h1>
            {"\n      "}
            <div style={css("display:flex;flex-wrap:wrap;gap:8px;")}>
              {"\n        "}
              <span
                style={css(
                  "padding:4px 8px;border-radius:6px;background:#F8FAFC;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#1F2937;",
                )}
              >
                {"IMPLEMENTATION DEMONSTRATED"}
              </span>
              {"\n        "}
              <span
                style={css(
                  "padding:4px 8px;border-radius:6px;border:1px solid rgba(214,230,255,0.5);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#F8FAFC;",
                )}
              >
                {"AI OBSERVATION & EXECUTION OPTIMIZATION"}
              </span>
              {"\n        "}
              <span
                style={css(
                  "padding:4px 8px;border-radius:6px;border:1px solid rgba(214,230,255,0.5);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#F8FAFC;",
                )}
              >
                {"TECH · PRISM"}
              </span>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={css(
                "max-width:720px;display:flex;flex-direction:column;gap:16px;",
              )}
            >
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:clamp(22px,2.2vw,30px);font-weight:700;line-height:1.4;color:#F8FAFC;text-wrap:balance;",
                )}
              >
                {"Cuts the cost of AI repetition."}
              </p>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:clamp(17px,1.4vw,19px);line-height:1.65;color:#CBD5E1;",
                )}
              >
                {
                  "ASTOP applies PRISM technology to cut repeated observation and unnecessary AI decision requests in existing agent and automation workflows."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div style={css("display:flex;flex-wrap:wrap;gap:16px;")}>
              {"\n        "}
              <a
                target="_blank"
                rel="noopener"
                className={"hb hb1 reference-hover-5"}
                href={FORM_LINKS.en.poc}
                style={css(
                  "height:56px;display:flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:#F8FAFC;color:#1F2937;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:600;",
                )}
              >
                {"Request a PoC ↗"}
              </a>
              {"\n        "}
              <a
                className={"hb hb2 reference-hover-6"}
                href={"/en/#ask-chat"}
                onClick={askAstop}
                style={css(
                  "height:56px;display:flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:rgba(2,4,6,0.4);border:1px solid rgba(214,230,255,0.5);color:#F8FAFC;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:500;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);",
                )}
              >
                <span
                  style={css(
                    "display:inline-flex;align-items:center;gap:7px;pointer-events:none;",
                  )}
                >
                  {"Ask "}
                  <span>itriX</span>
                  {"about ASTOP"}
                </span>
              </a>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  "}
        <section
          style={css(
            "padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:#080D10;border-top:1px solid rgba(214,230,255,0.14);",
          )}
        >
          {"\n    "}
          <div
            style={css(
              "max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:56px;",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:24px 96px;align-items:end;",
              )}
            >
              {"\n        "}
              <div
                style={css("display:flex;flex-direction:column;gap:24px;")}
              >
                {"\n          "}
                <h2
                  style={css(
                    "margin:0;font-size:clamp(28px,3vw,40px);font-weight:700;line-height:1.28;color:#F8FAFC;",
                  )}
                >
                  {"Is it right for your workload?"}
                </h2>
                {"\n        "}
              </div>
              {"\n        "}
              <p
                style={css(
                  "margin:0;max-width:36em;font-size:17px;line-height:1.65;color:#CBD5E1;",
                )}
              >
                {
                  "Best fit: work where AI keeps checking while it waits for results. As agents and automation grow, so can the cost of repeated checks."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={css(
                "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));border-top:1px solid rgba(214,230,255,0.4);",
              )}
            >
              {"\n        "}
              <div
                style={css(
                  "padding:28px 28px 0 0;display:flex;flex-direction:column;gap:14px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"01"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-size:18px;font-weight:700;line-height:1.4;color:#F8FAFC;",
                  )}
                >
                  {"Software development automation"}
                </span>
                {"\n          "}
                <span
                  style={css("font-size:15px;line-height:1.6;color:#CBD5E1;")}
                >
                  {"Where AI keeps checking whether tests have finished"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "padding:28px 28px 0 0;display:flex;flex-direction:column;gap:14px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"02"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-size:18px;font-weight:700;line-height:1.4;color:#F8FAFC;",
                  )}
                >
                  {"System operations and monitoring"}
                </span>
                {"\n          "}
                <span
                  style={css("font-size:15px;line-height:1.6;color:#CBD5E1;")}
                >
                  {"AI steps in only when something goes wrong"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "padding:28px 28px 0 0;display:flex;flex-direction:column;gap:14px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"03"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-size:18px;font-weight:700;line-height:1.4;color:#F8FAFC;",
                  )}
                >
                  {"Large-scale data processing and analysis"}
                </span>
                {"\n          "}
                <span
                  style={css("font-size:15px;line-height:1.6;color:#CBD5E1;")}
                >
                  {"Where results were polled until they arrived"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "padding:28px 28px 0 0;display:flex;flex-direction:column;gap:14px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"04"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-size:18px;font-weight:700;line-height:1.4;color:#F8FAFC;",
                  )}
                >
                  {"Approvals, settlements, and sign-offs"}
                </span>
                {"\n          "}
                <span
                  style={css("font-size:15px;line-height:1.6;color:#CBD5E1;")}
                >
                  {
                    "Escalates only on changes, failures, or approval requests"
                  }
                </span>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  "}
        <EmptyCalls language={values.language} />
        {"\n\n  "}
        <section
          style={css(
            "position:relative;overflow:hidden;padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:#080D10;border-top:1px solid rgba(214,230,255,0.14);",
          )}
        >
          <img
            src={"/brand/e45ecb3ba7dcb57132ce3d6eeba94c46.jpg"}
            alt={""}
            style={css(
              "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;pointer-events:none;",
            )}
          />
          <div
            style={css(
              "position:absolute;inset:0;background:linear-gradient(90deg, #080D10 0%, rgba(8,13,16,0.78) 30%, rgba(8,13,16,0.3) 70%, rgba(8,13,16,0.15) 100%), linear-gradient(180deg, rgba(8,13,16,0.6) 0%, rgba(8,13,16,0) 35%, rgba(2,4,6,0.7) 78%, #020406 100%);pointer-events:none;",
            )}
          ></div>
          {"\n    "}
          <div
            style={css(
              "position:relative;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:48px;",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:24px;max-width:760px;",
              )}
            >
              {"\n        "}
              <h2
                style={css(
                  "margin:0;font-size:clamp(28px,3vw,40px);font-weight:700;line-height:1.28;color:#F8FAFC;",
                )}
              >
                {"Evaluated on three criteria."}
              </h2>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:16px;line-height:1.65;color:#CBD5E1;",
                )}
              >
                {"Every figure is shown with its metric and test conditions."}
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              className={"crit-grid"}
              style={css(
                "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px;",
              )}
            >
              {"\n        "}
              <div
                style={css(
                  "padding:32px;border-radius:20px;background:linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%), rgba(2,4,6,0.42);border:1px solid rgba(214,230,255,0.26);box-shadow:inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 48px rgba(0,0,0,0.35);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);display:flex;flex-direction:column;gap:16px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;color:#94A3B8;",
                  )}
                >
                  {"01"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:32px;font-weight:600;line-height:1.1;color:#F8FAFC;",
                  )}
                >
                  {"Required decisions"}
                </span>
                {"\n          "}
                <span
                  style={css("font-size:16px;line-height:1.6;color:#CBD5E1;")}
                >
                  {"Which decisions does the workload actually need?"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "padding:32px;border-radius:20px;background:linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%), rgba(2,4,6,0.42);border:1px solid rgba(214,230,255,0.26);box-shadow:inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 48px rgba(0,0,0,0.35);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);display:flex;flex-direction:column;gap:16px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;color:#94A3B8;",
                  )}
                >
                  {"02"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:32px;font-weight:600;line-height:1.1;color:#F8FAFC;",
                  )}
                >
                  {"Resource impact"}
                </span>
                {"\n          "}
                <span
                  style={css("font-size:16px;line-height:1.6;color:#CBD5E1;")}
                >
                  {"How do those decisions affect compute resources?"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "padding:32px;border-radius:20px;background:linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%), rgba(2,4,6,0.42);border:1px solid rgba(214,230,255,0.26);box-shadow:inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 48px rgba(0,0,0,0.35);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);display:flex;flex-direction:column;gap:16px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;color:#94A3B8;",
                  )}
                >
                  {"03"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:32px;font-weight:600;line-height:1.1;color:#F8FAFC;",
                  )}
                >
                  {"Observer overhead"}
                </span>
                {"\n          "}
                <span
                  style={css("font-size:16px;line-height:1.6;color:#CBD5E1;")}
                >
                  {"How much overhead does observation itself add?"}
                </span>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              className={"stat-glow"}
              style={css(
                "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:32px 64px;align-items:center;padding:clamp(24px,3vw,40px);border-radius:20px;background:linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%), rgba(2,4,6,0.42);border:1px solid rgba(214,230,255,0.26);box-shadow:inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 48px rgba(0,0,0,0.35);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);",
              )}
            >
              {"\n        "}
              <div style={css("display:flex;flex-direction:column;gap:8px;")}>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"PRISM · 2026 CONTROLLED TEST"}
                </span>
                {"\n          "}
                <span
                  className={"stat-num"}
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(56px,6vw,80px);font-weight:600;line-height:1;color:#F8FAFC;",
                  )}
                >
                  {"51.9 ~ 84.5%"}
                </span>
                {"\n          "}
                <span style={css("font-size:17px;color:#F8FAFC;")}>
                  {"reduction in observation- and decision-related tokens"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "display:flex;flex-direction:column;gap:8px;font-size:15px;line-height:1.6;color:#CBD5E1;",
                )}
              >
                {"\n          "}
                <span>
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;color:#94A3B8;",
                    )}
                  >
                    {"01 "}
                  </span>
                  {"Long-running AI tasks"}
                </span>
                {"\n          "}
                <span>
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;color:#94A3B8;",
                    )}
                  >
                    {"02 "}
                  </span>
                  {
                    "Compared with repeated polling under identical conditions"
                  }
                </span>
                {"\n          "}
                <span>
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;color:#94A3B8;",
                    )}
                  >
                    {"03 "}
                  </span>
                  {"720 PRISM internal controlled runs in 2026"}
                </span>
                {"\n          "}
                <span
                  style={css("padding-top:8px;font-size:13px;color:#94A3B8;")}
                >
                  {
                    "Observation- and decision-related tokens counted under selected conditions — not a product deployment result. Performance in customer environments is confirmed through a separate Technical Validation."
                  }
                </span>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n\n  "}
        <StoreRoutes language={values.language} />
      </main>
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
            <div className="ft-top">
              {"\n        "}
              <a href={"/en/"}>
                <img
                  src={"/brand/itrix-logo-inverse.svg"}
                  alt={"itriX"}
                  style={css("width:120px;height:auto;display:block;")}
                />
              </a>
              {"\n        "}
              <FooterLinks language={values.language} onCookieSettings={ckOpen} />
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
                <span>{"itriX Co., Ltd."}</span>
                <span>{"CEO Myungjoo Kang"}</span>
                <span>{"Business Reg. No. 119-87-03826"}</span>
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
                <a
                  target="_blank"
                  rel="noopener"
                  className={"mn-poc"}
                  href={FORM_LINKS.en.poc}
                  onClick={mnClose}
                >
                  {"Request a PoC ↗"}
                </a>
                <div>
                  <span
                    className={"navlang"}
                    role={"group"}
                    aria-label={"Language"}
                  >
                    <a className={""} href={"/astop"} lang={"ko"}>
                      {"KO"}
                    </a>
                    <a className={"on"} href={"/en/astop"} lang={"en"}>
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
