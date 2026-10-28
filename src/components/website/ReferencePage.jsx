"use client";
import React from "react";
import { website } from "./reference/reference-style";

// Shared real state for the client-supplied view templates. No design-tool runtime or eval.
export class ReferencePage extends React.Component {
  state = {
    ckShow: false,
    ckPanel: false,
    ckAna: false,
    mn: false,
    v: {},
    err: {},
    priv: false,
    mkt: false,
    modal: null,
    status: "idle",
    ind: -1,
    when: -1,
    ty: -1,
    captcha: "",
    reference: "",
    failure: "",
    unsubscribe: "confirm",
  };
  componentDidMount() {
    this.unmounted = false;
    this.requestId = crypto.randomUUID();
    this.scrollToSection = () => {
      const id = location.hash.slice(1);
      const target = document.getElementById(id === "ask-chat" ? "ask" : id);
      if (target)
        target.scrollIntoView({ block: "start", behavior: "instant" });
    };
    this.scrollFrame = requestAnimationFrame(this.scrollToSection);
    // Web fonts can change the height of every section above a deep link.
    // Re-align once the initial layout has settled, including Firefox's load scroll.
    const initialHash = location.hash;
    this.alignInitialSection = () => {
      if (!this.unmounted && initialHash && location.hash === initialHash) {
        cancelAnimationFrame(this.scrollFrame);
        this.scrollFrame = requestAnimationFrame(this.scrollToSection);
      }
    };
    window.addEventListener("load", this.alignInitialSection, { once: true });
    document.fonts?.ready.then(this.alignInitialSection);
    window.addEventListener("hashchange", this.scrollToSection);
    try {
      const saved = JSON.parse(localStorage.getItem("itrixCookie") || "null");
      this.setState({ ckShow: !saved, ckAna: !!saved?.analytics });
    } catch {
      this.setState({ ckShow: true });
    }
    if (this.props.page === "Unsubscribe") {
      this.token = new URLSearchParams(location.search).get("token") || "";
      website("unsubscribe?token=" + encodeURIComponent(this.token))
        .then((r) =>
          this.setState({
            unsubscribe: r.subscribed ? "confirm" : "done",
            maskedEmail: r.email,
          }),
        )
        .catch(() => this.setState({ unsubscribe: "invalid" }));
    }
    this.observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) =>
          e.target.classList.toggle("is-in", e.isIntersecting),
        ),
      { threshold: 0.15 },
    );
    document
      .querySelectorAll(".stat-glow")
      .forEach((el) => this.observer.observe(el));
  }
  componentWillUnmount() {
    this.unmounted = true;
    window.removeEventListener("load", this.alignInitialSection);
    this.observer?.disconnect();
    cancelAnimationFrame(this.scrollFrame);
    window.removeEventListener("hashchange", this.scrollToSection);
  }
  saveCookies = (analytics) => {
    try {
      localStorage.setItem(
        "itrixCookie",
        JSON.stringify({ necessary: true, analytics, ts: Date.now() }),
      );
    } catch {}
    this.setState({ ckShow: false, ckPanel: false, ckAna: analytics });
    // No analytics provider is configured; consent alone never adds third-party tracking.
  };
  submit = async () => {
    if (this.state.status === "sending") return;
    const s = this.state,
      ko = this.props.language === "ko",
      poc = this.props.page === "PoC";
    const err = {};
    for (const k of poc
      ? ["company", "name", "email", "use"]
      : ["name", "email", "msg"])
      if (!String(s.v[k] || "").trim())
        err[k] = ko ? "필수 항목입니다." : "This field is required.";
    if (s.v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.v.email))
      err.email = ko
        ? "이메일을 확인하세요."
        : "Please check the email format.";
    if (!s.priv)
      err.priv = ko
        ? "개인정보 수집에 동의하세요."
        : "Please accept the privacy notice.";
    if (!s.captcha)
      err.cap = ko
        ? "스팸 검사를 완료하세요."
        : "Please complete the spam check.";
    if (Object.keys(err).length) {
      this.setState({ err });
      return;
    }
    this.setState({ status: "sending", err: {}, failure: "" });
    try {
      const config = await website("config");
      const fields = {};
      for (const key of ["role", "phone", "tools", "use"])
        if (s.v[key]) fields[key] = s.v[key];
      if (poc) {
        fields.industry =
          [
            "Manufacturing",
            "Finance",
            "IT · Software",
            "Public · Research",
            "Other",
          ][s.ind] || "";
        fields.when =
          ["Within 1 month", "1–3 months", "After 3 months", "Not decided"][
            s.when
          ] || "";
      } else {
        fields.message = s.v.msg;
        fields.inquiry_route =
          this.props.page === "Partnership" ? "partnership" : "contact";
        if (this.props.page === "Partnership")
          fields.partnership_type =
            ["Joint validation", "PoC", "Licensing", "Large-scale deployment"][
              s.ty
            ] || "";
        fields.topic =
          this.props.page === "Partnership"
            ? "Partnership / Large-scale deployment"
            : ["Product / install", "PoC", "Technical", "Other"][s.ty] || "";
      }
      const interest =
        !poc &&
        new URLSearchParams(location.search).get("topic") === "interest";
      const result = await website("intake", {
        kind: poc ? "poc" : interest ? "interest" : "contact",
        language: this.props.language,
        company: s.v.company || "",
        name: s.v.name,
        email: s.v.email,
        fields,
        privacy: s.priv,
        newsletter: poc && s.mkt,
        privacy_version: config.privacy_version,
        captcha: s.captcha,
        request_id: this.requestId,
      });
      this.setState({ status: "sent", reference: result.reference });
    } catch (error) {
      this.setState({
        status: "failed",
        captcha: "",
        failure: ko
          ? "전송하지 못했습니다. 스팸 검사를 다시 완료하고 재시도하세요."
          : "We could not submit this request. Complete the spam check again and retry.",
      });
      window.dispatchEvent(new Event("itrix-captcha-reset"));
    }
  };
  values() {
    const s = this.state;
    const values = {
      language: this.props.language,
      maskedEmail: s.maskedEmail || "",
      ckBar: s.ckShow && !s.ckPanel,
      ckPanel: s.ckPanel,
      ckAnaOn: s.ckAna ? "on" : "",
      ckTgAna: () => this.setState({ ckAna: !s.ckAna }),
      ckAll: () => this.saveCookies(true),
      ckNec: () => this.saveCookies(false),
      ckSaveSel: () => this.saveCookies(s.ckAna),
      ckOpen: () => this.setState({ ckPanel: true }),
      ckClose: () => this.setState({ ckPanel: false }),
      mnShow: s.mn,
      mnOpen: () => this.setState({ mn: true }),
      mnClose: () => this.setState({ mn: false }),
      showGrid: true,
      videoRef: (el) => {
        if (el) {
          el.muted = true;
          el.play().catch(() => {});
        }
      },
      askAstop: (event) => {
        event.preventDefault();
        location.href =
          (this.props.language === "ko" ? "/" : "/en") +
          "?topic=astop#ask-chat";
      },
      reload: () => location.reload(),
      isIdle: s.status === "idle",
      isSending: s.status === "sending",
      isFailed: s.status === "failed",
      isSent: s.status === "sent",
      notSent: s.status !== "sent",
      privOn: s.priv ? "on" : "",
      mktOn: s.mkt ? "on" : "",
      tgPriv: () => this.setState({ priv: !s.priv }),
      tgMkt: () => this.setState({ mkt: !s.mkt }),
      mPriv: s.modal === "priv",
      mMkt: s.modal === "mkt",
      openPriv: () => this.setState({ modal: "priv" }),
      openMkt: () => this.setState({ modal: "mkt" }),
      closeM: () => this.setState({ modal: null }),
      agreePriv: () => this.setState({ priv: true, modal: null }),
      agreeMkt: () => this.setState({ mkt: true, modal: null }),
      e_priv: s.err.priv || "",
      e_cap: s.err.cap || "",
      send: this.submit,
      again: () => this.setState({ status: "idle", failure: "" }),
      onCaptcha: (token) => this.setState({ captcha: token }),
      isConfirm: s.unsubscribe === "confirm",
      isDone: s.unsubscribe === "done",
      isResub: s.unsubscribe === "resub",
      isInvalid: s.unsubscribe === "invalid",
      doUnsub: () => this.subscription(false),
      doResub: () => this.subscription(true),
    };
    for (const key of [
      "company",
      "name",
      "email",
      "role",
      "phone",
      "tools",
      "use",
      "msg",
    ]) {
      values["v_" + key] = s.v[key] || "";
      values["e_" + key] = s.err[key] || "";
      values["ec_" + key] = s.err[key] ? "bad" : "";
      values["in_" + key] = (event) =>
        this.setState({
          v: { ...s.v, [key]: event.target.value },
          err: { ...s.err, [key]: "" },
        });
    }
    for (const [key, count] of [
      ["ind", 5],
      ["when", 4],
      ["ty", 4],
    ])
      for (let i = 0; i < count; i++) {
        values[key + i] = s[key] === i ? "on" : "";
        values["set_" + key + i] = () => this.setState({ [key]: i });
      }
    return values;
  }
  async subscription(subscribe) {
    try {
      await website("unsubscribe", { token: this.token, subscribe });
      this.setState({ unsubscribe: subscribe ? "resub" : "done" });
    } catch {
      this.setState({ unsubscribe: "invalid" });
    }
  }
  render() {
    const Template = this.props.template;
    return (
      <div
        className="itrix-reference"
        style={{
          background: "#020406",
          color: "#F8FAFC",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+KR:wght@300;400;700&family=Saira+Condensed:wght@400;500;600;700&display=swap"
        />
        <style>{`.itrix-reference section[id]{scroll-margin-top:88px}@media(max-width:820px){.itrix-reference section[id]{scroll-margin-top:80px}}.itrix-reference button{cursor:pointer}.itrix-reference input,.itrix-reference textarea{max-width:100%}.itrix-reference :focus-visible{outline:2px solid #D6E6FF;outline-offset:4px}@media(max-width:820px){.itrix-reference{overflow-x:clip}}`}</style>
        {this.state.reference && (
          <div
            role="status"
            style={{
              position: "fixed",
              top: 80,
              right: 20,
              zIndex: 100,
              padding: 16,
              background: "#1F2937",
            }}
          >
            {" "}
            {this.state.reference}
          </div>
        )}
        {this.state.failure && (
          <div
            role="alert"
            style={{
              position: "fixed",
              bottom: 24,
              left: 24,
              zIndex: 100,
              padding: 16,
              maxWidth: 500,
              background: "#1F2937",
            }}
          >
            {this.state.failure}
          </div>
        )}
        <Template {...this.values()} />
      </div>
    );
  }
}
