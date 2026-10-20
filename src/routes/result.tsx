import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { CheckCircle2, Gift, Info, Phone, Scale, Handshake, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers-store";
import { evaluate } from "@/lib/eligibility";
import { FREE_SERVICES } from "@/data/guide";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Your Eligibility Result — LegalAid India" },
      {
        name: "description",
        content: "See whether you qualify for free legal aid anywhere in India, with the exact legal provision behind the decision.",
      },
      { property: "og:title", content: "Your Eligibility Result — LegalAid India" },
      { property: "og:description", content: "Your free legal aid verdict with the exact section of the Legal Services Authorities Act, 1987." },
    ],
  }),
  component: Result,
});

function Result() {
  const { t, b } = useLang();
  const { answers, hydrated } = useAnswers();
  const navigate = useNavigate();
  const verdict = useMemo(() => evaluate(answers), [answers]);

  useEffect(() => {
    if (hydrated && answers.categories.length === 0 && answers.incomeUnderCap === null && !answers.dispute) {
      navigate({ to: "/" });
    }
  }, [hydrated, answers.categories.length, answers.incomeUnderCap, answers.dispute, navigate]);

  const spoken = `${verdict.eligible ? t("eligibleTitle") : t("notEligibleTitle")}. ${verdict.reasons.map(b).join(" ")}`;

  return (
    <PageShell step={3}>
      <section
        className={`animate-pop-in relative overflow-hidden rounded-lg border-2 p-6 shadow-sm ${
          verdict.eligible ? "border-success bg-success/10" : "border-accent/50 bg-card"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {verdict.eligible ? (
              <CheckCircle2 className="animated-check mt-1 h-8 w-8 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <Info className="mt-1 h-8 w-8 shrink-0 text-primary" aria-hidden="true" />
            )}
            <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              {verdict.eligible ? t("eligibleTitle") : t("notEligibleTitle")}
            </h1>
          </div>
          <SpeakButton text={spoken} />
        </div>

        <div className="mt-5 rounded-xl bg-card/80 p-4">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{t("whyTitle")}</p>
          <ul className="mt-2 space-y-3">
            {verdict.reasons.map((reason, i) => (
              <li key={i} className="text-base text-foreground">
                {b(reason)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {verdict.eligible && (
        <section className="card-enter mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-3 font-serif text-xl font-bold text-primary">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Gift className="h-5 w-5" aria-hidden="true" />
            </span>
            {t("secServices")}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {FREE_SERVICES.map((s, i) => (
              <li key={i} className="flex gap-2 rounded-lg border border-border p-3 text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                <span className="font-medium">{b(s.title)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {verdict.eligible ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/documents"
            className="tactile-button inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-center font-bold text-primary-foreground hover:bg-primary/90"
          >
            {t("toDocs")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            to="/office"
            className="tactile-button inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary bg-card px-6 py-4 text-center font-bold text-primary hover:bg-primary/5"
          >
            {t("toOffice")}
          </Link>
        </div>
      ) : (
        <section className="card-enter mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-primary">{t("altTitle")}</h2>
          <ul className="mt-4 space-y-4">
            <li className="interactive-card flex gap-3 rounded-lg border border-border p-4">
              <Handshake className="mt-1 h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-semibold text-primary">{t("altMediation")}</p>
                <p className="text-sm text-muted-foreground">{t("altMediationBody")}</p>
                <Link to="/office" className="mt-1 inline-block text-sm font-semibold text-primary underline">
                  {t("toOffice")}
                </Link>
              </div>
            </li>
            <li className="interactive-card flex gap-3 rounded-lg border border-border p-4">
              <Scale className="mt-1 h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-semibold text-primary">{t("altLokAdalat")}</p>
                <p className="text-sm text-muted-foreground">{t("altLokAdalatBody")}</p>
              </div>
            </li>
            <li className="interactive-card flex gap-3 rounded-lg border border-border p-4">
              <Phone className="mt-1 h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-semibold text-primary">{t("altHelpline")}</p>
                <p className="text-sm text-muted-foreground">{t("altHelplineBody")}</p>
                <a
                  href="tel:15100"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> {t("callNow")}
                </a>
              </div>
            </li>
          </ul>
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <Link to="/eligibility" className="text-sm font-semibold text-primary underline">
          {t("back")}
        </Link>
        <Link to="/guide" className="text-sm font-semibold text-primary underline">
          {t("toGuide")}
        </Link>
      </div>
    </PageShell>
  );
}
