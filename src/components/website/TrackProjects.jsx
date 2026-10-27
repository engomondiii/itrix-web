const rows = {
  ko: [
    [
      [
        "1",
        "Judge-CIA · 다중 AI 판단 신뢰성 기술",
        "PoC·검증",
        "와이즈와이어즈 및 금융권 관련 PoC를 통한 복수 AI 판단, 오류 독립성 분석 및 판단 신뢰성 검증",
      ],
      [
        "2",
        "PRISM / ASTOP · AI 실행 최적화 기술",
        "프로그램 개발·실증 준비",
        "불필요한 AI 반복 호출을 줄이기 위한 호출 제어·캐시 기술 연구 및 ASTOP 설치형 프로그램 개발",
      ],
      [
        "3",
        "QNTA · 엣지 AI 학습 기술",
        "하드웨어 PoC 검증",
        "DEEPX NPU 기반 기술 검증 및 NVIDIA Jetson AGX Orin의 DLA+CPU 환경에서 학습 경로 재현",
      ],
      [
        "4",
        "AXIOM Tensor · AI 연산 구조 최적화 기술",
        "PoC·최적화 검증",
        "텐서·행렬의 구조적 재표현을 통한 연산 효율 개선 가능성 및 최적화 검증",
      ],
    ],
    [
      [
        "1",
        "보험 자격시험 출제 AI",
        "개발·수행",
        "전문가 검수·승인 흐름을 포함한 문항 생성 업무 시스템",
      ],
      [
        "2",
        "금융 불완전판매 판단 AI",
        "PoC·검증",
        "규정·근거·복수 AI 판단을 통한 상담 규정 위반 가능성 확인",
      ],
      [
        "3",
        "MathGen · 광고 제작 AI",
        "응용 개발",
        "교사의 수학 문항 작성·검토, 브랜드 기준을 반영한 콘텐츠 제작",
      ],
      [
        "4",
        "K-EDA 전자설계 AI",
        "기획·연구",
        "PCB·ECAD 배치·배선·규칙 검토 자동화 R&D 로드맵 검토",
      ],
    ],
  ],
  en: [
    [
      [
        "1",
        "Judge-CIA · Multi-AI decision reliability",
        "PoC · Validation",
        "Validating multi-AI decisions, error-independence analysis and decision reliability through PoCs with WISEWIRES and the financial sector",
      ],
      [
        "2",
        "PRISM / ASTOP · AI execution optimization",
        "Program development · Pilot preparation",
        "Research on call-control and caching to cut unnecessary repeated AI calls, and development of the installable ASTOP program",
      ],
      [
        "3",
        "QNTA · Edge AI training",
        "Hardware PoC validation",
        "Technology validation on DEEPX NPUs, and reproduction of the training path in the DLA + CPU environment of NVIDIA Jetson AGX Orin",
      ],
      [
        "4",
        "AXIOM Tensor · AI computation structure optimization",
        "PoC · Optimization validation",
        "Validating whether structural re-representation of tensors and matrices can improve computational efficiency, and optimization",
      ],
    ],
    [
      [
        "1",
        "Insurance licensing exam item-generation AI",
        "Development · Delivery",
        "Item-generation workflow system with expert review and approval built in",
      ],
      [
        "2",
        "Financial mis-selling detection AI",
        "PoC · Validation",
        "Checks for possible breaches of sales-conversation rules using rules, evidence and multiple AI judgments",
      ],
      [
        "3",
        "MathGen · Ad-creation AI",
        "Applied development",
        "Helps teachers write and review math items; creates content that follows brand guidelines",
      ],
      [
        "4",
        "K-EDA electronic design AI",
        "Planning · Research",
        "Reviewing an R&D roadmap for automating PCB/ECAD placement, routing and rule checks",
      ],
    ],
  ],
};
export default function TrackProjects({ language }) {
  return (
    <div className="track-projects">
      <style>{`.track-projects{min-width:0;display:flex;flex-direction:column;gap:36px}.track-projects h3{font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:400;letter-spacing:.12em;color:#CBD5E1;margin:0 0 16px}.track-projects ul{list-style:none;padding:0;margin:0;border-top:1px solid rgba(214,230,255,.4)}.track-projects li{display:grid;grid-template-columns:minmax(88px,28%) minmax(0,1fr);gap:16px;padding:20px 0;border-bottom:1px solid rgba(214,230,255,.14)}.track-projects .status{align-self:start;justify-self:start;padding:4px 8px;border:1px solid rgba(214,230,255,.5);border-radius:6px;font-size:12px;line-height:1.6;color:#F8FAFC}.track-projects strong{font-size:17px;color:#F8FAFC}.track-projects p{font-size:14px;line-height:1.55;color:#CBD5E1;margin:4px 0 0;overflow-wrap:anywhere}@media(max-width:639px){.track-projects li{grid-template-columns:1fr;gap:10px}}`}</style>
      {rows[language === "en" ? "en" : "ko"].map((items, i) => (
        <div key={i}>
          <h3>{i ? "INDUSTRY PROJECTS" : "CORE TECHNOLOGY VALIDATION"}</h3>
          <ul>
            {items.map(([id, title, status, description]) => (
              <li key={id}>
                <span className="status">{status}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
