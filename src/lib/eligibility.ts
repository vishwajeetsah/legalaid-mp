import { RULES, DISPUTE_DOCUMENTS, type Bilingual } from "@/data/legalAid";

export type Answers = {
  district: string;
  tehsil: string;
  categories: string[];
  incomeUnderCap: boolean | null;
  dispute: string;
  applicantName: string;
  fatherName: string;
  address: string;
  phone: string;
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
          en: `Eligible under the Madhya Pradesh rules because your annual family income is below ₹${RULES.generalIncomeCap.toLocaleString("en-IN")} — the income limit prescribed by the State Government under Section 12(h).`,
          hi: `मध्य प्रदेश नियमों के अंतर्गत पात्र, क्योंकि आपकी वार्षिक पारिवारिक आय ₹${RULES.generalIncomeCap.toLocaleString("en-IN")} से कम है — यह धारा 12(ज) के अंतर्गत राज्य शासन द्वारा निर्धारित आय सीमा है।`,
        },
      ],
    };
  }

  return {
    eligible: false,
    sections: [],
    reasons: [
      {
        en: `You do not fall under a protected category and your annual family income is ₹${RULES.generalIncomeCap.toLocaleString("en-IN")} or above, which is the income limit for free legal aid in Madhya Pradesh.`,
        hi: `आप किसी संरक्षित श्रेणी में नहीं आते और आपकी वार्षिक पारिवारिक आय ₹${RULES.generalIncomeCap.toLocaleString("en-IN")} या उससे अधिक है, जो मध्य प्रदेश में नि:शुल्क विधिक सहायता की आय सीमा है।`,
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
