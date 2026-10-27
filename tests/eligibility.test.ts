/**
 * Data-driven tests for the LegalAid India eligibility rules engine.
 *
 * Every case lives in tests/sample-data/eligibility-cases.json — the same file
 * serves as the project's sample data. Each case supplies the three
 * eligibility answers and the expected verdict (eligible + statutory sections)
 * and document checklist produced by src/lib/eligibility.ts.
 *
 * Run:  bun test        (or: bun run test)
 */
import { describe, expect, test } from "bun:test";
import { evaluate, requiredDocuments, type Answers } from "../src/lib/eligibility";
import data from "./sample-data/eligibility-cases.json";

type CaseInput = {
  categories: string[];
  incomeUnderCap: boolean | null;
  dispute: string;
};

type Case = {
  id: string;
  title: string;
  input: CaseInput;
  expected: {
    eligible: boolean;
    sections: string[];
    documents: string[];
  };
};

const defaults = data.defaults as Omit<Answers, "categories" | "incomeUnderCap" | "dispute">;

function answersFor(input: CaseInput): Answers {
  return { ...defaults, ...input };
}

describe("eligibility rules engine (sample-data cases)", () => {
  for (const c of data.cases as Case[]) {
    test(`${c.id}: ${c.title}`, () => {
      const answers = answersFor(c.input);

      const verdict = evaluate(answers);
      expect(verdict.eligible).toBe(c.expected.eligible);
      expect(verdict.sections).toEqual(c.expected.sections);
      // An eligible verdict must always carry at least one bilingual reason,
      // and an ineligible verdict must explain itself too.
      expect(verdict.reasons.length).toBeGreaterThan(0);
      for (const r of verdict.reasons) {
        expect(r.en.length).toBeGreaterThan(0);
        expect(r.hi.length).toBeGreaterThan(0);
      }

      const docs = requiredDocuments(answers);
      expect([...docs].sort()).toEqual([...c.expected.documents].sort());
      // Identity proof and a photograph are always required.
      expect(docs).toContain("identity");
      expect(docs).toContain("photo");
      // The checklist must never contain duplicates.
      expect(new Set(docs).size).toBe(docs.length);
    });
  }
});

describe("rules engine invariants", () => {
  test("a protected category qualifies even when income is above the cap", () => {
    const v = evaluate(answersFor({ categories: ["woman"], incomeUnderCap: false, dispute: "civil" }));
    expect(v.eligible).toBe(true);
  });

  test("income question left unanswered (null) does not qualify on income alone", () => {
    const v = evaluate(answersFor({ categories: [], incomeUnderCap: null, dispute: "civil" }));
    expect(v.eligible).toBe(false);
  });

  test("unknown category ids are ignored, not treated as qualifying", () => {
    const v = evaluate(answersFor({ categories: ["not-a-category"], incomeUnderCap: false, dispute: "civil" }));
    expect(v.eligible).toBe(false);
  });
});
