import type { ReactNode } from "react";
import { Alert, Inbox } from "./icons";

export function StatePanel({ tone = "empty", title, help, action }: { tone?: "empty" | "error"; title: string; help?: string; action?: ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : undefined} className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-12 text-center">
      <span className={`grid h-14 w-14 place-items-center rounded-2xl ${tone === "error" ? "bg-error-bg text-error" : "bg-surface-muted text-brand-text"}`}>
        {tone === "error" ? <Alert size={28} /> : <Inbox size={28} />}
      </span>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      {help && <p className="text-ink-muted">{help}</p>}
      {action && <div className="mt-2 w-full sm:w-auto">{action}</div>}
    </div>
  );
}
