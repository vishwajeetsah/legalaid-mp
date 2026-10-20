import { ExternalLink, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLang();

  return (
    <footer className="mt-auto border-t border-footer-border bg-footer text-footer-foreground print:hidden">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="max-w-2xl text-base font-semibold leading-relaxed">{t("footerMain")}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a className="footer-badge" href="tel:15100">
            <Phone aria-hidden="true" /> {t("footerHelpline")}
          </a>
          <a className="footer-badge" href="https://nalsa.gov.in/" target="_blank" rel="noreferrer">
            {t("footerGuidelines")} <ExternalLink aria-hidden="true" />
          </a>
          <span className="footer-badge">{t("footerPrivacy")}</span>
        </div>
        <div className="mt-6 border-t border-footer-border pt-5 text-center">
          <p className="creator-credit">
            Designed & Developed by{" "}
            <a
              href="https://www.linkedin.com/in/vishwajeetsah/"
              target="_blank"
              rel="noreferrer"
              className="creator-credit-link"
            >
              Vishwajeet Sah
            </a>{" "}
            | Idea & Concept by{" "}
            <a
              href="https://www.linkedin.com/in/vishwajeetsah/"
              target="_blank"
              rel="noreferrer"
              className="creator-credit-link"
            >
              Vishwajeet Sah
            </a>
          </p>
          <p className="mt-3 text-xs text-footer-muted">{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
