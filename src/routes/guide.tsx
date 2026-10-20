import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

type TabId = "entitled" | "services" | "procedure" | "pre-arrest";

const TAB_IDS: TabId[] = ["entitled", "services", "procedure", "pre-arrest"];

function Guide() {
  const { t, b } = useLang();
  const [tab, setTab] = useState<TabId>("entitled");

  useEffect(() => {
    const h = window.location.hash.replace("#", "") as TabId;
    if (TAB_IDS.includes(h)) setTab(h);
  }, []);

  const selectTab = (id: TabId) => {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const tabs: { id: TabId; icon: typeof Users; label: string }[] = [
    { id: "entitled", icon: Users, label: t("secEntitled") },
    { id: "services", icon: Gift, label: t("secServices") },
    { id: "procedure", icon: ClipboardList, label: t("secProcedure") },
    { id: "pre-arrest", icon: Siren, label: t("secPreArrest") },
  ];

  const speakText =
    tab === "entitled"
      ? `${t("secEntitled")}. ${t("entitledIntro")} ${RULES.categories.map((c) => b(c.label)).join(". ")}. ${t("entitledIncome")}`
      : tab === "services"
        ? `${t("secServices")}. ${FREE_SERVICES.map((s) => `${b(s.title)}. ${b(s.body)}`).join(" ")}`
        : tab === "procedure"
          ? `${t("secProcedure")}. ${AFTER_FILING.map((p) => b(p)).join(" ")}`
          : `${t("secPreArrest")}. ${b(PRE_ARREST.intro)} ${b(PRE_ARREST.carryTitle)}. ${PRE_ARREST.carry.map((c) => b(c)).join(". ")}`;

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

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" role="tablist" aria-label={t("guideTitle")}>
        {tabs.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectTab(item.id)}
              className={`interactive-card flex flex-col items-center gap-2 rounded-lg border-2 px-3 py-4 text-center ${
                selected ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
              <span className={`text-sm leading-tight sm:text-base ${selected ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <section key={tab} className="card-enter mt-4 rounded-lg border border-border bg-card p-6 shadow-sm" role="tabpanel">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl font-bold text-primary sm:text-2xl">{tabs.find((x) => x.id === tab)?.label}</h2>
          <SpeakButton text={speakText} />
        </div>

        {tab === "entitled" && (
          <div className="mt-3">
            <p className="text-muted-foreground">{t("entitledIntro")}</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {RULES.categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2.5">
                  <span className="text-sm font-medium sm:text-base">{b(c.label)}</span>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">{c.section}</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2.5 sm:col-span-2">
                <span className="text-sm font-medium sm:text-base">{t("entitledIncome")}</span>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">Section 12(h)</span>
              </li>
            </ul>
          </div>
        )}

        {tab === "services" && (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {FREE_SERVICES.map((s, i) => (
              <li key={i} className="rounded-lg border border-border p-3.5">
                <p className="font-semibold text-primary">{b(s.title)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{b(s.body)}</p>
              </li>
            ))}
          </ul>
        )}

        {tab === "procedure" && (
          <ol className="mt-3 space-y-3.5">
            {AFTER_FILING.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-base text-foreground/90">{b(p)}</p>
              </li>
            ))}
          </ol>
        )}

        {tab === "pre-arrest" && (
          <div className="mt-3">
            <p className="text-base text-foreground/90">{b(PRE_ARREST.intro)}</p>
            <p className="mt-4 font-semibold text-primary">{b(PRE_ARREST.carryTitle)}</p>
            <ul className="mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2">
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
          </div>
        )}
      </section>

      <div className="mt-6">
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
