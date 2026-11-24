import { RULES, DISPUTE_DOCUMENTS, type Bilingual } from "@/data/legalAid";

export type Answers = {
  stateCode: string;
  district: string;
  taluk: string;
  categories: string[];
  incomeUnderCap: boolean | null;
  dispute: string;
  applicantName: string;
  fatherName: string;
  address: string;
  phone: string;
  gender: "" | "female" | "male" | "other";
  dob: string;
  oppositeParty: string;
  oppositeUnknown: boolean;
  relief: "" | "file-case" | "advice";
  previousApplication: boolean;
  casePending: boolean;
  incomeUncertain: boolean;
  scanUsed: boolean;
};

export type Verdict = {
  eligible: boolean;
  reasons: Bilingual[];
  sections: string[];
};

export function evaluate(answers: Answers): Verdict {
  const matched = RULES.categories.filter((c) => answers.categories.includes(c.id));

  if (matched.length > 0) {
    return {
      eligible: true,
      reasons: matched.map((c) => c.reason),
      sections: matched.map((c) => c.section),
    };
  }

  if (answers.incomeUnderCap === true) {
    return {
      eligible: true,
      sections: ["Section 12(h)"],
      reasons: [
        {
          en: "Eligible because your annual family income is below the limit prescribed by your State Government under Section 12(h) of the Legal Services Authorities Act, 1987.",
          hi: "पात्र, क्योंकि आपकी वार्षिक पारिवारिक आय विधिक सेवा प्राधिकरण अधिनियम, 1987 की धारा 12(ज) के अंतर्गत आपकी राज्य सरकार द्वारा निर्धारित सीमा से कम है।",
        },
      ],
    };
  }

  if (answers.incomeUncertain === true) {
    return {
      eligible: true,
      sections: ["Section 12(h)"],
      reasons: [
        {
          en: "Your claim can be prepared now. Your income eligibility under Section 12(h) will be confirmed by the Legal Services Authority when you submit.",
          hi: "आपका दावा अभी तैयार किया जा सकता है। धारा 12(ज) के अंतर्गत आपकी आय संबंधी पात्रता की पुष्टि आवेदन जमा करते समय विधिक सेवा प्राधिकरण द्वारा की जाएगी।",
        },
      ],
    };
  }

  return {
    eligible: false,
    sections: [],
    reasons: [
      {
        en: "You do not fall under a protected category, and your annual family income is above the limit prescribed by your State Government under Section 12(h) of the Legal Services Authorities Act, 1987.",
        hi: "आप किसी संरक्षित श्रेणी में नहीं आते और आपकी वार्षिक पारिवारिक आय विधिक सेवा प्राधिकरण अधिनियम, 1987 की धारा 12(ज) के अंतर्गत आपकी राज्य सरकार द्वारा निर्धारित सीमा से अधिक है।",
      },
    ],
  };
}

export function requiredDocuments(answers: Answers): string[] {
  const docs = new Set<string>(["identity", "photo"]);
  const matched = RULES.categories.filter((c) => answers.categories.includes(c.id));
  matched.forEach((c) => c.documents.forEach((d) => docs.add(d)));
  if (matched.length === 0) docs.add("income");
  (DISPUTE_DOCUMENTS[answers.dispute] ?? ["dispute"]).forEach((d) => docs.add(d));
  return Array.from(docs);
}
