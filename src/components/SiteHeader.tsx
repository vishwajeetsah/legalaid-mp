import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import nalsaLogoUrl from "@/assets/nalsa-logo.png";
import { useLang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export function SiteHeader() {
  const { lang, setLang, t } = useLang();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 shadow-sm print:hidden">
      {/* National tricolour strip */}
      <div aria-hidden="true" className="flex h-1">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Government of India utility bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-4 py-1.5">
          <span className="text-xs font-semibold tracking-wide">{t("govIndia")}</span>
          <div role="group" aria-label={t("langLabel")} className="flex items-center gap-1 rounded-full border border-white/40 p-0.5">
            <button
              type="button"
              onClick={() => setLang("hi")}
              aria-pressed={lang === "hi"}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                lang === "hi" ? "bg-accent text-accent-foreground" : "text-white/75 hover:text-white"
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                lang === "en" ? "bg-accent text-accent-foreground" : "text-white/75 hover:text-white"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b-[3px] border-accent bg-header text-header-foreground">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-sm ring-1 ring-border transition-transform duration-200 hover:scale-105">
              <img src={nalsaLogoUrl} alt="NALSA — Access to Justice for All" className="h-8 w-8 object-contain" />
            </span>
            <span>
              <span className="block font-serif text-lg leading-tight font-bold">{t("appName")}</span>
              <span className="block text-xs text-header-muted">{t("tagline")}</span>
            </span>
          </Link>

          <div role="group" aria-label={t("themeLabel")} className="control-group">
            <button type="button" onClick={() => setTheme("light")} aria-pressed={theme === "light"} className={`control-segment ${theme === "light" ? "control-segment-active" : "text-header-muted hover:text-header-foreground"}`}>
              <Sun className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{t("light")}</span>
            </button>
            <button type="button" onClick={() => setTheme("dark")} aria-pressed={theme === "dark"} className={`control-segment ${theme === "dark" ? "control-segment-active" : "text-header-muted hover:text-header-foreground"}`}>
              <Moon className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline">{t("dark")}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
