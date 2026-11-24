import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpenText, ClipboardCheck, FileDown, ScanLine, ScrollText, Siren } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LegalAid India — Claim Free Legal Aid" },
      {
        name: "description",
        content:
          "Claim free legal aid anywhere in India under the Legal Services Authorities Act, 1987. Scan your Aadhaar card or answer a few simple questions, and take the filled official application form to your DLSA office.",
      },
      { property: "og:title", content: "LegalAid India — Claim Free Legal Aid" },
      {
        property: "og:description",
        content: "Scan your Aadhaar card or answer a few simple questions — we fill the official legal aid application form with you.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const how = [
    { icon: ScanLine, text: t("how1") },
    { icon: ClipboardCheck, text: t("how2") },
    { icon: FileDown, text: t("how3") },
  ];

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

      <section className="card-enter mt-6 rounded-lg border border-border bg-card p-6 shadow-sm [animation-delay:80ms]">
        <ol className="space-y-4">
          {how.map((item, i) => (
            <li key={i} className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-lg font-medium text-foreground">
                <span className="mr-2 font-bold text-primary">{i + 1}.</span>
                {item.text}
              </p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => navigate({ to: "/eligibility" })}
          className="tactile-button mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t("beginCheck")}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </section>

      <Link
        to="/guide"
        hash="pre-arrest"
        className="card-enter mt-6 flex items-start gap-4 rounded-lg border-2 border-accent/60 bg-accent/10 p-6 shadow-sm [animation-delay:140ms]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
          <Siren className="h-5 w-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-serif text-xl font-bold text-primary">{t("preArrestCardTitle")}</span>
          <span className="mt-1 block text-base text-foreground/90">{t("preArrestCardBody")}</span>
        </span>
      </Link>

      <Link
        to="/guide"
        className="card-enter mt-4 flex items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm [animation-delay:200ms]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpenText className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-serif text-xl font-bold text-primary">{t("toGuide")}</span>
        <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      </Link>
    </PageShell>
  );
}
