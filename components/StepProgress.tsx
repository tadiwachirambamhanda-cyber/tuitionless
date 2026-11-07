import { STEP_TOPICS, TOTAL_STEPS } from "@/lib/client/profile";

export function StepProgress({ step }: { step: number }) {
  return (
    <div aria-live="polite">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="font-bold text-brand-text">Step {step} of {TOTAL_STEPS}</p>
        <p className="text-sm text-ink-muted">{STEP_TOPICS[step - 1]}</p>
      </div>
      <div className="grid grid-cols-5 gap-2" aria-hidden="true">
        {STEP_TOPICS.map((t, i) => (
          <span key={t} className={`h-1.5 rounded-full ${i < step ? "bg-(image:--gradient-action)" : "bg-[#F1DDD3]"}`} />
        ))}
      </div>
    </div>
  );
}
