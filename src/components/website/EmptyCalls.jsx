"use client";
import { useEffect, useState } from "react";
const copy = {
  ko: {
    bar: "‘빈손 호출’ 반영 · 호출 로그형",
    replay: "다시 재생",
    h2: '<span class="ec-q">빈손 호출</span>은 줄이고,<br>결과는 그대로.',
    lead: "기존 AI 에이전트는 작업이 끝났는지 확인하려고 같은 호출을 반복합니다. 대부분은 바뀐 것 없이 돌아오는 <strong>빈손 호출</strong>이지만, 호출할 때마다 사용료가 발생합니다. ASTOP은 상태가 바뀐 순간에만 AI를 호출합니다.",
    l1n: "기존 AI 에이전트",
    l1d: "정해진 간격마다 확인합니다.",
    l2n: "ASTOP · PRISM 적용",
    l2d: "상태가 바뀔 때만 확인합니다.",
    live: "실행 중",
    fin: "완료",
    q: "작업이 끝났나요?",
    e: "빈손",
    nochg: "변화 없음",
    done: "완료 확인 → 다음 단계",
    ok: "결과",
    wait: "대기 중 · 호출 없음",
    chg: "상태 변화 감지 → 판단 요청",
    mk: "사용한 호출",
    leg: [
      '<span><i class="ec-sw" style="background:repeating-linear-gradient(135deg,rgba(148,163,184,.55) 0 2px,transparent 2px 6px)"></i>빈손 호출 · 비용만 발생</span>',
      '<span><i class="ec-sw" style="background:#F8FAFC;border-color:#F8FAFC"></i>결과를 얻은 호출</span>',
    ],
    sum: (n) => `빈손 호출 <s>${n}</s> → 0회`,
    note: "예시 시나리오입니다. 실제 호출 수는 작업과 환경에 따라 다릅니다.",
  },
  en: {
    bar: "‘Empty-handed call’ · call log",
    replay: "Replay",
    h2: 'Fewer <span class="ec-q">empty-handed calls</span>,<br>the same result.',
    lead: "Existing AI agents keep calling to check whether a task is done. Most of those calls come back <strong>empty-handed</strong>, with nothing changed, yet every call is billed. ASTOP calls AI only when the state actually changes.",
    l1n: "Existing AI agent",
    l1d: "Checks at fixed intervals.",
    l2n: "ASTOP · with PRISM",
    l2d: "Checks only when the state changes.",
    live: "RUNNING",
    fin: "DONE",
    q: "Is the task done?",
    e: "Empty",
    nochg: "No change",
    done: "Done → next step",
    ok: "Result",
    wait: "Waiting · no calls",
    chg: "State change → decision requested",
    mk: "Calls used",
    leg: [
      '<span><i class="ec-sw" style="background:repeating-linear-gradient(135deg,rgba(148,163,184,.55) 0 2px,transparent 2px 6px)"></i>Empty-handed call · cost only</span>',
      '<span><i class="ec-sw" style="background:#F8FAFC;border-color:#F8FAFC"></i>Call that returned a result</span>',
    ],
    sum: (n) => `Empty-handed calls <s>${n}</s> → 0`,
    note: "Example scenario. Actual call counts vary by task and environment.",
  },
};

export default function EmptyCalls({ language }) {
  const [step, setStep] = useState(10);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    let started;
    const sync = () => {
      clearInterval(timer);
      if (motion.matches) {
        setStep(10);
        return;
      }
      started = Date.now();
      setStep(0);
      timer = setInterval(() => {
        const elapsed = (Date.now() - started) % 10000;
        setStep(
          Math.max(0, Math.min(10, Math.floor((elapsed - 400) / 700) + 1)),
        );
      }, 100);
    };
    sync();
    motion.addEventListener("change", sync);
    return () => {
      clearInterval(timer);
      motion.removeEventListener("change", sync);
    };
  }, []);
  const t = copy[language === "en" ? "en" : "ko"];
  const clock = (i) => {
    const s = 12 + i * 6;
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };
  return (
    <div className="empty-calls">
      <style>
        {
          '.empty-calls{--bg:#020406;--fg:#F8FAFC;--lead:#E2E8F0;--body:#CBD5E1;--sub:#94A3B8;--muted:#64748B;--ice:#D6E6FF;--line:rgba(214,230,255,.16);--line2:rgba(214,230,255,.10);--f-disp:"Saira Condensed","Noto Sans KR",sans-serif;--f-body:"Noto Sans KR",sans-serif;--f-mono:"IBM Plex Mono",monospace;color:var(--fg)}.ec-sec{background:var(--bg);padding:clamp(48px,7vw,112px) clamp(20px,5vw,72px)}\n\n.ec-wrap{max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:40px}\n.ec-intro{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr));gap:20px 88px;align-items:end}\n\n.ec-intro h2{margin:0;font-size:clamp(28px,3vw,40px);font-weight:700;line-height:1.28;text-wrap:balance}\n\n.ec-intro h2 .ec-q{font-family:var(--f-mono);font-weight:500;font-size:.62em;letter-spacing:.02em;color:var(--ice);border:1px dashed rgba(214,230,255,.5);border-radius:8px;padding:2px 10px;vertical-align:.18em;margin-right:6px}\n.ec-intro p{margin:0;max-width:36em;font-size:17px;line-height:1.7;color:var(--body)}\n\n.ec-intro p strong{color:var(--fg)}\n\n/* two logs */\n.ec-logs{display:grid;grid-template-columns:1fr 1fr;gap:20px}\n\n.ec-log{border-radius:20px;border:1px solid var(--line);background:linear-gradient(160deg,rgba(255,255,255,.06),rgba(255,255,255,.01) 50%),rgba(8,13,16,.55);display:flex;flex-direction:column;min-width:0;overflow:hidden}\n.ec-log.ec-astop{border-color:rgba(214,230,255,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 0 1px rgba(214,230,255,.08)}\n.ec-lh{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:22px 24px 16px;border-bottom:1px solid var(--line2)}\n.ec-lh .ec-n{font-size:18px;font-weight:700;color:var(--lead)}\n.ec-log.ec-astop .ec-lh .ec-n{font-family:var(--f-disp);font-size:24px;font-weight:600;color:var(--fg);line-height:1.1}\n.ec-lh .ec-d{font-size:13px;color:var(--body);margin-top:4px;line-height:1.5}\n.ec-live{font-family:var(--f-mono);font-size:11px;letter-spacing:.1em;color:var(--sub);display:flex;align-items:center;gap:6px;white-space:nowrap;padding-top:4px}\n.ec-live i{width:7px;height:7px;border-radius:50%;background:var(--muted)}\n.ec-live.ec-on i{background:#10B981;box-shadow:0 0 0 3px rgba(16,185,129,.18)}\n\n.ec-rows{position:relative;height:300px;overflow:hidden;padding:10px 16px;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;\n  -webkit-mask:linear-gradient(to bottom,transparent 0,#000 70px);mask:linear-gradient(to bottom,transparent 0,#000 70px)}\n\n.ec-r{display:grid;grid-template-columns:52px 1fr auto;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;font-family:var(--f-mono);font-size:12px;color:var(--sub);\n  animation:ec-in .35s ease-out}\n\n.ec-r .ec-t{color:var(--muted);font-variant-numeric:tabular-nums}\n.ec-r .ec-m{color:var(--body);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--f-body);font-size:13px}\n\n.ec-tag{font-size:11px;letter-spacing:.04em;padding:2px 8px;border-radius:999px;white-space:nowrap}\n.ec-tag.ec-e{color:var(--sub);border:1px dashed rgba(148,163,184,.55)}\n.ec-tag.ec-ok{color:#0B1118;background:var(--fg);font-weight:500}\n.ec-r.ec-empty{background:rgba(214,230,255,.025)}\n.ec-r.ec-done{background:rgba(214,230,255,.09);border:1px solid rgba(214,230,255,.35)}\n.ec-r.ec-done .ec-m{color:var(--fg);font-weight:700}\n.ec-r.ec-wait{color:var(--muted)}\n.ec-r.ec-wait .ec-m{color:var(--muted);font-family:var(--f-mono);font-size:12px;letter-spacing:.04em}\n.ec-r.ec-flash{animation:ec-in .35s ease-out, ec-glow 1.4s ease-out}\n@keyframes ec-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n@keyframes ec-glow{0%{box-shadow:0 0 0 0 rgba(214,230,255,.0)}20%{box-shadow:0 0 0 4px rgba(214,230,255,.18),0 0 26px rgba(214,230,255,.35)}100%{box-shadow:none}}\n\n.ec-meter{padding:16px 24px 22px;border-top:1px solid var(--line2);display:flex;flex-direction:column;gap:10px}\n.ec-mtop{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-family:var(--f-mono);font-size:11px;letter-spacing:.12em;color:var(--sub);text-transform:uppercase}\n.ec-mtop b{font-family:var(--f-disp);font-size:26px;letter-spacing:0;color:var(--fg);font-weight:600;font-variant-numeric:tabular-nums;text-transform:none}\n.ec-cells{display:grid;grid-template-columns:repeat(10,1fr);gap:4px}\n.ec-cell{height:14px;border-radius:3px;border:1px solid rgba(214,230,255,.16);background:transparent;transition:background .3s,border-color .3s}\n.ec-cell.ec-e{background:repeating-linear-gradient(135deg,rgba(148,163,184,.55) 0 2px,transparent 2px 6px);border-color:rgba(148,163,184,.55)}\n.ec-cell.ec-ok{background:var(--fg);border-color:var(--fg)}\n.ec-leg{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:var(--sub)}\n.ec-leg span{display:inline-flex;align-items:center;gap:6px}\n.ec-leg .ec-sw{width:12px;height:10px;border-radius:2px;border:1px solid rgba(148,163,184,.55)}\n\n.ec-sum{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 28px;padding-top:4px;border-top:1px solid rgba(214,230,255,.4);padding-top:24px}\n.ec-sum .ec-big{font-family:var(--f-disp);font-weight:600;font-size:clamp(30px,3.4vw,44px);line-height:1.1;color:var(--fg)}\n.ec-sum .ec-big s{color:var(--muted);text-decoration-thickness:2px}\n.ec-sum .ec-note{font-size:12px;color:var(--muted)}\n@media (prefers-reduced-motion: reduce){.ec-r,.ec-r.ec-flash{animation:none}.ec-frame,.ec-cell{transition:none}}\n@media(max-width:639px){.ec-logs,.ec-intro{grid-template-columns:1fr}.ec-sec{padding:56px 20px}.ec-rows{height:200px}.ec-r{grid-template-columns:44px minmax(0,1fr) auto;font-size:11px;padding:7px 8px}.ec-r .ec-m{font-size:12px}.ec-intro p{font-size:15px}.ec-intro h2{font-size:28px}}'
        }
      </style>
      <section
        className="ec-sec"
        aria-label={language === "en" ? "How it works" : "작동 방식"}
      >
        <div className="ec-wrap">
          <div className="ec-intro">
            <h2 dangerouslySetInnerHTML={{ __html: t.h2 }} />
            <p dangerouslySetInnerHTML={{ __html: t.lead }} />
          </div>
          <div className="ec-logs">
            {[false, true].map((astop) => (
              <div
                className={"ec-log" + (astop ? " ec-astop" : "")}
                key={String(astop)}
              >
                <div className="ec-lh">
                  <div>
                    <div className="ec-n">{astop ? t.l2n : t.l1n}</div>
                    <div className="ec-d">{astop ? t.l2d : t.l1d}</div>
                  </div>
                  <div className={"ec-live" + (step < 10 ? " ec-on" : "")}>
                    <i />
                    <span>{step < 10 ? t.live : t.fin}</span>
                  </div>
                </div>
                <div className="ec-rows">
                  {(astop
                    ? [2, 5, 9].filter((i) => step > i)
                    : Array.from({ length: step }, (_, i) => i).slice(-9)
                  ).map((i) => (
                    <div
                      key={i}
                      className={
                        "ec-r " +
                        (i === 9
                          ? "ec-done ec-flash"
                          : astop
                            ? "ec-wait"
                            : "ec-empty")
                      }
                    >
                      <span className="ec-t">{clock(i)}</span>
                      <span className="ec-m">
                        {i === 9
                          ? astop
                            ? t.chg
                            : t.done
                          : astop
                            ? t.wait
                            : `${t.q} → ${t.nochg}`}
                      </span>
                      {(!astop || i === 9) && (
                        <span
                          className={"ec-tag " + (i === 9 ? "ec-ok" : "ec-e")}
                        >
                          {i === 9 ? t.ok : "□ " + t.e}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="ec-meter">
                  <div className="ec-mtop">
                    <span>{t.mk}</span>
                    <b data-call-count={astop ? "astop" : "existing"}>
                      {astop ? (step === 10 ? 1 : 0) : step}
                    </b>
                  </div>
                  <div className="ec-cells">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span
                        key={i}
                        className={
                          "ec-cell " +
                          (astop
                            ? step === 10 && i === 0
                              ? "ec-ok"
                              : ""
                            : i < step
                              ? i === 9
                                ? "ec-ok"
                                : "ec-e"
                              : "")
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="ec-leg"
            dangerouslySetInnerHTML={{ __html: t.leg.join("") }}
          />
          <div className="ec-sum">
            <div
              className="ec-big"
              dangerouslySetInnerHTML={{ __html: t.sum(9) }}
            />
            <div className="ec-note">{t.note}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
