import { Check } from "lucide-react";
import { useLang, type TranslationKey } from "@/lib/i18n";

const STEPS: TranslationKey[] = ["step1", "step2", "step3", "step4", "step5"];

export function StepIndicator({ current }: { current: 1 | 2 | 3 | 4 | 5 }) {
  const { t } = useLang();

  return (
    <ol className="mx-auto flex max-w-4xl items-center gap-1 px-4 py-4 print:hidden" aria-label="Progress">
      {STEPS.map((key, i) => {
        const index = i + 1;
        const done = index < current;
        const active = index === current;
        return (
          <li key={key} className="flex flex-1 items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <span
                aria-current={active ? "step" : undefined}
                 className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                  done
                    ? "border-success bg-success text-success-foreground"
                    : active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" aria-hidden="true" /> : index}
              </span>
              <span className={`text-center text-[11px] leading-tight sm:text-xs ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                {t(key)}
              </span>
            </div>
            {index < STEPS.length && <span className={`mt-[-18px] h-0.5 flex-1 ${done ? "bg-success" : "bg-border"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
