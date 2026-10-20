import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Building2, Clock, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { useLang } from "@/lib/i18n";
import { useAnswers } from "@/lib/answers-store";
import { OFFICES, SAGAR_DISTRICT_CODE, SAGAR_TALUK_OFFICE, type Office } from "@/data/legalAid";
import { findDistrict, findState } from "@/data/india";

export const Route = createFileRoute("/office")({
  head: () => ({
    meta: [
      { title: "Legal Aid Office Finder — LegalAid India" },
      {
        name: "description",
        content: "Find your District Legal Services Authority (DLSA) office — located in your district court premises — with directions to submit your legal aid application.",
      },
      { property: "og:title", content: "Legal Aid Office Finder — LegalAid India" },
      { property: "og:description", content: "Find your DLSA legal aid office anywhere in India and submit your application." },
    ],
  }),
  component: OfficeFinder,
});

function OfficeFinder() {
  const { t, b } = useLang();
  const { answers, hydrated, reset } = useAnswers();
  const navigate = useNavigate();

  const state = findState(answers.stateCode);
  const district = findDistrict(state, answers.district);
  const sagarOfficeId = answers.district === SAGAR_DISTRICT_CODE ? SAGAR_TALUK_OFFICE[answers.taluk.toLowerCase()] : undefined;

  useEffect(() => {
    if (hydrated && !district) navigate({ to: "/" });
  }, [hydrated, district, navigate]);

  if (!district) return <PageShell step={5}>{null}</PageShell>;

  const office: Office = sagarOfficeId
    ? OFFICES[sagarOfficeId]!
    : {
        name: {
          en: `District Legal Services Authority (DLSA), ${district.name}`,
          hi: `जिला विधिक सेवा प्राधिकरण (डीएलएसए), ${district.name}`,
        },
        address: {
          en: `District & Sessions Court Premises, ${district.name} (${state?.name ?? ""})`,
          hi: `जिला एवं सत्र न्यायालय परिसर, ${district.name} (${state?.name ?? ""})`,
        },
        phone: "",
        hours: { en: "10:00 AM – 5:00 PM (Mon–Sat, except holidays)", hi: "प्रातः 10:00 – सायं 5:00 (सोम–शनि, अवकाश छोड़कर)" },
        mapsQuery: `District Court ${district.name} ${state?.name ?? ""}`,
      };

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
          {office.phone && (
            <p className="mt-3 flex items-start gap-3 text-base">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <span className="font-semibold">{t("phoneOffice")}: </span>
                {office.phone}
              </span>
            </p>
          )}
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="tactile-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90"
        >
          <MapPin className="h-5 w-5" aria-hidden="true" /> {t("openMaps")}
        </a>

        {office.phone && <p className="mt-4 text-sm text-muted-foreground">{t("phoneNote")}</p>}
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
