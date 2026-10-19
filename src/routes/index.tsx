import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ScrollText } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers-store";
import { DISTRICTS, TEHSILS } from "@/data/legalAid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LegalAid MP — Free Legal Aid Eligibility Check, Sagar District" },
      {
        name: "description",
        content:
          "Start your free legal aid check for Madhya Pradesh. Choose your district and tehsil in Sagar and see if you qualify under the Legal Services Authorities Act, 1987.",
      },
      { property: "og:title", content: "LegalAid MP — Free Legal Aid Eligibility Check, Sagar District" },
      {
        property: "og:description",
        content: "Choose your district and tehsil in Sagar and check your free legal aid eligibility in minutes.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { t, b, lang } = useLang();
  const { answers, update } = useAnswers();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const proceed = () => {
    if (!answers.district || !answers.tehsil) {
      setError(t("missingLocation"));
      return;
    }
    navigate({ to: "/eligibility" });
  };

  return (
    <PageShell step={1}>
      <section className="card-enter rounded-lg border border-border border-l-4 border-l-accent bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
              {lang === "hi" ? "विधिक सेवा प्राधिकरण अधिनियम, 1987" : "Legal Services Authorities Act, 1987"}
            </span>
            <h1 className="mt-3 font-serif text-3xl leading-tight font-bold text-primary sm:text-4xl">{t("welcomeTitle")}</h1>
          </div>
          <SpeakButton text={`${t("welcomeTitle")}. ${t("welcomeBody")}`} />
        </div>
        <p className="mt-3 text-base text-foreground/90">{t("welcomeBody")}</p>
      </section>

      <section className="card-enter mt-6 space-y-5 rounded-lg border border-border bg-card p-6 shadow-sm [animation-delay:80ms]">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="district" className="text-lg font-semibold text-primary">
              {t("districtLabel")}
            </label>
            <SpeakButton text={t("districtLabel")} />
          </div>
          <select
            id="district"
            value={answers.district}
            onChange={(e) => update({ district: e.target.value })}
            className="interactive-card w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-lg focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {b(d.label)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="tehsil" className="text-lg font-semibold text-primary">
              {t("tehsilLabel")}
            </label>
            <SpeakButton text={t("tehsilLabel")} />
          </div>
          <select
            id="tehsil"
            value={answers.tehsil}
            onChange={(e) => {
              update({ tehsil: e.target.value });
              setError("");
            }}
            className="interactive-card w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-lg focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <option value="">{t("choose")}</option>
            {TEHSILS.map((tehsil) => (
              <option key={tehsil.id} value={tehsil.id}>
                {b(tehsil.label)}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={proceed}
          className="tactile-button flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t("beginCheck")}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </section>
    </PageShell>
  );
}
