import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers-store";
import { DISPUTES, RULES } from "@/data/legalAid";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Eligibility Questions — LegalAid MP" },
      {
        name: "description",
        content: "Answer three simple questions about your category, family income and dispute type to check free legal aid eligibility in Madhya Pradesh.",
      },
      { property: "og:title", content: "Eligibility Questions — LegalAid MP" },
      { property: "og:description", content: "Three simple questions to check your free legal aid eligibility in Madhya Pradesh." },
    ],
  }),
  component: Questionnaire,
});

function Questionnaire() {
  const { t, b } = useLang();
  const { answers, update, hydrated } = useAnswers();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (hydrated && !answers.tehsil) navigate({ to: "/" });
  }, [hydrated, answers.tehsil, navigate]);

  const hasCategory = answers.categories.length > 0;
  const steps: ("category" | "income" | "dispute")[] = hasCategory ? ["category", "dispute"] : ["category", "income", "dispute"];
  const currentKey = steps[Math.min(step, steps.length - 1)];

  const toggleCategory = (id: string) => {
    const next = answers.categories.includes(id) ? answers.categories.filter((c) => c !== id) : [...answers.categories, id];
    update({ categories: next, incomeUnderCap: next.length > 0 ? null : answers.incomeUnderCap });
  };

  const canContinue =
    currentKey === "category" ? true : currentKey === "income" ? answers.incomeUnderCap !== null : Boolean(answers.dispute);

  const goNext = () => {
    if (step + 1 >= steps.length) {
      navigate({ to: "/result" });
      return;
    }
    setStep(step + 1);
  };

  return (
    <PageShell step={2}>
      <div key={currentKey} className="card-enter rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {step + 1} / {steps.length}
        </p>

        {currentKey === "category" && (
          <>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("q1Title")}</h1>
              <SpeakButton text={`${t("q1Title")} ${t("q1Help")}`} />
            </div>
            <p className="mt-2 text-muted-foreground">{t("q1Help")}</p>
            <div className="mt-5 space-y-3">
              {RULES.categories.map((c) => {
                const selected = answers.categories.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    aria-pressed={selected}
                    className={`interactive-card flex w-full items-center gap-3 rounded-lg border-2 px-4 py-4 text-left text-lg ${
                      selected ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border bg-background hover:border-primary/40"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                        selected ? "border-primary bg-primary text-primary-foreground" : "border-input"
                      }`}
                      aria-hidden="true"
                    >
                      {selected ? "✓" : ""}
                    </span>
                    {b(c.label)}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => update({ categories: [] })}
                aria-pressed={!hasCategory}
                className={`interactive-card flex w-full items-center gap-3 rounded-lg border-2 px-4 py-4 text-left text-lg ${
                  !hasCategory ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {t("noneApply")}
              </button>
            </div>
          </>
        )}

        {currentKey === "income" && (
          <>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("q2Title")}</h1>
              <SpeakButton text={`${t("q2Title")} ${t("q2Help")}`} />
            </div>
            <p className="mt-2 text-muted-foreground">{t("q2Help")}</p>
            <div className="mt-5 space-y-3">
              {[
                { value: true, label: t("yes") },
                { value: false, label: t("no") },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => update({ incomeUnderCap: option.value })}
                  aria-pressed={answers.incomeUnderCap === option.value}
                  className={`interactive-card w-full rounded-lg border-2 px-4 py-4 text-left text-lg ${
                    answers.incomeUnderCap === option.value
                      ? "border-primary bg-primary/5 font-semibold text-primary"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}

        {currentKey === "dispute" && (
          <>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("q3Title")}</h1>
              <SpeakButton text={t("q3Title")} />
            </div>
            <p className="mt-2 text-muted-foreground">{t("q3Help")}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {DISPUTES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => update({ dispute: d.id })}
                  aria-pressed={answers.dispute === d.id}
                  className={`interactive-card rounded-lg border-2 px-4 py-4 text-left text-lg ${
                    answers.dispute === d.id
                      ? "border-primary bg-primary/5 font-semibold text-primary"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {b(d.label)}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(step - 1))}
            className="tactile-button inline-flex items-center gap-2 rounded-lg border-2 border-input bg-background px-5 py-3 font-semibold text-primary hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("back")}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="tactile-button inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {step + 1 >= steps.length ? t("seeResult") : t("next")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}
