"use client";
import { usePathname } from "next/navigation";
import { ReferencePage } from "./ReferencePage";
import { Template as NotFoundKO } from "./reference/NotFound.dc.template";
import { Template as NotFoundEN } from "./reference/NotFound_EN.dc.template";
import { Template as ErrorKO } from "./reference/Error500.dc.template";
import { Template as ErrorEN } from "./reference/Error500_EN.dc.template";

/** The supplied error design fills the viewport even inside an existing conversation shell. */
export function ReferenceError({ kind }: { kind: "NotFound" | "Error500" }) {
  const en = usePathname()?.startsWith("/en");
  const template =
    kind === "NotFound"
      ? en
        ? NotFoundEN
        : NotFoundKO
      : en
        ? ErrorEN
        : ErrorKO;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        overflowY: "auto",
        background: "#020406",
      }}
    >
      <ReferencePage
        page={kind}
        language={en ? "en" : "ko"}
        template={template}
      />
    </div>
  );
}
