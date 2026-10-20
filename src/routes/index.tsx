import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, MapPin, FileDown, ScrollText } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LegalAid India — Free Legal Aid Eligibility Check" },
      {
        name: "description",
        content:
          "Check if you qualify for free legal aid anywhere in India under the Legal Services Authorities Act, 1987. Answer three simple questions, add your district, and download a ready application for your DLSA office.",
      },
      { property: "og:title", content: "LegalAid India — Free Legal Aid Eligibility Check" },
      {
        property: "og:description",
        content: "Three simple questions to check your free legal aid eligibility anywhere in India — then download your application.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const how = [
    { icon: ClipboardCheck, text: t("how1") },
    { icon: MapPin, text: t("how2") },
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
          className="tactile-button mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {t("beginCheck")}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </section>
    </PageShell>
  );
}
