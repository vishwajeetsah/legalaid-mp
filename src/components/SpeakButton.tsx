import { Volume2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { speak, speechSupported } from "@/lib/speech";
import { useEffect, useState } from "react";

export function SpeakButton({ text, className = "" }: { text: string; className?: string }) {
  const { lang, t } = useLang();
  const [available, setAvailable] = useState(false);

  useEffect(() => setAvailable(speechSupported()), []);
  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() => speak(text, lang)}
      aria-label={`${t("listen")}: ${text}`}
      title={`${t("listen")} / बोलने के लिए दबाएं`}
      className={`tactile-button inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/70 bg-accent/15 px-3 py-1.5 text-sm font-medium text-primary hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${className}`}
    >
      <Volume2 className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{t("listen")}</span>
    </button>
  );
}
