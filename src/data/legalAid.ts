export type Lang = "en" | "hi";

export type Bilingual = { en: string; hi: string };

/**
 * Detailed office records exist for Sagar district (Madhya Pradesh), keyed by
 * office id. SAGAR_TALUK_OFFICE maps a Sagar taluk name (LGD) to an office id.
 * Everywhere else in India the app falls back to the district's DLSA, which
 * sits in the District & Sessions Court premises.
 */
export const SAGAR_DISTRICT_CODE = "425";

export const SAGAR_TALUK_OFFICE: Record<string, string> = {
  sagar: "sagar-city",
  "sagar nagar": "sagar-city",
  khurai: "khurai",
  bina: "bina",
  banda: "banda",
  deori: "deori",
  rahatgarh: "rahatgarh",
};

export type Office = {
  name: Bilingual;
  address: Bilingual;
  phone: string;
  hours: Bilingual;
  mapsQuery: string;
};

export const OFFICES: Record<string, Office> = {
  "sagar-city": {
    name: { en: "District Legal Services Authority (DLSA), Sagar", hi: "जिला विधिक सेवा प्राधिकरण (डीएलएसए), सागर" },
    address: {
      en: "District & Sessions Court Premises, Sagar (M.P.) 470002",
      hi: "जिला एवं सत्र न्यायालय परिसर, सागर (म.प्र.) 470002",
    },
    phone: "+91 7582 XXXXXX",
    hours: { en: "10:00 AM – 5:00 PM (Mon–Sat, except holidays)", hi: "प्रातः 10:00 – सायं 5:00 (सोम–शनि, अवकाश छोड़कर)" },
    mapsQuery: "District Court Sagar Madhya Pradesh",
  },
  khurai: {
    name: { en: "Taluk Legal Services Committee (TLSC), Khurai", hi: "तालुका विधिक सेवा समिति (टीएलएससी), खुरई" },
    address: { en: "Civil Court Complex, Khurai, District Sagar (M.P.)", hi: "सिविल न्यायालय परिसर, खुरई, जिला सागर (म.प्र.)" },
    phone: "+91 7581 XXXXXX",
    hours: { en: "10:00 AM – 5:00 PM (Mon–Sat, except holidays)", hi: "प्रातः 10:00 – सायं 5:00 (सोम–शनि, अवकाश छोड़कर)" },
    mapsQuery: "Civil Court Khurai Sagar Madhya Pradesh",
  },
  bina: {
    name: { en: "Taluk Legal Services Committee (TLSC), Bina", hi: "तालुका विधिक सेवा समिति (टीएलएससी), बीना" },
    address: { en: "Court Complex, Bina-Etawa, District Sagar (M.P.)", hi: "न्यायालय परिसर, बीना-इटावा, जिला सागर (म.प्र.)" },
    phone: "+91 7580 XXXXXX",
    hours: { en: "10:00 AM – 5:00 PM (Mon–Sat, except holidays)", hi: "प्रातः 10:00 – सायं 5:00 (सोम–शनि, अवकाश छोड़कर)" },
    mapsQuery: "Civil Court Bina Sagar Madhya Pradesh",
  },
  banda: {
    name: { en: "Taluk Legal Services Committee (TLSC), Banda", hi: "तालुका विधिक सेवा समिति (टीएलएससी), बंडा" },
    address: { en: "Civil Court Complex, Banda, District Sagar (M.P.)", hi: "सिविल न्यायालय परिसर, बंडा, जिला सागर (म.प्र.)" },
    phone: "+91 7586 XXXXXX",
    hours: { en: "10:00 AM – 5:00 PM (Mon–Sat, except holidays)", hi: "प्रातः 10:00 – सायं 5:00 (सोम–शनि, अवकाश छोड़कर)" },
    mapsQuery: "Civil Court Banda Sagar Madhya Pradesh",
  },
  deori: {
    name: { en: "Taluk Legal Services Committee (TLSC), Deori", hi: "तालुका विधिक सेवा समिति (टीएलएससी), देवरी" },
    address: { en: "Civil Court Complex, Deori, District Sagar (M.P.)", hi: "सिविल न्यायालय परिसर, देवरी, जिला सागर (म.प्र.)" },
    phone: "+91 7584 XXXXXX",
    hours: { en: "10:00 AM – 5:00 PM (Mon–Sat, except holidays)", hi: "प्रातः 10:00 – सायं 5:00 (सोम–शनि, अवकाश छोड़कर)" },
    mapsQuery: "Civil Court Deori Sagar Madhya Pradesh",
  },
  rahatgarh: {
    name: { en: "Taluk Legal Services Committee (TLSC), Rahatgarh", hi: "तालुका विधिक सेवा समिति (टीएलएससी), राहतगढ़" },
    address: { en: "Civil Court Complex, Rahatgarh, District Sagar (M.P.)", hi: "सिविल न्यायालय परिसर, राहतगढ़, जिला सागर (म.प्र.)" },
    phone: "+91 7585 XXXXXX",
    hours: { en: "10:00 AM – 5:00 PM (Mon–Sat, except holidays)", hi: "प्रातः 10:00 – सायं 5:00 (सोम–शनि, अवकाश छोड़कर)" },
    mapsQuery: "Civil Court Rahatgarh Sagar Madhya Pradesh",
  },
};

/**
 * Rules engine data for legal aid eligibility under the Legal Services
 * Authorities Act, 1987 (all-India). Protected categories under Section 12
 * qualify irrespective of income. Everyone else qualifies under Section 12(h)
 * when annual family income is below the limit prescribed by their State
 * Government (limits vary by state, so the app asks a yes/no question rather
 * than testing one national figure).
 */
export type CategoryRule = {
  id: string;
  label: Bilingual;
  section: string;
  reason: Bilingual;
  incomeCapApplies: boolean;
  documents: string[];
};

export const RULES: {
  categories: CategoryRule[];
} = {
  categories: [
    {
      id: "woman",
      label: { en: "A woman", hi: "महिला" },
      section: "Section 12(c)",
      reason: {
        en: "Eligible as per Section 12(c) of the Legal Services Authorities Act, 1987 — women are entitled to free legal aid irrespective of income.",
        hi: "विधिक सेवा प्राधिकरण अधिनियम, 1987 की धारा 12(ग) के अनुसार पात्र — महिलाओं को आय की परवाह किए बिना नि:शुल्क विधिक सहायता का अधिकार है।",
      },
      incomeCapApplies: false,
      documents: ["identity"],
    },
    {
      id: "child",
      label: { en: "A child (under 18 years)", hi: "बालक/बालिका (18 वर्ष से कम)" },
      section: "Section 12(c)",
      reason: {
        en: "Eligible as per Section 12(c) — children are entitled to free legal aid irrespective of income.",
        hi: "धारा 12(ग) के अनुसार पात्र — बच्चों को आय की परवाह किए बिना नि:शुल्क विधिक सहायता का अधिकार है।",
      },
      incomeCapApplies: false,
      documents: ["age"],
    },
    {
      id: "scst",
      label: { en: "Member of SC / ST community", hi: "अनुसूचित जाति / अनुसूचित जनजाति सदस्य" },
      section: "Section 12(a)",
      reason: {
        en: "Eligible as per Section 12(a) — members of Scheduled Castes and Scheduled Tribes are entitled to free legal aid irrespective of income.",
        hi: "धारा 12(क) के अनुसार पात्र — अनुसूचित जाति एवं अनुसूचित जनजाति के सदस्यों को आय की परवाह किए बिना नि:शुल्क विधिक सहायता का अधिकार है।",
      },
      incomeCapApplies: false,
      documents: ["caste"],
    },
    {
      id: "workman",
      label: { en: "Industrial workman", hi: "औद्योगिक कर्मकार" },
      section: "Section 12(f)",
      reason: {
        en: "Eligible as per Section 12(f) — industrial workmen are entitled to free legal aid irrespective of income.",
        hi: "धारा 12(च) के अनुसार पात्र — औद्योगिक कर्मकारों को आय की परवाह किए बिना नि:शुल्क विधिक सहायता का अधिकार है।",
      },
      incomeCapApplies: false,
      documents: ["employment"],
    },
    {
      id: "custody",
      label: { en: "Currently in custody", hi: "वर्तमान में अभिरक्षा में" },
      section: "Section 12(g)",
      reason: {
        en: "Eligible as per Section 12(g) — persons in custody are entitled to free legal aid irrespective of income.",
        hi: "धारा 12(छ) के अनुसार पात्र — अभिरक्षा में रखे गए व्यक्ति आय की परवाह किए बिना नि:शुल्क विधिक सहायता के हकदार हैं।",
      },
      incomeCapApplies: false,
      documents: ["custody"],
    },
    {
      id: "trafficking",
      label: { en: "Victim of human trafficking or begar (forced labour)", hi: "मानव तस्करी या बेगार (जबरन श्रम) के शिकार" },
      section: "Section 12(b)",
      reason: {
        en: "Eligible as per Section 12(b) — victims of human trafficking or begar are entitled to free legal aid irrespective of income.",
        hi: "धारा 12(ख) के अनुसार पात्र — मानव तस्करी या बेगार के शिकार व्यक्ति आय की परवाह किए बिना नि:शुल्क विधिक सहायता के हकदार हैं।",
      },
      incomeCapApplies: false,
      documents: ["fir"],
    },
    {
      id: "disability",
      label: { en: "A person with disability or mental illness", hi: "दिव्यांग या मानसिक रूप से अस्वस्थ व्यक्ति" },
      section: "Section 12(d)",
      reason: {
        en: "Eligible as per Section 12(d) — persons with disability or mental illness are entitled to free legal aid irrespective of income.",
        hi: "धारा 12(घ) के अनुसार पात्र — दिव्यांग या मानसिक रूप से अस्वस्थ व्यक्ति आय की परवाह किए बिना नि:शुल्क विधिक सहायता के हकदार हैं।",
      },
      incomeCapApplies: false,
      documents: ["disability"],
    },
    {
      id: "disaster",
      label: { en: "Victim of a disaster, caste atrocity or violence", hi: "आपदा, जातिगत अत्याचार या हिंसा के शिकार" },
      section: "Section 12(e)",
      reason: {
        en: "Eligible as per Section 12(e) — victims of mass disaster, ethnic violence, caste atrocity, flood, drought, earthquake or industrial disaster are entitled to free legal aid irrespective of income.",
        hi: "धारा 12(ङ) के अनुसार पात्र — सामूहिक आपदा, जातीय हिंसा, जातिगत अत्याचार, बाढ़, सूखा, भूकंप या औद्योगिक आपदा के शिकार व्यक्ति आय की परवाह किए बिना नि:शुल्क विधिक सहायता के हकदार हैं।",
      },
      incomeCapApplies: false,
      documents: ["dispute"],
    },
  ],
};

export const DISPUTES: { id: string; label: Bilingual }[] = [
  { id: "civil", label: { en: "Civil", hi: "सिविल" } },
  { id: "criminal", label: { en: "Criminal", hi: "आपराधिक" } },
  { id: "family", label: { en: "Family / Matrimonial", hi: "पारिवारिक / वैवाहिक" } },
  { id: "revenue", label: { en: "Revenue", hi: "राजस्व" } },
  { id: "labour", label: { en: "Labour", hi: "श्रम" } },
  { id: "other", label: { en: "Other", hi: "अन्य" } },
];

export const DISPUTE_DOCUMENTS: Record<string, string[]> = {
  civil: ["property"],
  criminal: ["fir"],
  family: ["marriage"],
  revenue: ["revenue"],
  labour: ["employment"],
  other: ["dispute"],
};

export const DOCUMENTS: Record<string, Bilingual> = {
  identity: { en: "Identity proof (Aadhaar / Voter ID / Ration card)", hi: "पहचान प्रमाण (आधार / मतदाता पहचान पत्र / राशन कार्ड)" },
  income: { en: "Income self-declaration affidavit (annual family income)", hi: "आय स्व-घोषणा शपथ पत्र (वार्षिक पारिवारिक आय)" },
  caste: { en: "Caste certificate (SC / ST)", hi: "जाति प्रमाण पत्र (अजा / अजजा)" },
  age: { en: "Age proof (birth certificate / school certificate)", hi: "आयु प्रमाण (जन्म प्रमाण पत्र / विद्यालय प्रमाण पत्र)" },
  employment: { en: "Employment proof / labour card", hi: "रोजगार प्रमाण / श्रमिक कार्ड" },
  custody: { en: "Custody details (jail / police station and case number)", hi: "अभिरक्षा विवरण (जेल / थाना एवं प्रकरण क्रमांक)" },
  disability: { en: "Disability certificate / UDID card", hi: "दिव्यांगता प्रमाण पत्र / यूडीआईडी कार्ड" },
  fir: { en: "Copy of FIR / charge sheet / court notice", hi: "एफ.आई.आर. / आरोप पत्र / न्यायालय सूचना की प्रति" },
  property: { en: "Property or agreement documents related to the dispute", hi: "विवाद से संबंधित संपत्ति या अनुबंध दस्तावेज" },
  marriage: { en: "Marriage proof and any existing court order", hi: "विवाह प्रमाण एवं कोई विद्यमान न्यायालय आदेश" },
  revenue: { en: "Khasra / Khatauni or revenue records", hi: "खसरा / खतौनी अथवा राजस्व अभिलेख" },
  dispute: { en: "Any documents related to your dispute", hi: "आपके विवाद से संबंधित कोई भी दस्तावेज" },
  photo: { en: "Two passport-size photographs", hi: "दो पासपोर्ट आकार के फोटो" },
};
