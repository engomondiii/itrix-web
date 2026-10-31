import { FORM_LINKS } from "./formLinks";

export function FooterLinks({ language, onCookieSettings }) {
  const ko = language === "ko";
  const prefix = ko ? "" : "/en";
  return (
    <nav className="ft-cols" aria-label={ko ? "하단 메뉴" : "Footer"}>
      <div>
        <span className="ft-heading">COMPANY</span>
        <a href={`${prefix}/#why`}>Leadership →</a>
        <a href={`${prefix}/contact`}>
          {ko ? "일반 문의 →" : "General inquiry →"}
        </a>
        <a href={`${prefix}/partnership`}>
          {ko ? "파트너십 문의 →" : "Partnership inquiry →"}
        </a>
        <a
          href={FORM_LINKS[ko ? "ko" : "en"].poc}
          target="_blank"
          rel="noopener"
        >
          {ko ? "PoC 신청 ↗" : "Request a PoC ↗"}
        </a>
      </div>
      <div>
        <span className="ft-heading">LEGAL</span>
        <a href={`${prefix}/privacy`}>
          {ko ? "개인정보처리방침 →" : "Privacy Policy →"}
        </a>
        <a href={`${prefix}/terms`}>{ko ? "이용약관 →" : "Terms of Use →"}</a>
        <button className="ft-ck" onClick={onCookieSettings}>
          {ko ? "쿠키 설정" : "Cookie settings"}
        </button>
      </div>
    </nav>
  );
}
