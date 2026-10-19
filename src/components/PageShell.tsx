import type { ReactNode } from "react";
import { StepIndicator } from "@/components/StepIndicator";

export function PageShell({ step, children }: { step: 1 | 2 | 3 | 4 | 5; children: ReactNode }) {
  return (
    <>
      <StepIndicator current={step} />
      <main className="page-enter mx-auto w-full max-w-3xl px-4 pb-16">{children}</main>
    </>
  );
}
