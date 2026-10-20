import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Answers } from "@/lib/eligibility";

const STORAGE_KEY = "legalaid-answers-v2";

const initial: Answers = {
  stateCode: "",
  district: "",
  taluk: "",
  categories: [],
  incomeUnderCap: null,
  dispute: "",
  applicantName: "",
  fatherName: "",
  address: "",
  phone: "",
};

type Ctx = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  reset: () => void;
  hydrated: boolean;
};

const AnswersContext = createContext<Ctx | null>(null);

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers({ ...initial, ...(JSON.parse(raw) as Partial<Answers>) });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      answers,
      hydrated,
      update: (patch) => setAnswers((prev) => ({ ...prev, ...patch })),
      reset: () => setAnswers(initial),
    }),
    [answers, hydrated],
  );

  return <AnswersContext.Provider value={value}>{children}</AnswersContext.Provider>;
}

export function useAnswers() {
  const ctx = useContext(AnswersContext);
  if (!ctx) throw new Error("useAnswers must be used inside AnswersProvider");
  return ctx;
}
