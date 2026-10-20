import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Bilingual, Lang } from "@/data/legalAid";

const dict = {
  appName: { en: "LegalAid India", hi: "लीगलएड इंडिया" },
  tagline: { en: "Free Legal Aid Helper — All India", hi: "नि:शुल्क विधिक सहायता सहायक — संपूर्ण भारत" },
  langLabel: { en: "Language", hi: "भाषा" },
  themeLabel: { en: "Appearance", hi: "दिखावट" },
  light: { en: "Light", hi: "लाइट" },
  dark: { en: "Dark", hi: "डार्क" },
  listen: { en: "Tap to listen", hi: "सुनने के लिए दबाएं" },
  stop: { en: "Stop", hi: "रोकें" },
  next: { en: "Continue", hi: "आगे बढ़ें" },
  back: { en: "Back", hi: "पीछे" },
  startOver: { en: "Start over", hi: "फिर से शुरू करें" },

  step1: { en: "Eligibility", hi: "पात्रता" },
  step2: { en: "Your details", hi: "आपका विवरण" },
  step3: { en: "Result", hi: "परिणाम" },
  step4: { en: "Documents", hi: "दस्तावेज" },
  step5: { en: "Office", hi: "कार्यालय" },

  welcomeTitle: { en: "Free legal aid is your right", hi: "नि:शुल्क विधिक सहायता आपका अधिकार है" },
  welcomeBody: {
    en: "Under the Legal Services Authorities Act, 1987, eligible citizens anywhere in India get a lawyer, court fees and legal advice free of cost. Answer a few simple questions to check if you qualify.",
    hi: "विधिक सेवा प्राधिकरण अधिनियम, 1987 के अंतर्गत भारत में कहीं भी पात्र नागरिकों को वकील, न्यायालय शुल्क और विधिक सलाह नि:शुल्क मिलती है। अपनी पात्रता जांचने के लिए कुछ सरल प्रश्नों के उत्तर दें।",
  },
  how1: { en: "Answer 3 simple questions", hi: "3 सरल प्रश्नों के उत्तर दें" },
  how2: { en: "Add your state, district & basic details", hi: "अपना राज्य, जिला एवं मूल विवरण जोड़ें" },
  how3: { en: "Download your application and submit it at your DLSA office", hi: "अपना आवेदन डाउनलोड करें और डीएलएसए कार्यालय में जमा करें" },
  stateLabel: { en: "Select your state", hi: "अपना राज्य चुनें" },
  districtLabel: { en: "Select your district", hi: "अपना जिला चुनें" },
  tehsilLabel: { en: "Select your tehsil / taluk", hi: "अपनी तहसील / तालुका चुनें" },
  talukLabel: { en: "Select your taluk / tehsil", hi: "अपना तालुका / तहसील चुनें" },
  talukFreeLabel: { en: "Type your taluk / tehsil name", hi: "अपने तालुका / तहसील का नाम लिखें" },
  locationTitle: { en: "Where do you live?", hi: "आप कहाँ रहते हैं?" },
  locationHelp: {
    en: "Your application goes to the District Legal Services Authority (DLSA) of your district.",
    hi: "आपका आवेदन आपके जिले के जिला विधिक सेवा प्राधिकरण (डीएलएसए) के पास जाएगा।",
  },
  detailsTitle: { en: "Your basic details", hi: "आपका मूल विवरण" },
  detailsHelp: {
    en: "The legal aid office needs only these details to register your application.",
    hi: "विधिक सहायता कार्यालय को आपका आवेदन दर्ज करने के लिए केवल इन्हीं विवरणों की आवश्यकता है।",
  },
  choose: { en: "Choose an option", hi: "एक विकल्प चुनें" },
  beginCheck: { en: "Check my eligibility", hi: "मेरी पात्रता जांचें" },

  q1Title: { en: "Do any of these describe you?", hi: "क्या इनमें से कोई आप पर लागू होता है?" },
  q1Help: {
    en: "Select every option that applies. If any applies, you get free legal aid whatever your income.",
    hi: "जो भी लागू हो सभी चुनें। यदि कोई लागू होता है, तो आय चाहे कुछ भी हो, आपको नि:शुल्क विधिक सहायता मिलेगी।",
  },
  noneApply: { en: "None of these apply to me", hi: "इनमें से कोई भी लागू नहीं है" },
  q2Title: { en: "Is your total annual family income below your state's limit?", hi: "क्या आपकी कुल वार्षिक पारिवारिक आय आपके राज्य की सीमा से कम है?" },
  q2Help: {
    en: "Every state sets its own income limit for free legal aid — in most states it is between ₹1,00,000 and ₹3,00,000 per year. Count the income of everyone in your household for one year.",
    hi: "प्रत्येक राज्य नि:शुल्क विधिक सहायता के लिए अपनी आय सीमा तय करता है — अधिकांश राज्यों में यह ₹1,00,000 से ₹3,00,000 प्रति वर्ष के बीच है। एक वर्ष में अपने परिवार के सभी सदस्यों की आय जोड़ें।",
  },
  yes: { en: "Yes, below the limit", hi: "हाँ, सीमा से कम" },
  no: { en: "No, above the limit", hi: "नहीं, सीमा से अधिक" },
  q3Title: { en: "What kind of dispute is it?", hi: "यह किस प्रकार का विवाद है?" },
  q3Help: { en: "Pick the closest match.", hi: "सबसे मिलता-जुलता विकल्प चुनें।" },
  seeResult: { en: "See my result", hi: "मेरा परिणाम देखें" },

  eligibleTitle: { en: "You are eligible for free legal aid", hi: "आप नि:शुल्क विधिक सहायता के पात्र हैं" },
  notEligibleTitle: { en: "You do not qualify for free legal aid", hi: "आप नि:शुल्क विधिक सहायता के पात्र नहीं हैं" },
  whyTitle: { en: "Why", hi: "कारण" },
  altTitle: { en: "You can still get help", hi: "आपको फिर भी सहायता मिल सकती है" },
  altMediation: { en: "Pre-Litigation Mediation at your DLSA", hi: "आपके डीएलएसए में पूर्व-वाद मध्यस्थता" },
  altMediationBody: {
    en: "Settle the matter without going to court, at low or no cost.",
    hi: "न्यायालय गए बिना, कम या बिना खर्च के मामला निपटाएं।",
  },
  altLokAdalat: { en: "National Lok Adalat", hi: "राष्ट्रीय लोक अदालत" },
  altLokAdalatBody: {
    en: "Held periodically for quick settlement of pending and pre-litigation matters.",
    hi: "लंबित एवं पूर्व-वाद मामलों के त्वरित निपटारे हेतु समय-समय पर आयोजित।",
  },
  altHelpline: { en: "NALSA Toll-Free Helpline: 15100", hi: "नालसा नि:शुल्क हेल्पलाइन: 15100" },
  altHelplineBody: { en: "Free legal guidance over the phone.", hi: "फोन पर नि:शुल्क विधिक मार्गदर्शन।" },
  callNow: { en: "Call 15100", hi: "15100 पर कॉल करें" },
  toDocs: { en: "See documents & application form", hi: "दस्तावेज एवं आवेदन प्रपत्र देखें" },
  toOffice: { en: "Find my legal aid office", hi: "मेरा विधिक सेवा कार्यालय खोजें" },

  docsTitle: { en: "Documents you need to carry", hi: "आपको ले जाने वाले दस्तावेज" },
  docsHelp: {
    en: "This list is based on your answers. Carry the originals and one photocopy of each.",
    hi: "यह सूची आपके उत्तरों पर आधारित है। मूल दस्तावेज एवं प्रत्येक की एक छायाप्रति साथ रखें।",
  },
  generateForm: { en: "Generate my application (PDF)", hi: "मेरा आवेदन बनाएं (पीडीएफ)" },
  formTitle: { en: "Application for Legal Aid", hi: "विधिक सहायता हेतु आवेदन" },
  yourDetails: { en: "Your details (used in the form)", hi: "आपका विवरण (प्रपत्र में उपयोग होगा)" },
  nameLabel: { en: "Full name", hi: "पूरा नाम" },
  fatherLabel: { en: "Father's / Husband's name", hi: "पिता / पति का नाम" },
  addressLabel: { en: "Address", hi: "पता" },
  phoneLabel: { en: "Mobile number", hi: "मोबाइल नंबर" },
  requiredMark: { en: "(required)", hi: "(अनिवार्य)" },
  fieldRequired: { en: "This field is required", hi: "यह विवरण आवश्यक है" },
  phoneInvalid: { en: "Enter a valid mobile number", hi: "एक मान्य मोबाइल नंबर दर्ज करें" },
  fillRequired: {
    en: "Please fill in all required details to generate the form.",
    hi: "प्रपत्र बनाने के लिए कृपया सभी अनिवार्य विवरण भरें।",
  },
  print: { en: "Print / Save as PDF", hi: "प्रिंट करें / पीडीएफ सहेजें" },
  close: { en: "Close", hi: "बंद करें" },
  notFilled: { en: "________________", hi: "________________" },
  docsTickHint: {
    en: "Tick the documents you have ready — the ticked documents will be listed in Form A.",
    hi: "जो दस्तावेज आपके पास तैयार हैं उन्हें टिक करें — टिक किए गए दस्तावेज प्रपत्र अ में सूचीबद्ध होंगे।",
  },
  docsEnclosed: { en: "Documents enclosed", hi: "संलग्न दस्तावेज़" },
  docsVerificationNote: {
    en: "The applicant will carry the originals of the above documents to the Legal Services Authority office for verification of eligibility for free legal aid.",
    hi: "आवेदक निःशुल्क विधिक सहायता हेतु पात्रता सत्यापन के लिए उपरोक्त दस्तावेज़ों की मूल प्रतियाँ विधिक सेवा प्राधिकरण कार्यालय में साथ लेकर जाएगा/जाएगी।",
  },

  guideTitle: { en: "Know your rights", hi: "अपने अधिकार जानें" },
  guideIntro: {
    en: "Free legal aid is a right, not a favour. Here is, in simple words, who can get it, what it includes, what happens after you apply, and how to get help even before an arrest.",
    hi: "नि:शुल्क विधिक सहायता एक अधिकार है, कोई कृपा नहीं। यहाँ सरल शब्दों में जानें — कौन इसे पा सकता है, इसमें क्या-क्या शामिल है, आवेदन के बाद क्या होता है, और गिरफ्तारी से पहले भी सहायता कैसे पाएं।",
  },
  toGuide: { en: "Know your rights", hi: "अपने अधिकार जानें" },
  secEntitled: { en: "Who can get free legal aid", hi: "नि:शुल्क विधिक सहायता कौन पा सकता है" },
  entitledIntro: {
    en: "Under Section 12 of the Legal Services Authorities Act, 1987, the following persons are entitled to free legal aid whatever their income:",
    hi: "विधिक सेवा प्राधिकरण अधिनियम, 1987 की धारा 12 के अंतर्गत निम्नलिखित व्यक्ति आय की परवाह किए बिना नि:शुल्क विधिक सहायता के हकदार हैं:",
  },
  entitledIncome: {
    en: "Any other person whose annual family income is below the limit prescribed by their State Government (Section 12(h))",
    hi: "कोई भी अन्य व्यक्ति जिसकी वार्षिक पारिवारिक आय उसकी राज्य सरकार द्वारा निर्धारित सीमा से कम है (धारा 12(ज))",
  },
  secServices: { en: "What you get — completely free", hi: "आपको क्या मिलेगा — पूर्णतः नि:शुल्क" },
  secProcedure: { en: "What happens after you apply", hi: "आवेदन के बाद क्या होता है" },
  secPreArrest: { en: "Help before arrest — do not wait", hi: "गिरफ्तारी से पहले सहायता — प्रतीक्षा न करें" },
  preArrestCardTitle: { en: "Got a police notice? Fear arrest?", hi: "पुलिस नोटिस मिला है? गिरफ्तारी की आशंका है?" },
  preArrestCardBody: {
    en: "You can get free legal help even before an arrest. Tap to see how, and what details to keep ready.",
    hi: "गिरफ्तारी से पहले भी आप नि:शुल्क विधिक सहायता पा सकते हैं। कैसे, और कौन से विवरण तैयार रखें — जानने के लिए दबाएं।",
  },

  officeTitle: { en: "Where to submit your application", hi: "आवेदन कहाँ जमा करें" },
  hoursLabel: { en: "Working hours", hi: "कार्य समय" },
  phoneOffice: { en: "Phone", hi: "दूरभाष" },
  openMaps: { en: "Open in Google Maps", hi: "गूगल मैप्स में खोलें" },
  phoneNote: {
    en: "Phone numbers shown are placeholders. Please confirm at the court complex reception.",
    hi: "दर्शाए गए दूरभाष क्रमांक उदाहरण मात्र हैं। कृपया न्यायालय परिसर के स्वागत कक्ष पर पुष्टि करें।",
  },

  voiceTitle: { en: "Voice assistant", hi: "वॉइस सहायक" },
  voiceRead: { en: "Read this page aloud", hi: "यह पृष्ठ पढ़कर सुनाएं" },
  voiceSpeak: { en: "Speak your answer", hi: "अपना उत्तर बोलें" },
  voiceHeard: { en: "Heard", hi: "सुना गया" },
  voiceUnsupported: { en: "Voice input is not available in this browser.", hi: "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है।" },
  missingLocation: { en: "Please choose your state, district and taluk first.", hi: "कृपया पहले अपना राज्य, जिला और तालुका चुनें।" },
  disclaimer: {
    en: "This is a guidance tool. The final decision on legal aid is taken by the Legal Services Authority.",
    hi: "यह एक मार्गदर्शन साधन है। विधिक सहायता का अंतिम निर्णय विधिक सेवा प्राधिकरण द्वारा लिया जाता है।",
  },
  footerMain: {
    en: "LegalAid India – Bridging access to justice for citizens across India.",
    hi: "लीगलएड इंडिया – संपूर्ण भारत के नागरिकों के लिए न्याय तक पहुँच को सुलभ बनाना।",
  },
  footerHelpline: { en: "NALSA Helpline: 15100", hi: "नालसा हेल्पलाइन: 15100" },
  footerGuidelines: { en: "NALSA", hi: "नालसा" },
  footerPrivacy: { en: "Privacy & Data Protection", hi: "गोपनीयता और डेटा सुरक्षा" },
} satisfies Record<string, Bilingual>;

export type TranslationKey = keyof typeof dict;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  b: (value: Bilingual) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("legalaid-lang");
    if (saved === "hi" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("legalaid-lang", l);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key) => dict[key][lang],
      b: (value) => value[lang],
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
