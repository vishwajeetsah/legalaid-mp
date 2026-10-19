import { useEffect, useRef, useState } from "react";
import { Mic, Square, Volume2, X, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getRecognition, speak, speechSupported, stopSpeaking } from "@/lib/speech";

export function VoiceAssistant() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(false);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => setAvailable(speechSupported()), []);
  useEffect(() => () => stopSpeaking(), []);

  if (!available) return null;

  const readPage = () => {
    const main = document.querySelector("main");
    const text = (main?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 1200);
    if (text) speak(text, lang);
  };

  const listen = () => {
    const Recognition = getRecognition();
    if (!Recognition) {
      setHeard(t("voiceUnsupported"));
      return;
    }
    stopSpeaking();
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      setHeard(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setHeard("");
    setListening(true);
    recognition.start();
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 print:hidden">
      {open && (
        <div className="animate-pop-in mb-3 w-72 rounded-lg border border-border bg-card p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif text-base font-bold text-primary">{t("voiceTitle")}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label={t("close")} className="rounded-full p-1 hover:bg-muted">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={readPage}
              className="interactive-card flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm font-medium hover:bg-muted"
            >
              <Volume2 className="h-4 w-4 text-primary" aria-hidden="true" /> {t("voiceRead")}
            </button>
            <button
              type="button"
              onClick={stopSpeaking}
              className="interactive-card flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm font-medium hover:bg-muted"
            >
              <Square className="h-4 w-4 text-destructive" aria-hidden="true" /> {t("stop")}
            </button>
            <button
              type="button"
              onClick={listen}
              className={`interactive-card flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-medium ${
                listening ? "animate-pulse border-accent bg-accent/20" : "border-border bg-background hover:bg-muted"
              }`}
            >
              <Mic className="h-4 w-4 text-primary" aria-hidden="true" /> {t("voiceSpeak")}
            </button>
            {heard && (
              <p className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                <span className="font-semibold">{t("voiceHeard")}: </span>
                {heard}
              </p>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("voiceTitle")}
        className="voice-pulse flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition duration-200 hover:scale-105 hover:bg-primary/90 active:scale-95"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
