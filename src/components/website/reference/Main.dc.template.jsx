"use client";
import { FooterLinks } from "../FooterLinks";
import { FORM_LINKS } from "../formLinks";
// Converted from the supplied October 16 design; production state is supplied separately.
import React from "react";
import TrackProjects from "../TrackProjects";
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
    showGrid,
    videoRef,
  } = values;
  return (
    <>
      <style>{`@media(max-width:820px){nav{gap:8px!important}nav>a img{width:88px!important}.nv-m{gap:6px!important}.nv-m .navlang{gap:0;padding:0}.nv-m .navlang a{padding:5px;font-size:12px}.nv-m .navpoc{padding:0 8px!important;font-size:12px!important}}`}</style>
      <style>
        {
          ".reference-hover-1:hover{color:#F8FAFC;}\n.reference-hover-2:hover{color:#F8FAFC;}\n.reference-hover-3:hover{color:#F8FAFC;}\n.reference-hover-4:hover{color:#CBD5E1;}\n.reference-hover-5:hover{color:#1F2937;box-shadow:0 0 0 4px rgba(214,230,255,0.4);transform:translateY(-1px);}\n.reference-hover-6:hover{color:#F8FAFC;box-shadow:0 0 0 4px rgba(214,230,255,0.3);}\n.reference-hover-7:hover{color:#1F2937;box-shadow:0 0 0 4px rgba(214,230,255,0.4);}\n.reference-hover-8:hover{color:#1F2937;border-color:#94A3B8;}\n.reference-hover-9:hover{border-color:#1F2937;box-shadow:0 8px 20px rgba(31,41,55,0.10);transform:translateY(-1px);}\n.reference-hover-10:hover{color:#1F2937;box-shadow:0 0 0 4px rgba(214,230,255,0.4);}\n.reference-hover-11:hover{box-shadow:0 0 0 4px rgba(100,116,139,0.24);}\n.reference-hover-12:hover{color:#1F2937;}\n.reference-hover-13:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.5),0 24px 64px rgba(0,0,0,0.4);transform:translateY(-2px);}\n.reference-hover-14:hover{color:#0B1118;box-shadow:0 0 0 4px rgba(214,230,255,0.4);}\n.reference-hover-15:hover{color:#F8FAFC;border-color:#D6E6FF;}\n.reference-hover-16:hover{color:#D6E6FF;}\n.reference-hover-17:hover{color:#D6E6FF;}\n.reference-hover-18:hover{color:#D6E6FF;}\n.reference-hover-19:hover{color:#D6E6FF;}\n.reference-hover-20:hover{color:#D6E6FF;}\n.reference-hover-21:hover{color:#D6E6FF;}\n.reference-hover-22:hover{color:#D6E6FF;}\n.reference-hover-23:hover{color:#D6E6FF;}\n.reference-hover-24:hover{color:#D6E6FF;}\n\nhtml,body{margin:0;padding:0;background:#020406;-webkit-font-smoothing:antialiased;word-break:keep-all;overflow-wrap:break-word;scroll-behavior:smooth;}\n*{box-sizing:border-box;}\na{color:#F8FAFC;text-decoration:none;}\na:hover{color:#D6E6FF;}\ninput::placeholder{color:#64748B;}\n.tbc-veil{position:absolute;inset:0;z-index:2;overflow:hidden;border-radius:inherit;pointer-events:none;backdrop-filter:blur(0.3px);-webkit-backdrop-filter:blur(0.3px);background:radial-gradient(120% 80% at 50% 0%, rgba(234,240,255,0.06) 0%, rgba(234,240,255,0.015) 55%, rgba(234,240,255,0) 80%), linear-gradient(180deg, rgba(234,240,255,0.03) 0%, rgba(234,240,255,0) 50%, rgba(234,240,255,0.04) 100%);}\n.tbc-veil::before{content:'';position:absolute;inset:-20% -60%;background:linear-gradient(100deg, rgba(255,255,255,0) 30%, rgba(234,240,255,0.04) 42%, rgba(255,255,255,0.07) 50%, rgba(234,240,255,0.04) 58%, rgba(255,255,255,0) 70%);filter:blur(6px);display:none;}\n.tbc-veil::after{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 1px 0 rgba(255,255,255,0.12);}\n.tbc-group{grid-column:1 / -1;display:flex;justify-content:center;margin-top:8px;pointer-events:none;}\n.tbc-legend{display:inline-flex;align-items:center;gap:12px;padding:0 16px;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(20px,1.9vw,26px);font-weight:500;letter-spacing:0.03em;color:#EAF0FF;white-space:nowrap;}\n.tbc-legend .tbc-dot{width:7px;height:7px;border-radius:50%;background:#D6E6FF;box-shadow:0 0 10px rgba(214,230,255,0.8);animation:tbc-dot 2.4s ease-in-out infinite;flex-shrink:0;}\n.tbc-arrow{display:none;}\n@media (min-width:1100px){.tbc-group{grid-column:2 / -1;justify-content:flex-start;align-items:center;gap:20px;}.tbc-legend{padding:0;}.tbc-arrow{display:block;position:relative;flex:1;height:1px;margin-right:4px;background:linear-gradient(90deg, rgba(214,230,255,0.15) 0%, rgba(214,230,255,0.75) 100%);overflow:visible;}.tbc-arrow::after{content:'';position:absolute;right:0;top:50%;width:11px;height:11px;border-top:1.5px solid rgba(214,230,255,0.9);border-right:1.5px solid rgba(214,230,255,0.9);transform:translateY(-50%) rotate(45deg);transform-origin:center;}.tbc-arrow::before{content:'';position:absolute;top:-1px;height:3px;width:80px;left:0;border-radius:2px;background:linear-gradient(90deg, rgba(234,240,255,0) 0%, rgba(234,240,255,0.95) 100%);filter:blur(0.5px);animation:tbc-arrow-run 3.2s ease-in-out infinite;}}\n@keyframes tbc-arrow-run{0%{left:0;opacity:0;}15%{opacity:1;}85%{opacity:1;}100%{left:calc(100% - 80px);opacity:0;}}\n@media (prefers-reduced-motion: reduce){.tbc-arrow::before{animation:none;opacity:0;}}\n@keyframes tbc-dot{0%,100%{opacity:.35;}50%{opacity:1;}}\n@keyframes tbc-drift{0%{transform:translateX(-18%) skewX(-4deg);opacity:.7;}100%{transform:translateX(18%) skewX(4deg);opacity:1;}}\n.tbc-track{z-index:3;}\n.tbc-track{position:absolute;left:0;right:0;bottom:0;height:2px;overflow:hidden;background:rgba(214,230,255,0.12);pointer-events:none;}\n.tbc-track::after{content:'';position:absolute;top:0;bottom:0;width:38%;left:-40%;background:linear-gradient(90deg, rgba(214,230,255,0) 0%, rgba(214,230,255,0.9) 50%, rgba(214,230,255,0) 100%);display:none;}\n@keyframes tbc-run{0%{left:-40%;}100%{left:100%;}}\n@media (prefers-reduced-motion: reduce){.tbc-track::after{animation:none;left:0;width:30%;}.tbc-veil::before{animation:none;}.tbc-dot{animation:none;}}\n.askx img{transition:opacity .2s ease;}.askx:hover img{opacity:0.78;}\n@property --axa{syntax:'<angle>';inherits:false;initial-value:0deg;}\n.axc-ring{position:absolute;inset:0;z-index:2;border-radius:28px;padding:1.5px;pointer-events:none;background:conic-gradient(from var(--axa), rgba(234,240,255,0) 0deg, rgba(234,240,255,0) 230deg, rgba(214,230,255,0.35) 290deg, rgba(255,255,255,0.95) 340deg, rgba(234,240,255,0) 360deg);-webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);filter:drop-shadow(0 0 6px rgba(214,230,255,0.55));animation:axc-spin 5s linear infinite;opacity:1;transition:opacity .8s ease;}\n#ask-chat:hover .axc-ring,#ask-chat:focus-within .axc-ring{opacity:0;transition:none;}\n@keyframes axc-spin{to{--axa:360deg;}}\n@media (prefers-reduced-motion: reduce){.axc-ring{animation:none;}}\n.axc-skin{position:absolute;inset:0;z-index:20;border-radius:inherit;pointer-events:none;backdrop-filter:invert(1) hue-rotate(180deg) brightness(0.92);-webkit-backdrop-filter:invert(1) hue-rotate(180deg) brightness(0.92);opacity:1;}\n.axc:hover .axc-skin,.axc:focus-within .axc-skin{opacity:0;}\n.ore{position:relative;}\n.ore-rail{position:absolute;top:0;left:calc((100% - 32px) / 6);right:calc((100% - 32px) / 6);height:1px;background:linear-gradient(90deg, rgba(214,230,255,0.15), rgba(214,230,255,0.45) 50%, rgba(214,230,255,0.15));overflow:visible;}\n.ore-run{position:absolute;top:-1px;left:0;width:120px;height:3px;border-radius:2px;background:linear-gradient(90deg, rgba(234,240,255,0) 0%, rgba(234,240,255,0.95) 100%);filter:blur(0.4px);animation:ore-run 4.5s cubic-bezier(.5,0,.3,1) infinite;}\n@keyframes ore-run{0%{left:0;opacity:0;}12%{opacity:1;}88%{opacity:1;}100%{left:calc(100% - 120px);opacity:0;}}\n.ore-chev{position:absolute;top:50%;transform:translate(-50%,-50%);display:flex;padding:0 8px;background:#020406;}\n.ore-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;}\n.ore-card{position:relative;display:flex;flex-direction:column;gap:14px;padding:28px 28px 32px;border-radius:20px;background:linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 45%, rgba(255,255,255,0) 70%), rgba(8,13,16,0.55);border:1px solid rgba(214,230,255,0.16);box-shadow:inset 0 1px 0 rgba(255,255,255,0.08);transition:border-color .3s ease, transform .3s ease, box-shadow .3s ease;}\n.ore-card:hover{border-color:rgba(214,230,255,0.42);transform:translateY(-2px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 48px rgba(0,0,0,0.35);}\n.ore-node{position:absolute;top:-35px;left:50%;width:11px;height:11px;margin-left:-5.5px;border-radius:50%;background:#020406;border:1.5px solid #D6E6FF;box-shadow:0 0 0 4px rgba(214,230,255,0.08), 0 0 12px rgba(214,230,255,0.5);}\n.ore-head{display:flex;align-items:center;justify-content:space-between;}\n.ore-num{font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.14em;color:#94A3B8;}\n.ore-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(214,230,255,0.05);border:1px solid rgba(214,230,255,0.16);}\n.ore-title{margin-top:6px;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:32px;font-weight:600;line-height:1.1;color:#F8FAFC;}\n.ore-text{margin:0;font-size:16px;line-height:1.6;color:#CBD5E1;}\n@media (max-width:860px){.ore{padding-top:0;}.ore-rail,.ore-node{display:none;}.ore-grid{grid-template-columns:1fr;}}\n@media (prefers-reduced-motion: reduce){.ore-run{animation:none;opacity:0;}}\n.pt-light{position:absolute;left:0;top:0;width:clamp(760px,75vw,1200px);height:clamp(760px,75vw,1200px);border-radius:50%;pointer-events:none;background:radial-gradient(circle at center, rgba(255,255,255,0.20) 0%, rgba(234,240,255,0.09) 32%, rgba(234,240,255,0) 66%);filter:blur(12px);animation:pt-wander 18s ease-in-out infinite;will-change:transform;}\n@keyframes pt-wander{0%{transform:translate(-20%,-15%);}20%{transform:translate(30%,20%);}40%{transform:translate(85%,-10%);}60%{transform:translate(105%,30%);}80%{transform:translate(35%,40%);}100%{transform:translate(-20%,-15%);}}\n@media (prefers-reduced-motion: reduce){.pt-light{animation:none;transform:translate(20%,0);}}\n.navlogin{height:38px;display:inline-flex;align-items:center;padding:0 16px;border-radius:10px;border:1px solid rgba(214,230,255,0.4);color:#F8FAFC !important;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:500;white-space:nowrap;transition:background .2s ease,border-color .2s ease;}\n.navlogin:hover{background:rgba(214,230,255,0.08);border-color:rgba(214,230,255,0.8);}\n.navlang{display:inline-flex;padding:3px;border-radius:10px;border:1px solid rgba(214,230,255,0.28);background:rgba(2,4,6,0.5);gap:2px;}\n.navlang a{height:30px;min-width:38px;display:inline-flex;align-items:center;justify-content:center;padding:0 10px;border-radius:7px;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.06em;color:#94A3B8 !important;transition:background .2s ease,color .2s ease;}\n.navlang a:hover{color:#F8FAFC !important;}\n.navlang a.on{background:#F8FAFC;color:#0B1118 !important;font-weight:500;}\n@keyframes miGlow{0%,100%{color:#F8FAFC;text-shadow:0 0 0 rgba(214,230,255,0);}10%{color:#FFFFFF;text-shadow:0 0 14px rgba(214,230,255,0.85),0 0 32px rgba(214,230,255,0.45);}24%{color:#F8FAFC;text-shadow:0 0 0 rgba(214,230,255,0);}}\n.mi-name{animation:miGlow 7.5s ease-in-out infinite;}\n.mi2{animation-delay:1.5s;}.mi3{animation-delay:3s;}\n@media (prefers-reduced-motion:reduce){.mi-name{animation:none;}}\n.navpoc{height:38px;display:inline-flex;align-items:center;padding:0 18px;border-radius:10px;background:#F8FAFC;color:#0B1118 !important;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:700;white-space:nowrap;transition:box-shadow .2s ease;}\n.navpoc:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.35);color:#0B1118 !important;}\n.nt-cta{height:52px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;background:#F8FAFC;color:#0B1118;font-weight:700;font-size:16px;text-decoration:none;transition:background .2s;}.nt-cta:hover{background:#D6E6FF;}.nt-wrap{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-start;justify-content:center;padding:96px 20px 20px;overflow-y:auto;background:rgba(2,4,6,0.66);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}\n.nt-card{width:min(560px,100%);display:flex;flex-direction:column;border-radius:24px;overflow:hidden;border:1px solid rgba(214,230,255,0.28);background:#0B1118;box-shadow:0 40px 100px rgba(0,0,0,0.6);}\n.nt-rows{width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;}\n.nt-rows th{width:28%;text-align:left;vertical-align:top;padding:10px 12px 10px 0;color:#94A3B8;font-weight:500;border-bottom:1px solid rgba(214,230,255,0.1);}\n.nt-rows td{padding:10px 0;color:#E2E8F0;border-bottom:1px solid rgba(214,230,255,0.1);}\n.nt-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 28px;border-top:1px solid rgba(214,230,255,0.12);background:rgba(214,230,255,0.03);}\n.nt-foot button{background:none;border:none;color:#94A3B8;font-family:'Noto Sans KR',sans-serif;font-size:14px;cursor:pointer;padding:6px 0;}\n.nt-foot button:hover{color:#F8FAFC;}\n.ck-bar{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;justify-content:center;padding:0 20px 20px;pointer-events:none;}\n.ck-card{pointer-events:auto;width:min(1040px,100%);display:flex;flex-wrap:wrap;align-items:center;gap:18px 28px;padding:22px 26px;border-radius:20px;border:1px solid rgba(214,230,255,0.24);background:rgba(11,17,24,0.94);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 24px 70px rgba(0,0,0,0.55);font-family:'Noto Sans KR',sans-serif;}\n.ck-btns{display:flex;flex-wrap:wrap;gap:10px;}\n.ck-b{height:44px;display:inline-flex;align-items:center;justify-content:center;padding:0 18px;border-radius:12px;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap;border:1px solid rgba(214,230,255,0.35);background:transparent;color:#E2E8F0;transition:border-color .2s,background .2s,box-shadow .2s;}\n.ck-b:hover{border-color:rgba(214,230,255,0.8);color:#F8FAFC;}\n.ck-b.pri{background:#F8FAFC;border-color:#F8FAFC;color:#0B1118;font-weight:700;}\n.ck-b.pri:hover{box-shadow:0 0 0 4px rgba(214,230,255,0.3);color:#0B1118;}\n.ck-b.txt{border-color:transparent;color:#94A3B8;text-decoration:underline;text-underline-offset:3px;padding:0 6px;}\n.ck-b.txt:hover{color:#F8FAFC;}\n.ck-wrap{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(2,4,6,0.66);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:'Noto Sans KR',sans-serif;}\n.ck-panel{width:min(520px,100%);display:flex;flex-direction:column;gap:18px;padding:28px;border-radius:24px;border:1px solid rgba(214,230,255,0.28);background:#0B1118;box-shadow:0 40px 100px rgba(0,0,0,0.6);}\n.ck-row{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:16px 0;border-top:1px solid rgba(214,230,255,0.12);}\n.ck-tg{width:48px;height:28px;border-radius:999px;border:1px solid rgba(214,230,255,0.4);background:rgba(214,230,255,0.06);position:relative;cursor:pointer;flex-shrink:0;padding:0;transition:background .2s;}\n.ck-tg::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#94A3B8;transition:left .2s,background .2s;}\n.ck-tg.on{background:rgba(214,230,255,0.3);border-color:#D6E6FF;}\n.ck-tg.on::after{left:23px;background:#F8FAFC;}\n.ck-tg.lock{opacity:0.55;cursor:default;}\n.ft-ck{background:none;border:none;padding:0;cursor:pointer;font:inherit;text-align:left;color:#CBD5E1;}\n.ft-ck:hover{color:#F8FAFC;}\n.nv-m{display:none;align-items:center;gap:10px;}\n.nv-burger{width:42px;height:38px;border-radius:10px;border:1px solid rgba(214,230,255,0.3);background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;padding:0;}\n.nv-burger span{width:18px;height:1.5px;background:#F8FAFC;border-radius:2px;}\n.mn-wrap{position:fixed;inset:0;z-index:95;display:flex;flex-direction:column;background:#020406;overflow-y:auto;}\n.mn-top{display:flex;justify-content:space-between;align-items:center;min-height:64px;padding:12px 20px;border-bottom:1px solid rgba(214,230,255,0.14);}\n.mn-x{width:42px;height:38px;border-radius:10px;border:1px solid rgba(214,230,255,0.3);background:transparent;color:#F8FAFC;font-size:18px;cursor:pointer;}\n.mn-list{display:flex;flex-direction:column;padding:12px 20px;}\n.mn-list a.mi{display:flex;justify-content:space-between;align-items:center;height:60px;border-bottom:1px solid rgba(214,230,255,0.1);font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:24px;font-weight:500;color:#F8FAFC;}\n.mn-list a.mi span.ar{color:#64748B;font-size:18px;}\n.mn-foot{display:flex;flex-direction:column;gap:14px;padding:20px 20px 32px;margin-top:auto;}\n.mn-poc{height:54px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:#F8FAFC;color:#0B1118 !important;font-family:'Noto Sans KR',sans-serif;font-size:16px;font-weight:700;}\n@media (max-width:820px){nav .nv-links{display:none !important;}.nv-m{display:flex;}.nv-m .navpoc{height:36px;padding:0 14px;font-size:13px;}nav{min-height:64px !important;}}\n@media (max-width:820px){body{overflow-x:clip;}h1,h2,h3{max-width:100% !important;}h1,h2,h3{width:auto !important;}div[style*=\"span 2\"]{grid-column:auto !important;}section[style*=\"position\"]{max-width:100vw;}}\n@media (max-width:820px){div:has(> .mi-name){grid-template-columns:1fr !important;gap:10px !important;}}\n@media (max-width:820px){.nt-wrap{padding:16px 12px !important;}.nt-rows th{width:30%;}}\n@media (max-width:820px){\n.ore-grid{grid-template-columns:repeat(3,minmax(0,1fr)) !important;gap:8px !important;}\n.ore-card{padding:13px 8px 15px !important;gap:8px !important;border-radius:14px !important;animation:ore-pulse 7.5s ease-in-out infinite;}\n.ore-card:nth-child(2){animation-delay:2.5s;}.ore-card:nth-child(3){animation-delay:5s;}\n.ore-card:hover{transform:none;}\n.ore-icon{width:34px !important;height:34px !important;border-radius:10px !important;}.ore-icon svg{width:18px;height:18px;}\n.ore-num{font-size:10px !important;letter-spacing:0.08em !important;}\n.ore-title{font-size:17px !important;margin-top:2px !important;overflow-wrap:normal !important;word-break:keep-all !important;letter-spacing:-0.01em;}\n.ore-text{font-size:12px !important;line-height:1.5 !important;}\n.pf-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important;}\n.pf-grid > :not(.tbc-group){min-height:0 !important;height:auto !important;padding:16px 14px !important;gap:8px !important;border-radius:16px !important;}\n.pf-grid > :not(.tbc-group) > :nth-last-child(4){font-size:10px !important;letter-spacing:0.08em !important;}\n.pf-grid > :not(.tbc-group) > :nth-last-child(3){font-size:22px !important;}\n.pf-grid > :not(.tbc-group) > :nth-last-child(2){font-size:12px !important;line-height:1.4 !important;}\n.pf-grid > :not(.tbc-group) > :nth-last-child(1){padding-top:10px !important;gap:6px !important;}\n.pf-grid > :not(.tbc-group) > :nth-last-child(1) span{font-size:9.5px !important;letter-spacing:0.03em !important;}\n.pf-grid > .tbc-group{grid-column:1 / -1;}\n.ceo-msg{gap:10px !important;}\n.ceo-msg p{font-size:13.5px !important;line-height:1.65 !important;}\n.ceo-msg p:first-of-type{font-size:15px !important;}\n.ceo-msg > span:last-child{font-size:14px !important;}\n.axc-skin{transition:opacity 1.2s ease;}\n.axc.axc-in .axc-skin{opacity:0;}\n#ask-chat:has(.axc-in) .axc-ring{opacity:0;}\n}\n@keyframes ore-pulse{0%,40%,100%{border-color:rgba(214,230,255,0.16);transform:translateY(0);box-shadow:inset 0 1px 0 rgba(255,255,255,0.08);}\n12%,28%{border-color:rgba(214,230,255,0.62);transform:translateY(-2px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.16),0 0 0 3px rgba(214,230,255,0.12),0 14px 36px rgba(0,0,0,0.4);}}\n@media (prefers-reduced-motion: reduce){.ore-card{animation:none !important;}}\n"
        }
      </style>
      {"\n"}
      <div
        lang={"ko"}
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
            href={"#top"}
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
              href={"#portfolio"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-1"}
            >
              {"Products"}
            </a>
            {"\n      "}
            <a
              href={"#technology"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-2"}
            >
              {"Technology"}
            </a>
            {"\n      "}
            <a
              href={"#why"}
              style={css("color:#CBD5E1;")}
              className={" reference-hover-3"}
            >
              {"Company"}
            </a>
            {"\n      "}
            <a
              className={"askx reference-hover-4"}
              href={"#ask-chat"}
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
              href={FORM_LINKS.ko.poc}
            >
              {"PoC 신청 ↗"}
            </a>
            {"\n      "}
            <span className={"navlang"} role={"group"} aria-label={"Language"}>
              <a className={"on"} href={"/"} lang={"ko"}>
                {"KO"}
              </a>
              <a className={""} href={"/en/"} lang={"en"}>
                {"EN"}
              </a>
            </span>
            {"\n    "}
          </div>
          {"\n    "}
          <div className={"nv-m"}>
            <span className={"navlang"} role={"group"} aria-label={"Language"}>
              <a className={"on"} href={"/"} lang={"ko"}>
                {"KO"}
              </a>
              <a className={""} href={"/en/"} lang={"en"}>
                {"EN"}
              </a>
            </span>
            <a
              target="_blank"
              rel="noopener"
              className={"navpoc"}
              href={FORM_LINKS.ko.poc}
            >
              {"PoC 신청 ↗"}
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
        <main id="content" tabIndex={-1}>
        {"\n\n  "}
        <section
          id={"top"}
          style={css(
            "position:relative;overflow:hidden;min-height:clamp(560px,calc(100vh - 72px),860px);display:flex;align-items:center;padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:#020406;",
          )}
        >
          {"\n    "}
          <video
            ref={videoRef}
            src={"/brand/3e4820a0bece023d96b54367e7b454b6.mp4"}
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            style={css(
              "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;",
            )}
          ></video>
          {"\n    "}
          <div
            style={css(
              "position:absolute;inset:0;background:linear-gradient(90deg, rgba(2,4,6,0.88) 0%, rgba(2,4,6,0.62) 45%, rgba(2,4,6,0.15) 100%), linear-gradient(180deg, rgba(2,4,6,0) 70%, rgba(2,4,6,0.5) 100%);pointer-events:none;",
            )}
          ></div>
          {"\n    "}
          <div
            style={css(
              "position:relative;width:100%;max-width:1280px;margin:0 auto;",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:32px;max-width:720px;",
              )}
            >
              {"\n        "}
              <h1
                style={css(
                  "margin:0;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(48px,6.4vw,88px);font-weight:600;line-height:1.02;letter-spacing:-0.02em;color:#F8FAFC;text-wrap:balance;",
                )}
              >
                {"Building Computational AI Infrastructure."}
              </h1>
              {"\n        "}
              <p
                style={css(
                  "margin:0;max-width:30em;font-size:clamp(17px,1.4vw,19px);line-height:1.65;color:#CBD5E1;text-wrap:pretty;",
                )}
              >
                {
                  "itriX는 수학적 혁신으로 AI 시대의 Computational Infrastructure를 발전시키는 기업입니다. 수학적 표현과 계산 구조에 관한 독자적인 연구를 제품과 산업적 가치로 연결합니다."
                }
              </p>
              {"\n        "}
              <div style={css("display:flex;flex-wrap:wrap;gap:16px;")}>
                {"\n          "}
                <a
                  href={"#astop"}
                  style={css(
                    "height:56px;display:flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:#F8FAFC;border:1px solid #F8FAFC;color:#1F2937;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:600;",
                  )}
                  className={" reference-hover-5"}
                >
                  {"Explore ASTOP "}
                  <span>{"→"}</span>
                </a>
                {"\n          "}
                <a
                  href={"#ask-chat"}
                  style={css(
                    "height:56px;display:flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:rgba(2,4,6,0.4);border:1px solid rgba(214,230,255,0.5);color:#F8FAFC;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:500;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);",
                  )}
                  className={" reference-hover-6"}
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
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  "}
        <section
          id={"about"}
          style={css(
            "position:relative;overflow:hidden;padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:#080D10;border-top:1px solid rgba(214,230,255,0.14);",
          )}
        >
          {"\n    "}
          <img
            src={"/brand/d12b7ffa2a4eeda4acadb9c9c8fed606.jpg"}
            alt={""}
            style={css(
              "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;filter:saturate(0.9);pointer-events:none;",
            )}
          />
          <div
            style={css(
              "position:absolute;inset:0;background:linear-gradient(90deg, #020406 0%, rgba(2,4,6,0.88) 35%, rgba(2,4,6,0.45) 75%, rgba(2,4,6,0.3) 100%), linear-gradient(180deg, rgba(2,4,6,0) 50%, rgba(2,4,6,0.75) 82%, #020406 100%);pointer-events:none;",
            )}
          ></div>
          {"\n    "}
          <div
            style={css(
              "position:relative;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:64px;",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:32px 96px;align-items:end;",
              )}
            >
              {"\n        "}
              <div
                style={css("display:flex;flex-direction:column;gap:24px;")}
              >
                {"\n          "}
                <h2
                  style={css(
                    "margin:0;font-size:clamp(30px,3.4vw,44px);font-weight:700;line-height:1.24;color:#F8FAFC;text-wrap:balance;",
                  )}
                >
                  {"수학에서 새로운 가치를 발견합니다."}
                </h2>
                {"\n        "}
              </div>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:17px;line-height:1.65;color:#CBD5E1;text-wrap:pretty;max-width:36em;",
                )}
              >
                {
                  "기업의 AI 활용이 확대될수록 반복적인 AI 호출, 계산량, 메모리 및 전력 사용, 운영비가 중요해집니다. 이제 AI의 성과는 성능과 함께 효율 및 경제성으로 평가됩니다. itriX는 AI 시스템이 무엇을 관찰하고 언제 판단하며 어떻게 계산하는지를 살펴, 문제의 수학적 구조에 맞는 표현과 실행 방식을 설계합니다."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div className={"ore"}>
              {"\n        "}
              <div className={"ore-grid"}>
                {"\n          "}
                <div className={"ore-card"}>
                  {"\n            "}
                  <div className={"ore-head"}>
                    <span className={"ore-icon"}>
                      <svg
                        width={"30"}
                        height={"30"}
                        viewBox={"0 0 30 30"}
                        fill={"none"}
                        stroke={"#D6E6FF"}
                        strokeWidth={"1.4"}
                        aria-hidden={"true"}
                      >
                        <circle
                          cx={"15"}
                          cy={"15"}
                          r={"12"}
                          opacity={"0.35"}
                        ></circle>
                        <circle
                          cx={"15"}
                          cy={"15"}
                          r={"9"}
                          opacity={"0.7"}
                        ></circle>
                        <circle
                          cx={"15"}
                          cy={"15"}
                          r={"2"}
                          fill={"#D6E6FF"}
                          stroke={"none"}
                        ></circle>
                        <path
                          d={"M15 1v4M15 25v4M1 15h4M25 15h4"}
                          opacity={"0.5"}
                          strokeLinecap={"round"}
                        ></path>
                      </svg>
                    </span>
                    <span className={"ore-num"}>{"01"}</span>
                  </div>
                  {"\n            "}
                  <div className={"ore-title"}>{"Observe"}</div>
                  {"\n            "}
                  <p className={"ore-text"}>
                    {"AI 시스템이 무엇을 관찰하고 언제 판단하는지 살핍니다."}
                  </p>
                  {"\n          "}
                </div>
                {"\n          "}
                <div className={"ore-card"}>
                  {"\n            "}
                  <div className={"ore-head"}>
                    <span className={"ore-icon"}>
                      <svg
                        width={"30"}
                        height={"30"}
                        viewBox={"0 0 30 30"}
                        fill={"none"}
                        stroke={"#D6E6FF"}
                        strokeWidth={"1.4"}
                        strokeLinecap={"round"}
                        aria-hidden={"true"}
                      >
                        <rect
                          x={"3"}
                          y={"3"}
                          width={"24"}
                          height={"24"}
                          rx={"5"}
                          opacity={"0.4"}
                        ></rect>
                        <path
                          d={"M3 11h24M3 19h24M11 3v24M19 3v24"}
                          opacity={"0.3"}
                        ></path>
                        <path d={"M7 23L23 7"}></path>
                        <circle
                          cx={"23"}
                          cy={"9"}
                          r={"2"}
                          fill={"#D6E6FF"}
                          stroke={"none"}
                        ></circle>
                      </svg>
                    </span>
                    <span className={"ore-num"}>{"02"}</span>
                  </div>
                  {"\n            "}
                  <div className={"ore-title"}>{"Represent"}</div>
                  {"\n            "}
                  <p className={"ore-text"}>
                    {"문제의 수학적 구조에 맞는 표현을 설계합니다."}
                  </p>
                  {"\n          "}
                </div>
                {"\n          "}
                <div className={"ore-card"}>
                  {"\n            "}
                  <div className={"ore-head"}>
                    <span className={"ore-icon"}>
                      <span>itriX</span>
                    </span>
                    <span className={"ore-num"}>{"03"}</span>
                  </div>
                  {"\n            "}
                  <div className={"ore-title"}>{"Execute"}</div>
                  {"\n            "}
                  <p className={"ore-text"}>
                    {"구조에 맞는 실행 방식으로 효율 개선 가능성을 찾습니다."}
                  </p>
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  "}
        <section
          id={"astop"}
          style={css(
            "position:relative;overflow:hidden;padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:#020406;",
          )}
        >
          {"\n    "}
          <img
            src={"/brand/be2181e58e43b08f1efe319000783f4b.jpg"}
            alt={""}
            style={css(
              "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;filter:saturate(0.9);pointer-events:none;",
            )}
          />
          <div
            style={css(
              "position:absolute;inset:0;background:linear-gradient(180deg, #020406 0%, rgba(2,4,6,0.6) 12%, rgba(2,4,6,0) 30%), linear-gradient(90deg, #020406 0%, rgba(2,4,6,0.88) 35%, rgba(2,4,6,0.45) 75%, rgba(2,4,6,0.3) 100%), linear-gradient(180deg, rgba(2,4,6,0) 60%, rgba(2,4,6,0.7) 100%);pointer-events:none;",
            )}
          ></div>
          {"\n    "}
          <div
            style={css(
              "position:relative;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(56px,7vw,96px);",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:24px;max-width:600px;",
              )}
            >
              {"\n        "}
              <div
                style={css(
                  "display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;font-weight:500;letter-spacing:0.12em;color:#94A3B8;",
                )}
              >
                <span
                  style={css(
                    "padding:4px 8px;border-radius:6px;border:1px solid rgba(214,230,255,0.4);color:#D6E6FF;",
                  )}
                >
                  {"IMPLEMENTATION DEMONSTRATED"}
                </span>
              </div>
              {"\n        "}
              <h2
                style={css(
                  "margin:0;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(56px,7vw,88px);font-weight:600;line-height:1;letter-spacing:-0.02em;color:#F8FAFC;",
                )}
              >
                {"ASTOP"}
              </h2>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:clamp(21px,2vw,26px);font-weight:700;line-height:1.4;color:#F8FAFC;text-wrap:balance;",
                )}
              >
                {"AI의 반복 비용을 줄여줍니다."}
              </p>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:17px;line-height:1.65;color:#CBD5E1;",
                )}
              >
                {
                  "AI Observation & Execution Optimization. PRISM 기반기술을 적용하여 기존 Agent·자동화 업무에서 반복 관찰과 불필요한 AI 판단 요청을 줄이도록 설계되었습니다."
                }
              </p>
              {"\n        "}
              <div
                style={css(
                  "display:flex;flex-wrap:wrap;gap:16px;padding-top:8px;",
                )}
              >
                {"\n          "}
                <a
                  href={"/astop"}
                  style={css(
                    "height:56px;display:flex;align-items:center;gap:8px;padding:0 24px;border-radius:14px;background:#F8FAFC;color:#1F2937;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:600;",
                  )}
                  className={" reference-hover-7"}
                >
                  {"ASTOP 자세히 보기 "}
                  <span>{"→"}</span>
                </a>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              className="astop-figures"
              style={css(
                "position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid rgba(214,230,255,0.4);",
              )}
            >
              {"\n        "}
              <div
                aria-hidden={"true"}
                style={css(
                  "position:absolute;top:0;left:-100vw;right:-100vw;bottom:calc(-1 * clamp(64px,9vw,128px));background:linear-gradient(180deg, rgba(2,4,6,0.72) 0%, rgba(2,4,6,0.92) 45%, #020406 100%);pointer-events:none;",
                )}
              ></div>
              {"\n        "}
              <div
                style={css(
                  "position:relative;flex:2 1 420px;min-width:0;padding:32px 32px 0 0;display:flex;flex-direction:column;gap:12px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"TOKEN REDUCTION"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-weight:600;line-height:1;color:#F8FAFC;font-size:clamp(56px,6.4vw,96px);letter-spacing:-0.01em;",
                  )}
                >
                  {"51.9 ~ 84.5%"}
                </span>
                {"\n          "}
                <span style={css("font-size:16px;color:#CBD5E1;")}>
                  {"관측·판단 관련 토큰 감소 (PRISM 내부 통제 실험)"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "position:relative;flex:1 1 200px;min-width:0;padding:32px 32px 0;border-left:1px solid rgba(214,230,255,0.2);display:flex;flex-direction:column;gap:12px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"CONTROLLED RUNS"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-weight:600;line-height:1;color:#F8FAFC;font-size:clamp(40px,3.6vw,56px);",
                  )}
                >
                  {"720"}
                  <span
                    style={css(
                      "font-size:20px;font-weight:400;color:#94A3B8;",
                    )}
                  >
                    {" 회"}
                  </span>
                </span>
                {"\n          "}
                <span
                  style={css("font-size:14px;line-height:1.5;color:#94A3B8;")}
                >
                  {"PRISM 내부 통제 실험"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "position:relative;flex:1 1 200px;min-width:0;padding:32px 0 0 32px;border-left:1px solid rgba(214,230,255,0.2);display:flex;flex-direction:column;gap:12px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"TESTED"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-weight:600;line-height:1;color:#F8FAFC;font-size:clamp(40px,3.6vw,56px);",
                  )}
                >
                  {"2026"}
                </span>
                {"\n          "}
                <span
                  style={css("font-size:14px;line-height:1.5;color:#94A3B8;")}
                >
                  {"선정 조건 기준 집계"}
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
        <section
          id={"ask"}
          style={css(
            "position:relative;padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:radial-gradient(50% 60% at 50% 30%, rgba(120,160,175,0.12) 0%, rgba(2,4,6,0) 80%), #020406;",
          )}
        >
          {"\n    "}
          <div
            style={css(
              "max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:48px;",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center;",
              )}
            >
              {"\n        "}
              <h2
                style={css(
                  "margin:0;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(42px,4.6vw,56px);font-weight:600;line-height:1.05;letter-spacing:-0.01em;color:#F8FAFC;",
                )}
              >
                {"itriX를 찾아오신 목적을 알려 주세요."}
              </h2>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:17px;line-height:1.6;color:#CBD5E1;",
                )}
              >
                {
                  "방문 목적을 알려주시면 가장 적절한 정보를 통해 다음 단계로 안내드리겠습니다."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div id="ask-chat" style={{ scrollMarginTop: 96 }}>
              <AskX language={values.language} />
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  "}
        <section
          id={"portfolio"}
          style={css(
            "position:relative;padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:linear-gradient(180deg,#020406 0%,#080D10 100%);border-top:1px solid rgba(214,230,255,0.14);",
          )}
        >
          {"\n    "}
          {showGrid && (
            <>
              {"\n      "}
              <div
                style={css(
                  "position:absolute;inset:0;background-image:linear-gradient(rgba(214,230,255,0.06) 1px, transparent 1px),linear-gradient(90deg, rgba(214,230,255,0.06) 1px, transparent 1px);background-size:64px 64px;mask-image:linear-gradient(180deg, transparent 0%, #000 60%);-webkit-mask-image:linear-gradient(180deg, transparent 0%, #000 60%);pointer-events:none;",
                )}
              ></div>
              {"\n    "}
            </>
          )}
          {"\n    "}
          <div
            style={css(
              "position:relative;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:64px;",
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
                  "margin:0;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(42px,4.6vw,56px);font-weight:600;line-height:1.05;letter-spacing:-0.01em;color:#F8FAFC;",
                )}
              >
                {"From observation to execution."}
              </h2>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:17px;line-height:1.65;color:#CBD5E1;",
                )}
              >
                {
                  "ASTOP은 상태 변화에 따른 효율적인 관측·추론 제어를, AXIOM 제품군은 텐서 연산의 구조적 표현과 구현을, QNTA는 추론 연산 기반의 신경망 학습 아키텍처와 런타임을 다룹니다."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              className={"pf-grid"}
              style={css(
                "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px;position:relative;",
              )}
            >
              {"\n        "}
              <a
                href={"/astop"}
                aria-label={"ASTOP 상세 페이지로 이동"}
                style={css(
                  "display:flex;cursor:pointer;color:inherit;text-decoration:none;position:relative;overflow:hidden;border-radius:20px;background:#020406;border:1px solid #D6E6FF;box-shadow:0 18px 48px rgba(31,41,55,0.12);padding:32px;display:flex;flex-direction:column;gap:16px;min-height:360px;",
                )}
                className={" reference-hover-13"}
              >
                <img
                  src={"/brand/b08a1b9fbc9f86d493f91acc672a9521.jpg"}
                  alt={""}
                  style={css(
                    "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:60% center;pointer-events:none;",
                  )}
                />
                <div
                  style={css(
                    "position:absolute;inset:0;background:linear-gradient(180deg, rgba(2,4,6,0.92) 0%, rgba(2,4,6,0.7) 42%, rgba(2,4,6,0.25) 65%, rgba(2,4,6,0.9) 100%), rgba(0,0,0,0.25);pointer-events:none;",
                  )}
                ></div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;display:flex;justify-content:space-between;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  <span>{"ASTOP"}</span>
                  <span>{"01 →"}</span>
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:36px;font-weight:600;line-height:1;color:#F8FAFC;",
                  )}
                >
                  {"ASTOP"}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;font-size:15px;line-height:1.5;color:#D6E6FF;",
                  )}
                >
                  {"AI Observation & Execution Optimization"}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;margin-top:auto;display:flex;flex-direction:column;gap:8px;padding-top:16px;border-top:1px solid rgba(214,230,255,0.14);",
                  )}
                >
                  {"\n            "}
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;color:#94A3B8;",
                    )}
                  >
                    {"TECH · PRISM"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "align-self:flex-start;padding:4px 8px;border-radius:6px;background:#F8FAFC;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#1F2937;",
                    )}
                  >
                    {"IMPLEMENTATION DEMONSTRATED"}
                  </span>
                  {"\n          "}
                </div>
                {"\n        "}
              </a>
              {"\n        "}
              <div
                style={css(
                  "position:relative;overflow:hidden;border-radius:20px;background:#020406;border:1px dashed rgba(214,230,255,0.3);box-shadow:0 18px 48px rgba(31,41,55,0.12);padding:32px;display:flex;flex-direction:column;gap:16px;min-height:360px;",
                )}
              >
                <img
                  src={"/brand/8c62571161b3f0379aab75950f2ae05b.jpg"}
                  alt={""}
                  style={css(
                    "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:55% center;filter:grayscale(0.85) brightness(0.6);pointer-events:none;",
                  )}
                />
                <div
                  style={css(
                    "position:absolute;inset:0;background:linear-gradient(180deg, rgba(2,4,6,0.92) 0%, rgba(2,4,6,0.7) 42%, rgba(2,4,6,0.25) 65%, rgba(2,4,6,0.9) 100%), rgba(0,0,0,0.25);pointer-events:none;",
                  )}
                ></div>
                <div className={"tbc-veil"} aria-hidden={"true"}></div>
                <span className={"tbc-track"} aria-hidden={"true"}></span>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;display:flex;justify-content:space-between;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#CBD5E1;",
                  )}
                >
                  <span>{"AXIOM"}</span>
                  <span>{"02"}</span>
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:36px;font-weight:600;line-height:1;color:#F8FAFC;",
                  )}
                >
                  {"AXIOM Compute"}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;font-size:15px;line-height:1.5;color:#CBD5E1;",
                  )}
                >
                  {"Computational Efficiency"}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;margin-top:auto;display:flex;flex-direction:column;gap:8px;padding-top:16px;border-top:1px solid rgba(214,230,255,0.2);",
                  )}
                >
                  {"\n            "}
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;color:#CBD5E1;",
                    )}
                  >
                    {"TECH · AXIOM Tensor"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "align-self:flex-start;padding:4px 8px;border-radius:6px;border:1px solid rgba(214,230,255,0.5);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#F8FAFC;",
                    )}
                  >
                    {"VALIDATION STAGE"}
                  </span>
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "position:relative;overflow:hidden;border-radius:20px;background:#020406;border:1px dashed rgba(214,230,255,0.3);box-shadow:0 18px 48px rgba(31,41,55,0.12);padding:32px;display:flex;flex-direction:column;gap:16px;min-height:360px;",
                )}
              >
                <img
                  src={"/brand/49b4c8eb9ea61683485f7c72aa15bcb0.jpg"}
                  alt={""}
                  style={css(
                    "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:60% center;filter:grayscale(0.85) brightness(0.6);pointer-events:none;",
                  )}
                />
                <div
                  style={css(
                    "position:absolute;inset:0;background:linear-gradient(180deg, rgba(2,4,6,0.92) 0%, rgba(2,4,6,0.7) 42%, rgba(2,4,6,0.25) 65%, rgba(2,4,6,0.9) 100%), rgba(0,0,0,0.25);pointer-events:none;",
                  )}
                ></div>
                <div className={"tbc-veil"} aria-hidden={"true"}></div>
                <span className={"tbc-track"} aria-hidden={"true"}></span>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;display:flex;justify-content:space-between;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#CBD5E1;",
                  )}
                >
                  <span>{"AXIOM"}</span>
                  <span>{"03"}</span>
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:36px;font-weight:600;line-height:1;color:#F8FAFC;",
                  )}
                >
                  {"AXIOM Core"}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;font-size:15px;line-height:1.5;color:#CBD5E1;",
                  )}
                >
                  {"Hardware Implementation"}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;margin-top:auto;display:flex;flex-direction:column;gap:8px;padding-top:16px;border-top:1px solid rgba(214,230,255,0.2);",
                  )}
                >
                  {"\n            "}
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;color:#CBD5E1;",
                    )}
                  >
                    {"TECH · AXIOM Tensor"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "align-self:flex-start;padding:4px 8px;border-radius:6px;border:1px dashed rgba(214,230,255,0.5);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#CBD5E1;",
                    )}
                  >
                    {"PLANNED OFFERING"}
                  </span>
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "position:relative;overflow:hidden;border-radius:20px;background:#020406;border:1px dashed rgba(214,230,255,0.3);box-shadow:0 18px 48px rgba(31,41,55,0.12);padding:32px;display:flex;flex-direction:column;gap:16px;min-height:360px;",
                )}
              >
                <img
                  src={"/brand/4417ba3c54089c7660c869d55d5c5bb0.jpg"}
                  alt={""}
                  style={css(
                    "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:62% center;filter:grayscale(0.85) brightness(0.6);pointer-events:none;",
                  )}
                />
                <div
                  style={css(
                    "position:absolute;inset:0;background:linear-gradient(180deg, rgba(2,4,6,0.92) 0%, rgba(2,4,6,0.7) 42%, rgba(2,4,6,0.25) 65%, rgba(2,4,6,0.9) 100%), rgba(0,0,0,0.25);pointer-events:none;",
                  )}
                ></div>
                <div className={"tbc-veil"} aria-hidden={"true"}></div>
                <span className={"tbc-track"} aria-hidden={"true"}></span>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;display:flex;justify-content:space-between;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#CBD5E1;",
                  )}
                >
                  <span>{"QNTA"}</span>
                  <span>{"04"}</span>
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:36px;font-weight:600;line-height:1;color:#F8FAFC;",
                  )}
                >
                  {"QNTA Runtime"}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;font-size:15px;line-height:1.5;color:#CBD5E1;",
                  )}
                >
                  {"Field Learning"}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "position:relative;margin-top:auto;display:flex;flex-direction:column;gap:8px;padding-top:16px;border-top:1px solid rgba(214,230,255,0.2);",
                  )}
                >
                  {"\n            "}
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;color:#CBD5E1;",
                    )}
                  >
                    {"TECH · QNTA ARCHITECTURE"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "align-self:flex-start;padding:4px 8px;border-radius:6px;border:1px solid rgba(214,230,255,0.5);font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#F8FAFC;",
                    )}
                  >
                    {"FEASIBILITY DEMONSTRATED"}
                  </span>
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n        "}

              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  "}
        <section
          id={"technology"}
          style={css(
            "position:relative;overflow:hidden;padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:#080D10;",
          )}
        >
          <img
            src={"/brand/b130af38645a84a97fe9c459b52e0cea.jpg"}
            alt={""}
            style={css(
              "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;filter:saturate(0.75);pointer-events:none;",
            )}
          />
          <div
            style={css(
              "position:absolute;inset:0;background:linear-gradient(90deg, #080D10 0%, rgba(8,13,16,0.88) 35%, rgba(8,13,16,0.45) 75%, rgba(8,13,16,0.3) 100%), linear-gradient(180deg, rgba(8,13,16,0) 60%, rgba(8,13,16,0.7) 100%);pointer-events:none;",
            )}
          ></div>
          {"\n    "}
          <div
            style={css(
              "position:relative;max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:48px 96px;",
            )}
          >
            {"\n      "}
            <div style={css("display:flex;flex-direction:column;gap:24px;")}>
              {"\n        "}
              <h2
                style={css(
                  "margin:0;font-size:clamp(28px,3vw,40px);font-weight:700;line-height:1.28;color:#F8FAFC;text-wrap:balance;",
                )}
              >
                {"Mathematical Intelligence"}
              </h2>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:16px;line-height:1.65;color:#CBD5E1;",
                )}
              >
                {
                  "Mathematical Intelligence는 itriX의 기술 철학입니다. 수학적 구조의 분석과 재표현을 바탕으로 관측·계산·학습의 효율을 높이는 기술을 연구하고 개발합니다."
                }
              </p>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={css(
                "grid-column:span 2;min-width:0;display:flex;flex-direction:column;gap:48px;",
              )}
            >
              {"\n        "}
              <div style={css("display:flex;flex-direction:column;")}>
                {"\n          "}
                <div
                  style={css(
                    "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;padding:24px 0;border-top:1px solid rgba(214,230,255,0.4);",
                  )}
                >
                  {"\n            "}
                  <span
                    className={"mi-name mi1"}
                    style={css(
                      "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:28px;font-weight:600;line-height:1.1;color:#F8FAFC;",
                    )}
                  >
                    {"PRISM"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "display:flex;flex-direction:column;gap:4px;font-size:15px;line-height:1.6;color:#CBD5E1;",
                    )}
                  >
                    <span style={css("color:#F8FAFC;")}>
                      {"ASTOP의 기반기술"}
                    </span>
                    <span>
                      {
                        "판단에 중요한 변화에 맞춰 AI 호출을 효율화합니다. 완료·실패·예외 등 필수 신호의 보존을 전제로 고객 환경에서 효과를 검증합니다."
                      }
                    </span>
                  </span>
                  {"\n          "}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;padding:24px 0;border-top:1px solid rgba(214,230,255,0.22);",
                  )}
                >
                  {"\n            "}
                  <span
                    className={"mi-name mi2"}
                    style={css(
                      "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:28px;font-weight:600;line-height:1.1;color:#F8FAFC;",
                    )}
                  >
                    {"AXIOM Tensor"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "display:flex;flex-direction:column;gap:4px;font-size:15px;line-height:1.6;color:#CBD5E1;",
                    )}
                  >
                    <span style={css("color:#F8FAFC;")}>
                      {"AXIOM Compute · AXIOM Core의 기반기술"}
                    </span>
                    <span>
                      {
                        "적합한 수학적 구조를 더 효율적인 표현으로 변환하여 계산 및 메모리 부담을 개선하는 기술 방향입니다. "
                      }
                    </span>
                  </span>
                  {"\n          "}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;padding:24px 0;border-top:1px solid rgba(214,230,255,0.22);border-bottom:1px solid rgba(214,230,255,0.22);",
                  )}
                >
                  {"\n            "}
                  <span
                    className={"mi-name mi3"}
                    style={css(
                      "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:28px;font-weight:600;line-height:1.1;color:#F8FAFC;",
                    )}
                  >
                    {"QNTA Inference-Based Training Architecture"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "display:flex;flex-direction:column;gap:4px;font-size:15px;line-height:1.6;color:#CBD5E1;",
                    )}
                  >
                    <span style={css("color:#F8FAFC;")}>
                      {"QNTA Runtime의 기반기술"}
                    </span>
                    <span>
                      {
                        "제약된 현장 컴퓨팅 환경에서 적합한 학습 작업을 지원합니다. AI를 실행하던 NPU·CPU 연산으로 학습까지 처리해 현장 장비에서 모델을 갱신합니다."
                      }
                    </span>
                  </span>
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css("display:flex;flex-direction:column;gap:16px;")}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#CBD5E1;",
                  )}
                >
                  {"RESEARCH · ENABLING TECHNOLOGIES"}
                </span>
                {"\n          "}
                <div style={css("display:flex;flex-wrap:wrap;gap:8px;")}>
                  {"\n            "}
                  <span
                    style={css(
                      "padding:8px 16px;border-radius:999px;background:rgba(214,230,255,0.08);border:1px solid rgba(214,230,255,0.28);font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:500;color:#F8FAFC;",
                    )}
                  >
                    {"CRE"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "padding:8px 16px;border-radius:999px;background:rgba(214,230,255,0.08);border:1px solid rgba(214,230,255,0.28);font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:500;color:#F8FAFC;",
                    )}
                  >
                    {"FQNM"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "padding:8px 16px;border-radius:999px;background:rgba(214,230,255,0.08);border:1px solid rgba(214,230,255,0.28);font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:500;color:#F8FAFC;",
                    )}
                  >
                    {"SPADES"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "padding:8px 16px;border-radius:999px;background:rgba(214,230,255,0.08);border:1px solid rgba(214,230,255,0.28);font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;font-weight:500;color:#F8FAFC;",
                    )}
                  >
                    {"Judge · CIA"}
                  </span>
                  {"\n          "}
                </div>
                {"\n          "}
                <span
                  style={css("font-size:14px;line-height:1.6;color:#CBD5E1;")}
                >
                  {
                    "CRE는 복소수·다차원 계산을, FQNM은 물리 시뮬레이션을 정수 기반으로 다시 설계하는 연구입니다. SPADES는 물리 정보를 활용한 확률적 편미분방정식 시뮬레이션 보정을 연구하며, Judge · CIA는 서로 다른 AI·규정·전문가가 교차 확인해 그럴듯한 오답이 그대로 결정되지 않게 합니다."
                  }
                </span>
                {"\n          "}
                <span
                  style={css("font-size:14px;line-height:1.5;color:#94A3B8;")}
                >
                  {"국내 특허출원 9건 (2026년 10월). "}
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
        <section
          id={"why"}
          style={css(
            "position:relative;overflow:hidden;padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:#020406;border-top:1px solid rgba(214,230,255,0.14);",
          )}
        >
          <img
            src={"/brand/6cef6e0a2883ce17d5c6f07bb22ca367.jpg"}
            alt={""}
            style={css(
              "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right top;filter:saturate(0.9);pointer-events:none;",
            )}
          />
          <div
            style={css(
              "position:absolute;inset:0;background:linear-gradient(90deg, #020406 0%, rgba(2,4,6,0.88) 35%, rgba(2,4,6,0.45) 75%, rgba(2,4,6,0.3) 100%), linear-gradient(180deg, rgba(2,4,6,0) 25%, rgba(2,4,6,0.92) 55%, #020406 100%);pointer-events:none;",
            )}
          ></div>
          {"\n    "}
          <div
            style={css(
              "position:relative;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(48px,6vw,80px);",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:24px;max-width:640px;",
              )}
            >
              {"\n        "}
              <h2
                style={css(
                  "margin: 0; font-family: 'Saira Condensed','Noto Sans KR',sans-serif; font-size: clamp(42px,4.6vw,56px); font-weight: 600; line-height: 1.05; letter-spacing: -0.01em; color: #F8FAFC; width: 858px",
                )}
              >
                {"수학적 연구를 산업기술로 연결합니다."}
              </h2>
              {"\n        "}
              <p
                style={css(
                  "margin:0;font-size:17px;line-height:1.65;color:#CBD5E1;",
                )}
              >
                {
                  "itriX는 수학적 연구를 기반으로 원천기술을 개발하고 Intellectual Property를 축적하고 있습니다. 수학 연구, 원천기술 개발, 고객 적용을 연결하는 연구·사업화 팀이 함께합니다."
                }
              </p>
              {"\n      "}
            </div>
            {"\n\n      "}
            <div
              style={css(
                "display:flex;flex-wrap:wrap;border-top:1px solid rgba(214,230,255,0.4);",
              )}
            >
              {"\n        "}
              <div
                style={css(
                  "flex:1 1 220px;min-width:0;padding:32px 32px 0 0;display:flex;flex-direction:column;gap:12px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"FOUNDED"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(48px,4.6vw,64px);font-weight:600;line-height:1;color:#F8FAFC;",
                  )}
                >
                  {"2014"}
                </span>
                {"\n          "}
                <span style={css("font-size:15px;color:#CBD5E1;")}>
                  {"회사 설립"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "flex:1 1 220px;min-width:0;padding:32px 32px 0;border-left:1px solid rgba(214,230,255,0.2);display:flex;flex-direction:column;gap:12px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"PATENTS"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(48px,4.6vw,64px);font-weight:600;line-height:1;color:#F8FAFC;",
                  )}
                >
                  {"9"}
                  <span
                    style={css(
                      "font-size:22px;font-weight:400;color:#94A3B8;",
                    )}
                  >
                    {" 건"}
                  </span>
                </span>
                {"\n          "}
                <span style={css("font-size:15px;color:#CBD5E1;")}>
                  {"국내 특허출원 · 등록과 구분"}
                </span>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "flex:1 1 220px;min-width:0;padding:32px 0 0 32px;border-left:1px solid rgba(214,230,255,0.2);display:flex;flex-direction:column;gap:12px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                  )}
                >
                  {"R&D"}
                </span>
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:clamp(48px,4.6vw,64px);font-weight:600;line-height:1;color:#F8FAFC;",
                  )}
                >
                  {"In-house"}
                </span>
                {"\n          "}
                <span style={css("font-size:15px;color:#CBD5E1;")}>
                  {"자체 연구센터 · 서울대 NCIA LAB 산학협력"}
                </span>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n\n      "}
            <div style={css("display:flex;flex-direction:column;gap:24px;")}>
              {"\n        "}
              <span
                style={css(
                  "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#CBD5E1;",
                )}
              >
                {"LEADERSHIP"}
              </span>
              {"\n        "}
              <div
                style={css(
                  "padding:clamp(28px,3vw,48px);border-radius:20px;background:rgba(31,41,55,0.42);border:1px solid rgba(214,230,255,0.18);display:flex;flex-wrap:wrap;gap:clamp(28px,4vw,56px);",
                )}
              >
                {"\n          "}
                <div
                  style={css(
                    "flex:1 1 320px;max-width:420px;min-width:0;display:flex;flex-direction:column;gap:20px;",
                  )}
                >
                  {"\n            "}
                  <div
                    style={css("display:flex;flex-direction:column;gap:6px;")}
                  >
                    {"\n              "}
                    <span
                      style={css(
                        "font-size:24px;font-weight:700;color:#F8FAFC;",
                      )}
                    >
                      {"강명주"}
                    </span>
                    {"\n              "}
                    <span
                      style={css(
                        "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.08em;color:#94A3B8;",
                      )}
                    >
                      {"CEO · 대표이사"}
                    </span>
                    {"\n            "}
                  </div>
                  {"\n            "}
                  <p
                    style={css(
                      "margin:0;font-size:16px;line-height:1.6;color:#F8FAFC;",
                    )}
                  >
                    {"수학 기반 연구 방향과 사업화를 총괄합니다."}
                  </p>
                  {"\n            "}
                  <div
                    style={css(
                      "display:flex;flex-direction:column;border-top:1px solid rgba(214,230,255,0.16);",
                    )}
                  >
                    {"\n              "}
                    <span
                      style={css(
                        "padding:12px 0;border-bottom:1px solid rgba(214,230,255,0.12);font-size:15px;line-height:1.5;color:#CBD5E1;",
                      )}
                    >
                      {"서울대학교 수리과학부 교수 · NCIA LAB"}
                    </span>
                    {"\n              "}
                    <span
                      style={css(
                        "padding:12px 0;border-bottom:1px solid rgba(214,230,255,0.12);font-size:15px;line-height:1.5;color:#CBD5E1;",
                      )}
                    >
                      {"한국과학기술한림원 정회원"}
                    </span>
                    {"\n              "}
                    <span
                      style={css(
                        "padding:12px 0;border-bottom:1px solid rgba(214,230,255,0.12);font-size:15px;line-height:1.5;color:#CBD5E1;",
                      )}
                    >
                      {"한국산업응용수학회 차기 회장 (2027년 취임 예정)"}
                    </span>
                    {"\n              "}
                    <span
                      style={css(
                        "padding:12px 0;font-size:15px;line-height:1.5;color:#CBD5E1;",
                      )}
                    >
                      {
                        "서울대 수학 학사 · KAIST 응용수학 석사 · UCLA 응용수학 박사"
                      }
                    </span>
                    {"\n            "}
                  </div>
                  {"\n          "}
                </div>
                {"\n          "}
                <div
                  className={"ceo-msg"}
                  style={css(
                    "flex:999 1 440px;min-width:0;display:flex;flex-direction:column;gap:18px;padding-left:clamp(0px,3vw,48px);border-left:1px solid rgba(214,230,255,0.16);",
                  )}
                >
                  {"\n            "}
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#94A3B8;",
                    )}
                  >
                    {"대표 인사말"}
                  </span>
                  {"\n            "}
                  <p
                    style={{
                      margin: 0,
                      fontSize: 22,
                      lineHeight: 1.85,
                      color: "#F8FAFC",
                      fontWeight: 700,
                    }}
                  >
                    {"수학적 혁신으로 AI의 미래를 새롭게 설계합니다."}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {"안녕하십니까."}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {"itriX 대표이사 강명주입니다."}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "인공지능은 우리 사회와 산업 전반을 빠르게 변화시키고 있습니다. 그러나 AI 기술이 발전할수록 더욱 거대한 연산 자원과 에너지가 요구되고 있으며, 계산의 효율성과 신뢰성은 미래 AI의 지속 가능한 발전을 결정하는 핵심 과제가 되고 있습니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "저는 이러한 도전의 해답이 더 많은 계산에만 있는 것이 아니라, 계산의 원리를 새롭게 바라보는 수학적 혁신에 있다고 믿습니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "itriX는 바로 이러한 믿음에서 출발한 수학 기반 딥테크 기업입니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "우리는 기존 기술을 단순히 개선하는 데 머무르지 않고, 문제를 표현하고 계산하는 방식 자체를 새롭게 설계하고자 합니다. 수학적 통찰을 바탕으로 AI의 계산 비용과 복잡성을 줄이고, 한정된 자원으로 더 높은 성능과 신뢰성을 구현할 수 있는 차세대 Computational AI Infrastructure를 만들어 가고 있습니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "이를 위해 AI의 관측과 실행을 최적화하는 기술에서부터 계산 구조의 혁신, 효율적인 AI 학습, 그리고 Physical AI를 위한 새로운 수치계산 기술에 이르기까지 독자적인 원천기술을 연구하고 있습니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "우리의 목표는 단순히 더 빠른 AI를 만드는 것이 아닙니다. 더 효율적이고, 더 신뢰할 수 있으며, 더 많은 사람이 활용할 수 있는 AI의 미래를 여는 것입니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "이를 실현하기 위해 itriX는 수학적 이론의 깊이와 산업 현장의 실용성을 함께 추구합니다. 학문적 발견을 실제 기술로 구현하고, 그 가치를 객관적으로 검증하며, 고객과 산업이 직면한 어려운 문제를 해결하는 데 집중하겠습니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "앞으로 AI는 과학기술과 산업의 혁신을 넘어 인류가 해결할 수 있는 문제의 범위 자체를 넓혀 갈 것입니다. itriX는 이러한 변화의 중심에서 기존 계산의 한계를 넘어 새로운 가능성을 열어 가는 기술 기업으로 성장하고자 합니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "수학에서 새로운 원리를 발견하고, 기술로 새로운 가능성을 실현하며, 혁신으로 더 나은 미래를 만드는 것."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {
                      "이것이 itriX가 추구하는 가치이자 미래를 향한 약속입니다."
                    }
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      lineHeight: 1.85,
                      color: "#CBD5E1",
                      fontWeight: 400,
                    }}
                  >
                    {"감사합니다."}
                  </p>
                  <span
                    style={{
                      marginTop: 8,
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#F8FAFC",
                      textAlign: "right",
                    }}
                  >
                    {"itriX 대표이사 강명주"}
                  </span>
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  "}
        <section
          id={"track"}
          style={css(
            "padding:clamp(64px,9vw,128px) clamp(20px,6vw,80px);background:#080D10;border-top:1px solid rgba(214,230,255,0.14);",
          )}
        >
          {"\n    "}
          <div
            style={css(
              "max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(48px,6vw,72px);",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:flex;flex-direction:column;gap:24px;max-width:720px;",
              )}
            >
              {"\n        "}
              <h2
                style={css(
                  "margin:0;font-size:clamp(28px,3vw,40px);font-weight:700;line-height:1.28;color:#F8FAFC;text-wrap:balance;",
                )}
              >
                {"산업 적용 경험과 원천기술 연구를 함께 쌓아 왔습니다."}
              </h2>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              style={css(
                "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:48px clamp(48px,6vw,96px);align-items:start;",
              )}
            >
              {"\n\n        "}
              <TrackProjects language={values.language} />
              <div
                style={css("display:flex;flex-direction:column;gap:16px;")}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.12em;color:#CBD5E1;",
                  )}
                >
                  {"RESEARCH"}
                </span>
                {"\n          "}
                <div
                  style={css(
                    "padding:clamp(24px,3vw,32px);border-radius:20px;background:rgba(31,41,55,0.42);border:1px solid rgba(214,230,255,0.18);display:flex;flex-direction:column;gap:20px;",
                  )}
                >
                  {"\n            "}
                  <div
                    style={css("display:flex;flex-direction:column;gap:4px;")}
                  >
                    {"\n              "}
                    <span
                      style={css(
                        "font-size:18px;font-weight:700;color:#F8FAFC;",
                      )}
                    >
                      {"서울대학교 NCIA LAB"}
                    </span>
                    {"\n              "}
                    <span
                      style={css(
                        "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.06em;color:#94A3B8;",
                      )}
                    >
                      {"Numerical Computing & Image Analysis · 산학 연구협력"}
                    </span>
                    {"\n            "}
                  </div>
                  {"\n            "}
                  <div
                    style={css("display:flex;flex-wrap:wrap;gap:16px 40px;")}
                  >
                    {"\n              "}
                    <span
                      style={css(
                        "display:flex;flex-direction:column;gap:4px;",
                      )}
                    >
                      <span
                        style={css(
                          "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:44px;font-weight:600;line-height:1;color:#F8FAFC;",
                        )}
                      >
                        {"150+"}
                      </span>
                      <span style={css("font-size:14px;color:#CBD5E1;")}>
                        {"정부·산학 연구과제"}
                      </span>
                    </span>
                    {"\n              "}
                    <span
                      style={css(
                        "display:flex;flex-direction:column;gap:4px;",
                      )}
                    >
                      <span
                        style={css(
                          "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:44px;font-weight:600;line-height:1;color:#F8FAFC;",
                        )}
                      >
                        {"150+"}
                      </span>
                      <span style={css("font-size:14px;color:#CBD5E1;")}>
                        {"국내외 학술논문"}
                      </span>
                    </span>
                    {"\n            "}
                  </div>
                  {"\n            "}
                  <span
                    style={css(
                      "font-size:12px;line-height:1.5;color:#94A3B8;",
                    )}
                  >
                    {
                      "NCIA LAB 소개자료 기준 누적 성과이며, 회사 직접 실적과는 별개입니다."
                    }
                  </span>
                  {"\n          "}
                </div>
                {"\n          "}
                <div
                  style={css(
                    "display:flex;flex-direction:column;gap:0;border-top:1px solid rgba(214,230,255,0.4);",
                  )}
                >
                  {"\n            "}
                  <span
                    style={css(
                      "padding:14px 0 6px;font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.08em;color:#94A3B8;",
                    )}
                  >
                    {"itriX 연구진 참여 논문 · 2024–2026"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "display:grid;grid-template-columns:120px minmax(0,1fr);gap:16px;padding:10px 0;border-bottom:1px solid rgba(214,230,255,0.12);font-size:14px;line-height:1.5;",
                    )}
                  >
                    <span
                      style={css(
                        "font-family:'IBM Plex Mono','Noto Sans KR',monospace;color:#D6E6FF;",
                      )}
                    >
                      {"2026 · NeurIPS"}
                    </span>
                    <span style={css("color:#CBD5E1;")}>
                      {
                        "Kernel Value Regression in Offline Reinforcement Learning"
                      }
                    </span>
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "display:grid;grid-template-columns:120px minmax(0,1fr);gap:16px;padding:10px 0;border-bottom:1px solid rgba(214,230,255,0.12);font-size:14px;line-height:1.5;",
                    )}
                  >
                    <span
                      style={css(
                        "font-family:'IBM Plex Mono','Noto Sans KR',monospace;color:#D6E6FF;",
                      )}
                    >
                      {"2025 · ICML"}
                    </span>
                    <span style={css("color:#CBD5E1;")}>
                      {
                        "Unpaired Point Cloud Completion via Unbalanced Optimal Transport"
                      }
                    </span>
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "display:grid;grid-template-columns:120px minmax(0,1fr);gap:16px;padding:10px 0;border-bottom:1px solid rgba(214,230,255,0.12);font-size:14px;line-height:1.5;",
                    )}
                  >
                    <span
                      style={css(
                        "font-family:'IBM Plex Mono','Noto Sans KR',monospace;color:#D6E6FF;",
                      )}
                    >
                      {"2024 · ACL"}
                    </span>
                    <span style={css("color:#CBD5E1;")}>
                      {
                        "FLEUR: An Explainable Reference-Free Evaluation Metric for Image Captioning"
                      }
                    </span>
                  </span>
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n\n      "}
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  \n\n  "}
        <section
          id={"contact"}
          style={css(
            "position: relative; overflow: hidden; min-height: clamp(560px,80vh,860px); display: flex; align-items: flex-end; padding: clamp(80px,10vw,144px) clamp(20px,6vw,80px) clamp(56px,6vw,80px); background: radial-gradient(50% 60% at 100% 0%, rgba(40,58,82,0.35) 0%, rgba(2,4,6,0) 75%), #03060B; border-top: 1px solid rgba(214,230,255,0.1); width:100%;box-sizing:border-box",
          )}
        >
          {"\n    "}
          <div className={"pt-light"} aria-hidden={"true"}></div>
          {"\n    "}
          <img
            src={"/brand/itrix-x-inverse.svg"}
            alt={""}
            aria-hidden={"true"}
            style={css(
              "position:absolute;right:0;top:50%;transform:translateY(-50%);width:min(56vw,860px);max-width:100%;height:auto;opacity:0.05;pointer-events:none;",
            )}
          />
          {"\n    "}
          <div
            style={css(
              "position:relative;width:100%;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:clamp(48px,5vw,72px);",
            )}
          >
            {"\n      "}
            <div
              style={css(
                "display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:end;gap:clamp(24px,5vw,72px);",
              )}
            >
              {"\n        "}
              <div
                style={css(
                  "flex:1 1 480px;min-width:0;max-width:680px;display:flex;flex-direction:column;gap:24px;",
                )}
              >
                {"\n          "}
                <span
                  style={css(
                    "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;font-weight:500;letter-spacing:0.12em;color:#D6E6FF;",
                  )}
                >
                  {"PARTNERSHIP"}
                </span>
                {"\n          "}
                <h2
                  style={css(
                    "margin: 0; font-family: 'Saira Condensed','Noto Sans KR',sans-serif; font-size: clamp(36px,4vw,56px); font-weight: 600; line-height: 1.05; letter-spacing: -0.01em; color: #F8FAFC; text-wrap: balance; width:100%;max-width:100%",
                  )}
                >
                  {"함께 만드는"}
                  <br />
                  {"Computational Infrastructure의 미래"}
                </h2>
                {"\n          "}
                <p
                  style={css(
                    "margin:0;max-width:40em;font-size:15px;line-height:1.7;color:#CBD5E1;",
                  )}
                >
                  {
                    "고객의 핵심 AI·연산 과제를 선정하여 측정 가능한 목표와 검증 기준을 수립합니다. 실제 검증 결과를 바탕으로 적용 범위와 협력·Licensing 조건을 논의합니다."
                  }
                </p>
                <a
                  className="jr-btn partnership-cta"
                  href={"/partnership"}
                  style={{
                    alignSelf: "flex-start",
                    padding: "14px 20px",
                    borderRadius: 12,
                    background: "#F8FAFC",
                    color: "#0B1118",
                    fontWeight: 700,
                  }}
                >
                  파트너십 문의 →
                </a>
                {"\n          "}
                <div
                  style={css(
                    "display:flex;flex-direction:column;gap:12px;margin-top:12px;padding:20px 24px;border-radius:16px;border:1px solid rgba(214,230,255,0.18);background:rgba(214,230,255,0.04);",
                  )}
                >
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.1em;color:#94A3B8;",
                    )}
                  >
                    {"파트너십 외 문의"}
                  </span>
                  <span
                    style={css(
                      "font-size:14px;line-height:1.6;color:#CBD5E1;",
                    )}
                  >
                    {
                      "제품·PoC·설치 관련 질문은 아래 순서로 가장 빠르게 해결할 수 있습니다."
                    }
                  </span>
                  <div
                    style={css(
                      "display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;",
                    )}
                  >
                    <a
                      href={"#ask-chat"}
                      style={css(
                        "display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 16px;border-radius:12px;background:#F8FAFC;color:#0B1118;font-size:15px;font-weight:700;",
                      )}
                      className={" reference-hover-14"}
                    >
                      {"Ask "}
                      <span>itriX</span>
                      <span style={css("margin-left:2px;")}>{"→"}</span>
                    </a>
                    <a
                      href={"/contact"}
                      style={css(
                        "display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 16px;border-radius:12px;border:1px solid rgba(214,230,255,0.4);color:#F8FAFC;font-size:15px;",
                      )}
                      className={" reference-hover-15"}
                    >
                      {"일반 문의 "}
                      <span>{"→"}</span>
                    </a>
                  </div>
                </div>
                {"\n        "}
              </div>
              {"\n        "}
              <div
                style={css(
                  "flex:0 1 400px;min-width:0;display:flex;flex-direction:column;border-top:1px solid rgba(214,230,255,0.22);",
                )}
              >
                {"\n          "}
                <a
                  href={"mailto:admin@itrix.co.kr"}
                  style={css(
                    "display:flex;flex-direction:column;gap:8px;padding:22px 0;border-bottom:1px solid rgba(214,230,255,0.22);color:#F8FAFC;",
                  )}
                  className={" reference-hover-16"}
                >
                  {"\n            "}
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.12em;color:#94A3B8;",
                    )}
                  >
                    {"EMAIL"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:18px;font-weight:500;",
                    )}
                  >
                    {"admin@itrix.co.kr"}
                    <span style={css("font-size:16px;color:#94A3B8;")}>
                      {"→"}
                    </span>
                  </span>
                  {"\n          "}
                </a>
                {"\n          "}
                <div
                  style={css(
                    "display:flex;flex-direction:column;gap:8px;padding:22px 0;border-bottom:1px solid rgba(214,230,255,0.22);",
                  )}
                >
                  {"\n            "}
                  <span
                    style={css(
                      "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:12px;letter-spacing:0.12em;color:#94A3B8;",
                    )}
                  >
                    {"OFFICE"}
                  </span>
                  {"\n            "}
                  <span
                    style={css(
                      "font-size:18px;font-weight:500;line-height:1.5;color:#F8FAFC;",
                    )}
                  >
                    {"서울시 서초구 효령로 55길 19, 611호"}
                  </span>
                  {"\n          "}
                </div>
                {"\n        "}
              </div>
              {"\n      "}
            </div>
            {"\n      "}
            <div
              aria-hidden={"true"}
              style={css(
                "height:1px;background:linear-gradient(90deg, rgba(214,230,255,0.45) 0%, rgba(214,230,255,0.12) 100%);",
              )}
            ></div>
            {"\n    "}
          </div>
          {"\n  "}
        </section>
        {"\n\n  "}
      </main>
        <footer
          id={"site-footer"}
          style={css(
            "background:#020406;border-top:1px solid rgba(214,230,255,0.1);padding:64px clamp(20px,6vw,80px) 48px;",
          )}
        >
          {"\n    "}
          <div
            style={css(
              "position:relative;max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:48px;",
            )}
          >
            {"\n      "}
            <div className="ft-top">
              <div
                style={css(
                  "display:flex;flex-direction:column;gap:16px;grid-column:span 2;min-width:0;",
                )}
              >
                {"\n          "}
                <img
                  src={"/brand/itrix-logo-inverse.svg"}
                  alt={"itriX"}
                  style={css("width:120px;height:auto;display:block;")}
                />
                {"\n          "}
                <span
                  style={css(
                    "font-family:'Saira Condensed','Noto Sans KR',sans-serif;font-size:17px;color:#94A3B8;",
                  )}
                >
                  {"Building Computational AI Infrastructure."}
                </span>
                {"\n        "}
              </div>
              <FooterLinks language={values.language} onCookieSettings={ckOpen} />
            </div>
            {"\n      "}
            <div
              style={css(
                "padding-top:24px;border-top:1px solid rgba(214,230,255,0.1);display:flex;flex-direction:column;gap:10px;",
              )}
            >
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
              <div
                style={css(
                  "font-family:'IBM Plex Mono','Noto Sans KR',monospace;font-size:13px;letter-spacing:0.08em;color:#94A3B8;",
                )}
              >
                {"© 2026 itriX ALL RIGHTS RESERVED. · itrix.co.kr"}
              </div>
            </div>
            {"\n    "}
          </div>
          {"\n  "}
        </footer>
        {"\n  "}
        <NoticePopup
          language={values.language}
          onOpenChange={values.noticeChanged}
        />
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
                <a className={"mi"} href={"#portfolio"} onClick={mnClose}>
                  {"Products "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"#technology"} onClick={mnClose}>
                  {"Technology "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"#why"} onClick={mnClose}>
                  {"Company "}
                  <span className={"ar"}>{"→"}</span>
                </a>
                {"\n        "}
                <a className={"mi"} href={"#ask-chat"} onClick={mnClose}>
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
                  {"일반 문의 "}
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
                  href={FORM_LINKS.ko.poc}
                  onClick={mnClose}
                >
                  {"PoC 신청 ↗"}
                </a>
                <div>
                  <span
                    className={"navlang"}
                    role={"group"}
                    aria-label={"Language"}
                  >
                    <a className={"on"} href={"/"} lang={"ko"}>
                      {"KO"}
                    </a>
                    <a className={""} href={"/en/"} lang={"en"}>
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
