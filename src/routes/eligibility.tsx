import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ChangeEvent } from "react";
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Loader2, PenLine } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers-store";
import { scanAadhaarImage, type AadhaarScan } from "@/lib/aadhaar-ocr";
import { DISPUTES, RULES } from "@/data/legalAid";
import { INDIA_STATES, findDistrict, findState } from "@/data/india";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Claim Free Legal Aid — LegalAid India" },
      {
        name: "description",
        content:
          "Claim free legal aid anywhere in India under the Legal Services Authorities Act, 1987. Scan your Aadhaar card or answer a few simple questions — we check your eligibility and fill the official application form with you.",
      },
      { property: "og:title", content: "Claim Free Legal Aid — LegalAid India" },
      {
        property: "og:description",
        content: "Scan your Aadhaar card or answer a few simple questions — we fill the official legal aid application form with you.",
      },
    ],
  }),
  component: Questionnaire,
});

type StepKey = "scan" | "category" | "income" | "dispute" | "location" | "details" | "case";

const selectClass =
  "interactive-card w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-lg focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";
const inputClass =
  "interactive-card w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-lg focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function Questionnaire() {
  const { t, b } = useLang();
  const { answers, update } = useAnswers();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<AadhaarScan | null>(null);
  const [showIncomeHelper, setShowIncomeHelper] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");

  const hasCategory = answers.categories.length > 0;
  const provisionallyEligible = hasCategory || answers.incomeUnderCap === true || answers.incomeUncertain;

  const steps: StepKey[] = useMemo(() => {
    const base: StepKey[] = hasCategory ? ["scan", "category", "dispute"] : ["scan", "category", "income", "dispute"];
    return provisionallyEligible ? [...base, "location", "details", "case"] : base;
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

  const handleScanFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || scanning) return;
    setScanning(true);
    const found = await scanAadhaarImage(file);
    const patch: Parameters<typeof update>[0] = { scanUsed: true };
    if (found.applicantName) patch.applicantName = found.applicantName;
    if (found.fatherName) patch.fatherName = found.fatherName;
    if (found.address) patch.address = found.address;
    if (found.gender) patch.gender = found.gender;
    if (found.dob) patch.dob = found.dob;
    update(patch);
    setScanResult(found);
    setScanning(false);
  };

  const scanSummary: { label: string; value: string }[] = [];
  if (scanResult) {
    if (scanResult.applicantName) scanSummary.push({ label: t("nameLabel"), value: scanResult.applicantName });
    if (scanResult.fatherName) scanSummary.push({ label: t("fatherLabel"), value: scanResult.fatherName });
    if (scanResult.gender)
      scanSummary.push({
        label: t("genderLabel"),
        value: scanResult.gender === "female" ? t("genderFemale") : scanResult.gender === "male" ? t("genderMale") : t("genderOther"),
      });
    if (scanResult.dob) scanSummary.push({ label: t("dobLabel"), value: scanResult.dob });
    if (scanResult.address) scanSummary.push({ label: t("addressLabel"), value: scanResult.address });
  }

  const monthly = Number(monthlyIncome.replace(/[^\d]/g, ""));
  const annualEstimate = monthly > 0 ? monthly * 12 : 0;

  const setIncome = (value: boolean) => update({ incomeUnderCap: value, incomeUncertain: false });

  const canContinue =
    currentKey === "scan"
      ? true
      : currentKey === "category"
        ? true
        : currentKey === "income"
          ? answers.incomeUnderCap !== null || answers.incomeUncertain
          : currentKey === "dispute"
            ? Boolean(answers.dispute)
            : currentKey === "location"
              ? Boolean(answers.stateCode && answers.district && (taluks.length === 0 || answers.taluk))
              : currentKey === "details"
                ? Boolean(answers.applicantName.trim() && answers.fatherName.trim() && answers.address.trim() && phoneValid)
                : answers.relief !== "";

  const goNext = () => {
    if (step + 1 >= steps.length) {
      navigate({ to: "/result" });
      return;
    }
    setStep(step + 1);
  };

  const inDetailsPhase = currentKey === "location" || currentKey === "details" || currentKey === "case";

  const optionButtonClass = (selected: boolean) =>
    `interactive-card w-full rounded-lg border-2 px-4 py-4 text-left text-lg ${
      selected ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border bg-background hover:border-primary/40"
    }`;

  return (
    <PageShell step={inDetailsPhase ? 2 : 1}>
      <div key={currentKey} className="card-enter rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {step + 1} / {steps.length}
        </p>

        {currentKey === "scan" && (
          <>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("scanTitle")}</h1>
              <SpeakButton text={`${t("scanTitle")} ${t("scanBody")}`} />
            </div>
            <p className="mt-2 text-muted-foreground">{t("scanBody")}</p>

            <label
              className={`tactile-button mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground hover:bg-accent hover:text-accent-foreground ${
                scanning ? "cursor-wait opacity-70" : "cursor-pointer"
              }`}
            >
              {scanning ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Camera className="h-5 w-5" aria-hidden="true" />
              )}
              {scanning ? t("scanReading") : t("scanButton")}
              <input type="file" accept="image/*" capture="environment" className="sr-only" disabled={scanning} onChange={handleScanFile} />
            </label>

            {scanResult !== null &&
              (scanSummary.length > 0 ? (
                <div className="mt-5 rounded-lg border border-success/50 bg-success/10 p-4">
                  <p className="flex items-center gap-2 font-semibold text-primary">
                    <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
                    {t("scanReadTitle")}
                  </p>
                  <dl className="mt-3 space-y-2">
                    {scanSummary.map((row) => (
                      <div key={row.label} className="flex flex-wrap gap-x-2 text-base">
                        <dt className="font-semibold text-primary">{row.label}:</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : (
                <p className="mt-5 rounded-lg border border-border bg-background px-4 py-3 text-base text-muted-foreground">{t("scanNoneFound")}</p>
              ))}

            <button
              type="button"
              onClick={goNext}
              className="tactile-button mt-4 inline-flex items-center gap-2 rounded-lg border-2 border-input bg-background px-5 py-3 font-semibold text-primary hover:bg-muted"
            >
              <PenLine className="h-4 w-4" aria-hidden="true" />
              {t("scanTypeInstead")}
            </button>
          </>
        )}

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
              <button type="button" onClick={() => setIncome(true)} aria-pressed={answers.incomeUnderCap === true} className={optionButtonClass(answers.incomeUnderCap === true)}>
                {t("yes")}
              </button>
              <button type="button" onClick={() => setIncome(false)} aria-pressed={answers.incomeUnderCap === false} className={optionButtonClass(answers.incomeUnderCap === false)}>
                {t("no")}
              </button>
              <button
                type="button"
                onClick={() => setShowIncomeHelper((v) => !v)}
                aria-pressed={showIncomeHelper}
                aria-expanded={showIncomeHelper}
                className={optionButtonClass(showIncomeHelper)}
              >
                {t("notSure")}
              </button>
            </div>

            {showIncomeHelper && (
              <div className="mt-5 rounded-lg border border-border bg-background p-4">
                <label htmlFor="monthly-income" className="mb-2 block text-lg font-semibold text-primary">
                  {t("monthlyIncomeLabel")}
                </label>
                <input
                  id="monthly-income"
                  value={monthlyIncome}
                  inputMode="numeric"
                  onChange={(e) => setMonthlyIncome(e.target.value.replace(/[^\d]/g, ""))}
                  className={inputClass}
                />
                {annualEstimate > 0 && (
                  <>
                    <p className="mt-4 text-lg">
                      {t("annualEstimateBefore")}{" "}
                      <span className="font-bold text-primary">₹{annualEstimate.toLocaleString("en-IN")}</span>{" "}
                      {t("annualEstimateAfter")}
                    </p>
                    <p className="mt-3 font-semibold text-primary">{t("belowLimitQuestion")}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setIncome(true)} aria-pressed={answers.incomeUnderCap === true} className={optionButtonClass(answers.incomeUnderCap === true)}>
                        {t("yes")}
                      </button>
                      <button type="button" onClick={() => setIncome(false)} aria-pressed={answers.incomeUnderCap === false} className={optionButtonClass(answers.incomeUnderCap === false)}>
                        {t("no")}
                      </button>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => update({ incomeUncertain: true, incomeUnderCap: null })}
                  aria-pressed={answers.incomeUncertain}
                  className={`mt-4 text-left font-semibold underline ${answers.incomeUncertain ? "text-success" : "text-primary"}`}
                >
                  {t("stillDontKnow")}
                </button>
              </div>
            )}
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
              <div className="block">
                <label htmlFor="gender" className="mb-1 block font-semibold text-primary">
                  {t("genderLabel")}
                </label>
                <select
                  id="gender"
                  value={answers.gender}
                  onChange={(e) => update({ gender: e.target.value as AnswersGender })}
                  className={selectClass}
                >
                  <option value="">{t("choose")}</option>
                  <option value="female">{t("genderFemale")}</option>
                  <option value="male">{t("genderMale")}</option>
                  <option value="other">{t("genderOther")}</option>
                </select>
              </div>
              <TextField label={t("dobLabel")} value={answers.dob} onChange={(v) => update({ dob: v })} required={false} />
            </div>
          </>
        )}

        {currentKey === "case" && (
          <>
            <div className="mt-2 flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("caseTitle")}</h1>
              <SpeakButton text={`${t("caseTitle")} ${t("caseHelp")}`} />
            </div>
            <p className="mt-2 text-muted-foreground">{t("caseHelp")}</p>

            <div className="mt-5 space-y-6">
              <div>
                <label htmlFor="opposite-party" className="mb-1 block font-semibold text-primary">
                  {t("oppositeLabel")}
                </label>
                <input
                  id="opposite-party"
                  value={answers.oppositeParty}
                  disabled={answers.oppositeUnknown}
                  onChange={(e) => update({ oppositeParty: e.target.value })}
                  className={`${inputClass} disabled:opacity-50`}
                />
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-base">
                  <input
                    type="checkbox"
                    checked={answers.oppositeUnknown}
                    onChange={(e) => update({ oppositeUnknown: e.target.checked })}
                    className="h-5 w-5 accent-[oklch(0.390_0.082_77)]"
                  />
                  {t("oppositeUnknownLabel")}
                </label>
              </div>

              <div>
                <p className="mb-2 font-semibold text-primary">{t("reliefLabel")}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => update({ relief: "file-case" })}
                    aria-pressed={answers.relief === "file-case"}
                    className={optionButtonClass(answers.relief === "file-case")}
                  >
                    {t("reliefFileCase")}
                  </button>
                  <button
                    type="button"
                    onClick={() => update({ relief: "advice" })}
                    aria-pressed={answers.relief === "advice"}
                    className={optionButtonClass(answers.relief === "advice")}
                  >
                    {t("reliefAdvice")}
                  </button>
                </div>
              </div>

              <YesNoRow
                label={t("previousApplicationLabel")}
                value={answers.previousApplication}
                onChange={(v) => update({ previousApplication: v })}
                yesLabel={t("yesGeneric")}
                noLabel={t("noGeneric")}
              />
              <YesNoRow
                label={t("casePendingLabel")}
                value={answers.casePending}
                onChange={(v) => update({ casePending: v })}
                yesLabel={t("yesGeneric")}
                noLabel={t("noGeneric")}
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
            className="tactile-button inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {step + 1 >= steps.length ? t("seeResult") : t("next")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </PageShell>
  );
}

type AnswersGender = "female" | "male" | "other" | "";

function YesNoRow({
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  yesLabel: string;
  noLabel: string;
}) {
  const btn = (selected: boolean) =>
    `interactive-card rounded-lg border-2 px-4 py-2 text-base ${
      selected ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border bg-background hover:border-primary/40"
    }`;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="max-w-md font-semibold text-primary">{label}</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => onChange(true)} aria-pressed={value} className={btn(value)}>
          {yesLabel}
        </button>
        <button type="button" onClick={() => onChange(false)} aria-pressed={!value} className={btn(!value)}>
          {noLabel}
        </button>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  inputMode,
  error = "",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "tel";
  error?: string;
  required?: boolean;
}) {
  const inputId = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="block">
      <label htmlFor={inputId} className="mb-1 block font-semibold text-primary">
        {label} {required && <span className="text-destructive">*</span>}
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
