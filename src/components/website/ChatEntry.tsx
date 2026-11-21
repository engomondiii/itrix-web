"use client";
import { useEffect } from "react";
import { useLocaleStore } from "@/store/localeStore";
import { useComposerStore } from "@/store/composerStore";
import { LandingSurface } from "@/components/arrival/LandingSurface";
export function ChatEntry() {
  useEffect(() => {
    const query = new URLSearchParams(location.search),
      language = query.has("lang")
        ? query.get("lang") === "ko"
          ? "ko"
          : "en"
        : useLocaleStore.getState().locale;
    useLocaleStore.getState().setLocale(language);
    if (query.get("topic") === "astop" && !useComposerStore.getState().value)
      useComposerStore
        .getState()
        .populate(
          language === "ko"
            ? "ASTOP이 제 작업에 적합한지 알고 싶습니다."
            : "I would like to understand whether ASTOP fits my workload.",
        );
    const announceReady = () => window.parent.postMessage({ type: "itrix-chat-ready" }, location.origin);
    const onMessage = (event: MessageEvent) => {
      if (event.origin === location.origin && event.source === window.parent && event.data?.type === "itrix-chat-check") announceReady();
    };
    window.addEventListener("message", onMessage);
    announceReady();
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return <LandingSurface />;
}
