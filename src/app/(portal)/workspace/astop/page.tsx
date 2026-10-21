"use client";
import { useEffect, useState } from "react";
import { LocalizedText as L } from "@/components/i18n/LocalizedText";
import { AstopDecision } from "@/components/astop/AstopDecision";
import { StoreRoutes } from "@/components/website/StoreRoutes";
import { useLocaleStore } from "@/store/localeStore";
type Order = { id: string; status: string; amount: string; legal_body: string };
type Renewal = {
  id: string;
  amount: string;
  refund_status: string;
  paid_at: string;
};
type License = {
  id: string;
  status: string;
  ends_at: string | null;
  auto_renew: boolean;
};
async function call<T>(path: string, data?: unknown): Promise<T> {
  const r = await fetch("/api/commerce/" + path, {
    method: data ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
  const result = await r.json();
  if (!r.ok)
    throw new Error(
      typeof result.detail === "string" ? result.detail : "Request failed",
    );
  return result;
}
export default function Page() {
  const language = useLocaleStore((s) => s.locale),
    [orders, setOrders] = useState<Order[]>([]),
    [licenses, setLicenses] = useState<License[]>([]),
    [renewals, setRenewals] = useState<Renewal[]>([]),
    [error, setError] = useState(""),
    [reason, setReason] = useState("");
  function load() {
    Promise.all([
      call<Order[]>("orders"),
      call<License[]>("licenses"),
      call<Renewal[]>("renewals"),
    ])
      .then(([o, l, r]) => {
        setOrders(o);
        setLicenses(l);
        setRenewals(r);
      })
      .catch((e) => setError(e.message));
  }
  useEffect(() => {
    load();
  }, []);
  async function act(path: string, data: unknown) {
    try {
      await call(path, data);
      setError("");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    }
  }
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl">
        <L
          en="ASTOP access and account history"
          ko="ASTOP 이용 안내 및 계정 기록"
        />
      </h1>
      <StoreRoutes language={language} />
      <p>
        <L
          en="Historical accepted agreements remain unchanged. New retail purchase and installation will take place through the confirmed Stores."
          ko="기존에 동의한 계약은 유지됩니다. 신규 소매 구매 및 설치는 확인된 Store를 통해 이루어집니다."
        />
      </p>
      {error && <p role="alert">{error}</p>}
      {orders.map((o) => (
        <section key={o.id} className="border rounded p-4 space-y-3">
          <p>
            USD {o.amount} · {o.status}
          </p>
          <details>
            <summary>
              <L en="Your accepted agreement" ko="동의한 계약" />
            </summary>
            <pre className="whitespace-pre-wrap">{o.legal_body}</pre>
          </details>
          {o.status === "paid" && (
            <>
              <label>
                <L en="Refund review reason" ko="환불 검토 사유" />
                <textarea
                  className="block border p-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
              <button
                disabled={!reason.trim()}
                onClick={() =>
                  void act("orders/" + o.id + "/refund", { reason })
                }
              >
                <L
                  en="Request refund review under my accepted terms"
                  ko="기존 계약에 따른 환불 검토 요청"
                />
              </button>
            </>
          )}
        </section>
      ))}
      {licenses.map((l) => (
        <section key={l.id} className="border rounded p-4">
          <p>
            {l.status} · {l.ends_at}
          </p>
          <AstopDecision licenseId={l.id} />
          {l.auto_renew && (
            <button
              onClick={() =>
                void act("licenses/" + l.id + "/cancel-renewal", {})
              }
            >
              <L en="Cancel future renewal" ko="향후 갱신 취소" />
            </button>
          )}
        </section>
      ))}
      {renewals.map((r) => (
        <section key={r.id} className="border rounded p-4">
          <p>
            USD {r.amount} · {r.paid_at} · {r.refund_status}
          </p>
          <label>
            <L en="Renewal refund review reason" ko="갱신 환불 검토 사유" />
            <textarea
              className="block border p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button
            disabled={!reason.trim() || r.refund_status === "refunded"}
            onClick={() => void act("renewals", { id: r.id, reason })}
          >
            <L en="Request renewal refund review" ko="갱신 환불 검토 요청" />
          </button>
        </section>
      ))}
    </main>
  );
}
