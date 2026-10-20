import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers-store";
import { DISPUTES, RULES } from "@/data/legalAid";
import { INDIA_STATES, findDistrict, findState } from "@/data/india";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Eligibility Questions — LegalAid India" },
      {
        name: "description",
        content:
          "Answer three simple questions about your category, family income and dispute type to check free legal aid eligibility anywhere in India. If you qualify, add your state, district and basic details.",
      },
      { property: "og:title", content: "Eligibility Questions — LegalAid India" },
      {
        property: "og:description",
        content: "Three simple questions to check your free legal aid eligibility anywhere in India.",
      },
    ],
  }),
  component: Questionnaire,
});

type StepKey = "category" | "income" | "dispute" | "location" | "details";

const selectClass =
  "interactive-card w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-lg focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
const inputClass =
  "interactive-card w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-lg focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function Questionnaire() {
  const { t, b } = useLang();
  const { answers, update } = useAnswers();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const hasCategory = answers.categories.length > 0;
  const provisionallyEligible = hasCategory || answers.incomeUnderCap === true;

  const steps: StepKey[] = useMemo(() => {
    const base: StepKey[] = hasCategory ? ["category", "dispute"] : ["category", "income", "dispute"];
    return provisionallyEligible ? [...base, "location", "details"] : base;
  }, [hasCategory, provisionallyEligible]);

  const currentKey = steps[Math.min(step, steps.length - 1)]!;

  const state = findState(answers.stateCode);
  const district = findDistrict(state, answers.district);
  const taluks = district?.taluks ?? [];
  const phoneValid = /^[6-9]\d{9}$/.test(answers.phone.replace(/[\s-]/g, ""));

  const toggleCategory = (id: string) => {
    const next = answers.categories.includes(id) ? answers.categories.filter((c) => c !== id) : [...answers.categories, id];
    update({ categories: next, incomeUnderCap: next.length > 0 ? null : answers.incomeUnderCap });
  };

  const canContinue =
    currentKey === "category"
      ? true
      : currentKey === "income"
        ? answers.incomeUnderCap !== null
        : currentKey === "dispute"
          ? Boolean(answers.dispute)
          : currentKey === "location"
            ? Boolean(answers.stateCode && answers.district && (taluks.length === 0 || answers.taluk))
            : Boolean(answers.applicantName.trim() && answers.fatherName.trim() && answers.address.trim() && phoneValid);

  const goNext = () => {
    if (step + 1 >= steps.length) {
      navigate({ to: "/result" });
      return;
    }
    setStep(step + 1);
  };

  const inDetailsPhase = currentKey === "location" || currentKey === "details";

  return (
    <PageShell step={inDetailsPhase ? 2 : 1}>
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

        {currentKey === "location" && (
          <>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("locationTitle")}</h1>
              <SpeakButton text={`${t("locationTitle")} ${t("locationHelp")}`} />
            </div>
            <p className="mt-2 text-muted-foreground">{t("locationHelp")}</p>
            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="state" className="mb-2 block text-lg font-semibold text-primary">
                  {t("stateLabel")}
                </label>
                <select
                  id="state"
                  value={answers.stateCode}
                  onChange={(e) => update({ stateCode: e.target.value, district: "", taluk: "" })}
                  className={selectClass}
                >
                  <option value="">{t("choose")}</option>
                  {INDIA_STATES.map((s) => (
                    <option key={s.code} value={String(s.code)}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="district" className="mb-2 block text-lg font-semibold text-primary">
                  {t("districtLabel")}
                </label>
                <select
                  id="district"
                  value={answers.district}
                  disabled={!state}
                  onChange={(e) => update({ district: e.target.value, taluk: "" })}
                  className={selectClass}
                >
                  <option value="">{t("choose")}</option>
                  {(state?.districts ?? []).map((d) => (
                    <option key={d.code} value={String(d.code)}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="taluk" className="mb-2 block text-lg font-semibold text-primary">
                  {t("talukLabel")}
                </label>
                {taluks.length > 0 ? (
                  <select
                    id="taluk"
                    value={answers.taluk}
                    disabled={!district}
                    onChange={(e) => update({ taluk: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">{t("choose")}</option>
                    {taluks.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="taluk"
                    value={answers.taluk}
                    disabled={!district}
                    onChange={(e) => update({ taluk: e.target.value })}
                    placeholder={t("talukFreeLabel")}
                    className={inputClass}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {currentKey === "details" && (
          <>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("detailsTitle")}</h1>
              <SpeakButton text={`${t("detailsTitle")} ${t("detailsHelp")}`} />
            </div>
            <p className="mt-2 text-muted-foreground">{t("detailsHelp")}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField label={t("nameLabel")} value={answers.applicantName} onChange={(v) => update({ applicantName: v })} />
              <TextField label={t("fatherLabel")} value={answers.fatherName} onChange={(v) => update({ fatherName: v })} />
              <TextField label={t("addressLabel")} value={answers.address} onChange={(v) => update({ address: v })} />
              <TextField
                label={t("phoneLabel")}
                value={answers.phone}
                onChange={(v) => update({ phone: v })}
                inputMode="tel"
                error={answers.phone.trim() && !phoneValid ? t("phoneInvalid") : ""}
              />
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

function TextField({
  label,
  value,
  onChange,
  inputMode,
  error = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "tel";
  error?: string;
}) {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="block">
      <label htmlFor={inputId} className="mb-1 block font-semibold text-primary">
        {label} <span className="text-destructive">*</span>
      </label>
      <input
        id={inputId}
        value={value}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`${inputClass} ${error ? "border-destructive" : ""}`}
      />
      {error && <p className="mt-1 text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
