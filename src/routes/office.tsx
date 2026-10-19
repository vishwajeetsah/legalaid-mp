import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Building2, Clock, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers-store";
import { OFFICES } from "@/data/legalAid";

export const Route = createFileRoute("/office")({
  head: () => ({
    meta: [
      { title: "Legal Aid Office Finder — Sagar District | LegalAid MP" },
      {
        name: "description",
        content: "Address, working hours and directions for the DLSA Sagar and Taluk Legal Services Committee offices in Khurai, Bina, Banda, Deori and Rahatgarh.",
      },
      { property: "og:title", content: "Legal Aid Office Finder — Sagar District | LegalAid MP" },
      { property: "og:description", content: "Find your DLSA or TLSC legal aid office in Sagar district with address, hours and map directions." },
    ],
  }),
  component: OfficeFinder,
});

function OfficeFinder() {
  const { t, b } = useLang();
  const { answers, hydrated, reset } = useAnswers();
  const navigate = useNavigate();
  const office = OFFICES[answers.tehsil];

  useEffect(() => {
    if (hydrated && !answers.tehsil) navigate({ to: "/" });
  }, [hydrated, answers.tehsil, navigate]);

  if (!office) return <PageShell step={5}>{null}</PageShell>;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapsQuery)}`;

  return (
    <PageShell step={5}>
      <section className="card-enter rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-serif text-2xl font-bold text-primary sm:text-3xl">{t("officeTitle")}</h1>
          <SpeakButton text={`${t("officeTitle")}. ${b(office.name)}. ${b(office.address)}. ${b(office.hours)}`} />
        </div>

        <div className="interactive-card mt-5 rounded-lg border border-border border-l-4 border-l-accent bg-background p-5">
          <p className="flex items-start gap-3 font-serif text-xl font-bold text-primary">
            <Building2 className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            {b(office.name)}
          </p>
          <p className="mt-3 flex items-start gap-3 text-base">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            {b(office.address)}
          </p>
          <p className="mt-3 flex items-start gap-3 text-base">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <span>
              <span className="font-semibold">{t("hoursLabel")}: </span>
              {b(office.hours)}
            </span>
          </p>
          <p className="mt-3 flex items-start gap-3 text-base">
            <Phone className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <span>
              <span className="font-semibold">{t("phoneOffice")}: </span>
              {office.phone}
            </span>
          </p>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="tactile-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90"
        >
          <MapPin className="h-5 w-5" aria-hidden="true" /> {t("openMaps")}
        </a>

        <p className="mt-4 text-sm text-muted-foreground">{t("phoneNote")}</p>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link to="/documents" className="text-sm font-semibold text-primary underline">
          {t("toDocs")}
        </Link>
        <button
          type="button"
          onClick={() => {
            reset();
            navigate({ to: "/" });
          }}
          className="text-sm font-semibold text-primary underline"
        >
          {t("startOver")}
        </button>
      </div>
    </PageShell>
  );
}
