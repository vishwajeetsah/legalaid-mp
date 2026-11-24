import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Printer, X, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers-store";
import { evaluate, requiredDocuments } from "@/lib/eligibility";
import { DISPUTES, DOCUMENTS, OFFICES, RULES, SAGAR_DISTRICT_CODE, SAGAR_TALUK_OFFICE } from "@/data/legalAid";
import { findDistrict, findState } from "@/data/india";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents & Application — LegalAid India" },
      {
        name: "description",
        content: "Your personalised legal aid document checklist and a printable, pre-filled legal aid application (PDF) for your district DLSA office.",
      },
      { property: "og:title", content: "Documents & Application — LegalAid India" },
      { property: "og:description", content: "Personalised document checklist and printable pre-filled legal aid application form." },
    ],
  }),
  component: Documents,
});

function Documents() {
  const { t, b, lang } = useLang();
  const { answers, update, hydrated } = useAnswers();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (hydrated && answers.categories.length === 0 && answers.incomeUnderCap === null && !answers.dispute) {
      navigate({ to: "/" });
    }
  }, [hydrated, answers.categories.length, answers.incomeUnderCap, answers.dispute, navigate]);

  const docs = useMemo(() => requiredDocuments(answers), [answers]);
  const verdict = useMemo(() => evaluate(answers), [answers]);
  const state = findState(answers.stateCode);
  const district = findDistrict(state, answers.district);
  const sagarOfficeId = answers.district === SAGAR_DISTRICT_CODE ? SAGAR_TALUK_OFFICE[answers.taluk.toLowerCase()] : undefined;
  const office = sagarOfficeId ? OFFICES[sagarOfficeId] : undefined;
  const officeName = office
    ? b(office.name)
    : district
      ? lang === "hi"
        ? `जिला विधिक सेवा प्राधिकरण (डीएलएसए), ${district.name}`
        : `District Legal Services Authority (DLSA), ${district.name}`
      : "";
  const officeAddress = office
    ? b(office.address)
    : district
      ? lang === "hi"
        ? `जिला एवं सत्र न्यायालय परिसर, ${district.name} (${state?.name ?? ""})`
        : `District & Sessions Court Premises, ${district.name} (${state?.name ?? ""})`
      : "";
  const matchedCategories = RULES.categories.filter((c) => answers.categories.includes(c.id));
  const incomeClaimed = matchedCategories.length === 0 && (answers.incomeUnderCap === true || answers.incomeUncertain);
  const incomeValue = matchedCategories.length
    ? `${t("f7NA")} ${verdict.sections.join(", ")}`
    : answers.incomeUnderCap
      ? t("f7Below")
      : answers.incomeUncertain
        ? t("f7Confirm")
        : t("f7Above");
  const dispute = DISPUTES.find((d) => d.id === answers.dispute);
  const blank = t("notFilled");
  const reliefValue = answers.relief === "advice" ? t("f9Advice") : answers.relief === "file-case" ? t("f9File") : blank;

  const phoneValid = /^[6-9]\d{9}$/.test(answers.phone.replace(/[\s-]/g, ""));
  const errors = {
    applicantName: !answers.applicantName.trim() ? t("fieldRequired") : "",
    fatherName: !answers.fatherName.trim() ? t("fieldRequired") : "",
    address: !answers.address.trim() ? t("fieldRequired") : "",
    phone: !answers.phone.trim() ? t("fieldRequired") : !phoneValid ? t("phoneInvalid") : "",
  };
  const formValid = !errors.applicantName && !errors.fatherName && !errors.address && !errors.phone;

  const handleGenerate = () => {
    setTried(true);
    if (formValid) setOpen(true);
  };

  return (
    <PageShell step={4}>
      <section className="card-enter rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("docsTitle")}</h1>
          <SpeakButton text={`${t("docsTitle")}. ${docs.map((d) => b(DOCUMENTS[d]!)).join(". ")}`} />
        </div>
        <p className="mt-2 text-muted-foreground">{t("docsHelp")}</p>
        <p className="mt-1 text-sm font-medium text-accent">{t("docsTickHint")}</p>

        <ul className="mt-5 space-y-3">
          {docs.map((id) => {
            const isChecked = checked.includes(id);
            return (
              <li key={id}>
                <label
                  className={`interactive-card flex cursor-pointer items-start gap-3 rounded-lg border-2 px-4 py-3 text-base ${
                    isChecked ? "border-success bg-success/10" : "border-border bg-background"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setChecked((prev) => (isChecked ? prev.filter((x) => x !== id) : [...prev, id]))}
                    className="mt-1 h-5 w-5 accent-[oklch(0.52_0.13_152)]"
                  />
                  <span>{b(DOCUMENTS[id]!)}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card-enter mt-6 rounded-lg border border-border bg-card p-6 shadow-sm [animation-delay:80ms]">
        <h2 className="font-serif text-xl font-bold text-primary">
          {t("yourDetails")} <span className="text-sm font-semibold text-destructive">*</span>
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label={t("nameLabel")}
            required
            error={tried ? errors.applicantName : ""}
            value={answers.applicantName}
            onChange={(v) => update({ applicantName: v })}
          />
          <Field
            label={t("fatherLabel")}
            required
            error={tried ? errors.fatherName : ""}
            value={answers.fatherName}
            onChange={(v) => update({ fatherName: v })}
          />
          <Field
            label={t("addressLabel")}
            required
            error={tried ? errors.address : ""}
            value={answers.address}
            onChange={(v) => update({ address: v })}
          />
          <Field
            label={t("phoneLabel")}
            required
            error={tried ? errors.phone : ""}
            value={answers.phone}
            onChange={(v) => update({ phone: v })}
          />
        </div>

        {tried && !formValid && (
          <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">
            {t("fillRequired")}
          </p>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          className="tactile-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-lg font-bold text-accent-foreground hover:brightness-95"
        >
          <FileText className="h-5 w-5" aria-hidden="true" />
          {t("generateForm")}
        </button>
      </section>

      <section className="card-enter mt-6 rounded-lg border border-border bg-card p-6 shadow-sm [animation-delay:140ms] print:hidden">
        <h2 className="font-serif text-xl font-bold text-primary">{t("nextStepsTitle")}</h2>
        <ol className="mt-4 space-y-4">
          {[t("nextStep1"), t("nextStep2"), t("nextStep3"), t("nextStep4")].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="pt-1 text-base">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-6">
        <Link
          to="/office"
          className="tactile-button inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-4 font-bold text-primary-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {t("toOffice")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {open && createPortal(
        <div className="print-root fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="animate-pop-in my-8 w-full max-w-2xl rounded-lg bg-card shadow-2xl print:my-0 print:bg-white print:shadow-none">
            <div className="flex items-center justify-between border-b border-border px-5 py-3 print:hidden">
              <p className="font-semibold text-primary">{t("formTitle")}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("close")} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="print-area px-6 py-6 text-[15px] text-black">
              <h3 className="text-center font-serif text-xl font-bold">{t("formAppTitle")}</h3>
              <p className="mt-1 text-center text-sm">{t("formUnderAct")}</p>

              <div className="mt-6">
                <p>{t("formTo")}</p>
                <p className="font-semibold">
                  {t("formSecretary")}, {district?.name ?? ""} ({state?.name ?? ""})
                </p>
              </div>

              <dl className="mt-5 space-y-3">
                <Row n="1" label={t("nameLabel")} value={answers.applicantName || blank} />
                <Row n="2" label={t("fatherLabel")} value={answers.fatherName || blank} />
                <Row
                  n="3"
                  label={t("f3Label")}
                  value={`${answers.address || blank}${answers.phone ? `, ${t("phoneLabel")}: ${answers.phone}` : ""}`}
                />
                <div className="grid grid-cols-[1.6rem_10rem_1fr] gap-2 border-b border-dashed border-neutral-300 pb-2">
                  <dt className="font-semibold">4.</dt>
                  <dt className="font-semibold">{t("f4Label")}</dt>
                  <dd>
                    <ul className="space-y-1">
                      {RULES.categories.map((c) => (
                        <li key={c.id}>
                          {answers.categories.includes(c.id) ? "\u2611" : "\u2610"} {b(c.label)} ({c.section})
                        </li>
                      ))}
                      <li>
                        {incomeClaimed ? "\u2611" : "\u2610"} {t("f4Income")}
                      </li>
                    </ul>
                  </dd>
                </div>
                <Row n="5" label={t("f5Label")} value={officeName ? `${officeName}, ${officeAddress}` : blank} />
                <Row n="6" label={t("f6Label")} value={t("f6Value")} />
                <Row n="7" label={t("f7Label")} value={incomeValue} />
                <Row
                  n="8"
                  label={t("f8Label")}
                  value={answers.oppositeUnknown || !answers.oppositeParty.trim() ? t("f8Unknown") : answers.oppositeParty}
                />
                <Row n="9" label={t("f9Label")} value={reliefValue} />
                <Row n="10" label={t("f10Label")} value={dispute ? dispute.label.en : blank} />
                <Row n="11" label={t("f11Label")} value={answers.previousApplication ? t("yesGeneric") : t("noGeneric")} />
                <Row n="12" label={t("f12Label")} value={answers.casePending ? t("yesGeneric") : t("noGeneric")} />
              </dl>

              <p className="mt-4 text-sm">
                <span className="font-semibold">{t("docsEnclosed")}:</span>{" "}
                {checked.length ? checked.map((id) => b(DOCUMENTS[id]!)).join(", ") : blank}
              </p>

              <p className="mt-6 text-sm leading-relaxed">{t("formUndertaking")}</p>

              <div className="mt-10 flex flex-wrap justify-between gap-4 text-sm">
                <span>
                  {t("formPlace")}: ____________&nbsp;&nbsp;{t("formDate")}: ____________
                </span>
                <span>{t("formSignatureApplicant")}: ____________</span>
              </div>

              <div className="mt-10 border border-neutral-800 p-4">
                <p className="text-center font-serif font-bold">{t("counselTitle")}</p>
                <p className="mt-4 text-sm font-semibold">1. {t("counselSummary")}:</p>
                <div className="mt-6 space-y-6">
                  <div className="border-b border-neutral-400" />
                  <div className="border-b border-neutral-400" />
                </div>
                <p className="mt-6 text-sm font-semibold">2. {t("counselRecommendation")}:</p>
                <div className="mt-6 space-y-6">
                  <div className="border-b border-neutral-400" />
                  <div className="border-b border-neutral-400" />
                </div>
                <p className="mt-10 text-right text-sm">{t("counselSignature")}</p>
              </div>

              <div className="mt-10 border-t border-neutral-300 pt-3 text-center text-xs text-neutral-600">
                <p>
                  Designed &amp; Developed by ·{" "}
                  <a href="tel:+917771074412" aria-label="Call Vishwajeet Sah">
                    📞
                  </a>{" "}
                  <a
                    href="https://www.linkedin.com/in/vishwajeetsah"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-neutral-800 underline"
                  >
                    Vishwajeet Sah
                  </a>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border px-5 py-4 print:hidden">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border-2 border-input px-5 py-2 font-semibold">
                {t("close")}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Printer className="h-4 w-4" aria-hidden="true" /> {t("print")}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  error = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
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
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`interactive-card w-full rounded-lg border-2 bg-background px-4 py-3 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
          error ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"
        }`}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Row({ n, label, value }: { n: string; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1.6rem_10rem_1fr] gap-2 border-b border-dashed border-neutral-300 pb-2">
      <dt className="font-semibold">{n}.</dt>
      <dt className="font-semibold">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
