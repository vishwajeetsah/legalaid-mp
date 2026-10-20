import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpenText, ClipboardList, Gift, Phone, Siren, Users } from "lucide-react";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { RULES } from "@/data/legalAid";
import { AFTER_FILING, FREE_SERVICES, PRE_ARREST } from "@/data/guide";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Know Your Rights — Free Legal Aid Guide | LegalAid India" },
      {
        name: "description",
        content:
          "In simple words: who is entitled to free legal aid under Section 12, what free legal aid includes, what happens after you apply, and how to get legal help before an arrest.",
      },
      { property: "og:title", content: "Know Your Rights — Free Legal Aid Guide | LegalAid India" },
      {
        property: "og:description",
        content: "Who gets free legal aid, what it includes, what happens after you apply, and pre-arrest legal help — in simple words.",
      },
    ],
  }),
  component: Guide,
});

function SectionShell({
  id,
  icon: Icon,
  title,
  speakText,
  children,
  delay = "",
}: {
  id: string;
  icon: typeof Users;
  title: string;
  speakText: string;
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <section id={id} className={`card-enter mt-6 scroll-mt-24 rounded-lg border border-border bg-card p-6 shadow-sm ${delay}`}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="flex items-center gap-3 font-serif text-xl font-bold text-primary sm:text-2xl">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          {title}
        </h2>
        <SpeakButton text={speakText} />
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Guide() {
  const { t, b } = useLang();

  return (
    <main className="page-enter mx-auto w-full max-w-3xl px-4 pb-16">
      <section className="card-enter mt-6 rounded-lg border border-border border-l-4 border-l-accent bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <h1 className="flex items-center gap-3 font-serif text-3xl leading-tight font-bold text-primary">
            <BookOpenText className="h-8 w-8 shrink-0 text-accent" aria-hidden="true" />
            {t("guideTitle")}
          </h1>
          <SpeakButton text={`${t("guideTitle")}. ${t("guideIntro")}`} />
        </div>
        <p className="mt-3 text-base text-foreground/90">{t("guideIntro")}</p>
      </section>

      <SectionShell
        id="entitled"
        icon={Users}
        title={t("secEntitled")}
        speakText={`${t("secEntitled")}. ${t("entitledIntro")} ${RULES.categories.map((c) => b(c.label)).join(". ")}. ${t("entitledIncome")}`}
      >
        <p className="text-muted-foreground">{t("entitledIntro")}</p>
        <ul className="mt-4 space-y-3">
          {RULES.categories.map((c) => (
            <li key={c.id} className="interactive-card flex items-center justify-between gap-3 rounded-lg border border-border p-4">
              <span className="text-base font-medium">{b(c.label)}</span>
              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{c.section}</span>
            </li>
          ))}
          <li className="interactive-card flex items-center justify-between gap-3 rounded-lg border border-border p-4">
            <span className="text-base font-medium">{t("entitledIncome")}</span>
            <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Section 12(h)</span>
          </li>
        </ul>
      </SectionShell>

      <SectionShell
        id="services"
        icon={Gift}
        title={t("secServices")}
        speakText={`${t("secServices")}. ${FREE_SERVICES.map((s) => `${b(s.title)}. ${b(s.body)}`).join(" ")}`}
        delay="[animation-delay:60ms]"
      >
        <ul className="space-y-4">
          {FREE_SERVICES.map((s, i) => (
            <li key={i} className="interactive-card rounded-lg border border-border p-4">
              <p className="font-semibold text-primary">{b(s.title)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b(s.body)}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell
        id="procedure"
        icon={ClipboardList}
        title={t("secProcedure")}
        speakText={`${t("secProcedure")}. ${AFTER_FILING.map((p) => b(p)).join(" ")}`}
        delay="[animation-delay:120ms]"
      >
        <ol className="space-y-4">
          {AFTER_FILING.map((p, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <p className="text-base text-foreground/90">{b(p)}</p>
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell
        id="pre-arrest"
        icon={Siren}
        title={t("secPreArrest")}
        speakText={`${t("secPreArrest")}. ${b(PRE_ARREST.intro)} ${b(PRE_ARREST.carryTitle)}. ${PRE_ARREST.carry.map((c) => b(c)).join(". ")}`}
        delay="[animation-delay:180ms]"
      >
        <p className="text-base text-foreground/90">{b(PRE_ARREST.intro)}</p>
        <p className="mt-4 font-semibold text-primary">{b(PRE_ARREST.carryTitle)}</p>
        <ul className="mt-3 space-y-2">
          {PRE_ARREST.carry.map((c, i) => (
            <li key={i} className="flex gap-2 text-base text-foreground/90">
              <span aria-hidden="true" className="text-accent">
                •
              </span>
              {b(c)}
            </li>
          ))}
        </ul>
        <a
          href="tel:15100"
          className="tactile-button mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-primary/90"
        >
          <Phone className="h-4 w-4" aria-hidden="true" /> {t("callNow")}
        </a>
      </SectionShell>

      <div className="mt-8">
        <Link
          to="/eligibility"
          className="tactile-button flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90"
        >
          {t("beginCheck")}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
