import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Bilingual, Lang } from "@/data/legalAid";

const dict = {
  appName: { en: "LegalAid MP", hi: "लीगलएड एम.पी." },
  tagline: { en: "Free Legal Aid Helper — Sagar District", hi: "नि:शुल्क विधिक सहायता सहायक — सागर जिला" },
  langLabel: { en: "Language", hi: "भाषा" },
  themeLabel: { en: "Appearance", hi: "दिखावट" },
  light: { en: "Light", hi: "लाइट" },
  dark: { en: "Dark", hi: "डार्क" },
  listen: { en: "Tap to listen", hi: "सुनने के लिए दबाएं" },
  stop: { en: "Stop", hi: "रोकें" },
  next: { en: "Continue", hi: "आगे बढ़ें" },
  back: { en: "Back", hi: "पीछे" },
  startOver: { en: "Start over", hi: "फिर से शुरू करें" },

  step1: { en: "Location", hi: "स्थान" },
  step2: { en: "Questions", hi: "प्रश्न" },
  step3: { en: "Result", hi: "परिणाम" },
  step4: { en: "Documents", hi: "दस्तावेज" },
  step5: { en: "Office", hi: "कार्यालय" },

  welcomeTitle: { en: "Free legal aid is your right", hi: "नि:शुल्क विधिक सहायता आपका अधिकार है" },
  welcomeBody: {
    en: "Under the Legal Services Authorities Act, 1987, eligible citizens get a lawyer, court fees and legal advice free of cost. Answer a few simple questions to check if you qualify in Madhya Pradesh.",
    hi: "विधिक सेवा प्राधिकरण अधिनियम, 1987 के अंतर्गत पात्र नागरिकों को वकील, न्यायालय शुल्क और विधिक सलाह नि:शुल्क मिलती है। मध्य प्रदेश में अपनी पात्रता जांचने के लिए कुछ सरल प्रश्नों के उत्तर दें।",
  },
  districtLabel: { en: "Select your district", hi: "अपना जिला चुनें" },
  tehsilLabel: { en: "Select your tehsil / taluk", hi: "अपनी तहसील / तालुका चुनें" },
  choose: { en: "Choose an option", hi: "एक विकल्प चुनें" },
  beginCheck: { en: "Check my eligibility", hi: "मेरी पात्रता जांचें" },

  q1Title: { en: "Do any of these describe you?", hi: "क्या इनमें से कोई आप पर लागू होता है?" },
  q1Help: {
    en: "Select every option that applies. If any applies, you get free legal aid whatever your income.",
    hi: "जो भी लागू हो सभी चुनें। यदि कोई लागू होता है, तो आय चाहे कुछ भी हो, आपको नि:शुल्क विधिक सहायता मिलेगी।",
  },
  noneApply: { en: "None of these apply to me", hi: "इनमें से कोई भी लागू नहीं है" },
  q2Title: { en: "Is your total annual family income less than ₹2,00,000?", hi: "क्या आपकी कुल वार्षिक पारिवारिक आय ₹2,00,000 से कम है?" },
  q2Help: {
    en: "Count the income of everyone in your household for one year.",
    hi: "एक वर्ष में अपने परिवार के सभी सदस्यों की आय जोड़ें।",
  },
  yes: { en: "Yes, less than ₹2,00,000", hi: "हाँ, ₹2,00,000 से कम" },
  no: { en: "No, ₹2,00,000 or more", hi: "नहीं, ₹2,00,000 या अधिक" },
  q3Title: { en: "What kind of dispute is it?", hi: "यह किस प्रकार का विवाद है?" },
  q3Help: { en: "Pick the closest match.", hi: "सबसे मिलता-जुलता विकल्प चुनें।" },
  seeResult: { en: "See my result", hi: "मेरा परिणाम देखें" },

  eligibleTitle: { en: "You are eligible for free legal aid", hi: "आप नि:शुल्क विधिक सहायता के पात्र हैं" },
  notEligibleTitle: { en: "You do not qualify for free legal aid", hi: "आप नि:शुल्क विधिक सहायता के पात्र नहीं हैं" },
  whyTitle: { en: "Why", hi: "कारण" },
  altTitle: { en: "You can still get help", hi: "आपको फिर भी सहायता मिल सकती है" },
  altMediation: { en: "Pre-Litigation Mediation at DLSA Sagar", hi: "डीएलएसए सागर में पूर्व-वाद मध्यस्थता" },
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
  generateForm: { en: "Generate Official MP Legal Aid Form A (Format 'क')", hi: "आधिकारिक म.प्र. विधिक सहायता प्रपत्र अ (प्रारूप 'क') बनाएं" },
  formTitle: { en: "Application for Legal Aid — Form A (Format 'क')", hi: "विधिक सहायता हेतु आवेदन — प्रपत्र अ (प्रारूप 'क')" },
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
  missingLocation: { en: "Please choose your district and tehsil first.", hi: "कृपया पहले अपना जिला और तहसील चुनें।" },
  disclaimer: {
    en: "This is a guidance tool. The final decision on legal aid is taken by the Legal Services Authority.",
    hi: "यह एक मार्गदर्शन साधन है। विधिक सहायता का अंतिम निर्णय विधिक सेवा प्राधिकरण द्वारा लिया जाता है।",
  },
  footerMain: {
    en: "LegalAid MP – Bridging Access to Justice for Citizens in Sagar District & Madhya Pradesh.",
    hi: "लीगलएड एम.पी. – सागर जिला और मध्य प्रदेश के नागरिकों के लिए न्याय तक पहुँच को सुलभ बनाना।",
  },
  footerHelpline: { en: "NALSA Helpline: 15100", hi: "नालसा हेल्पलाइन: 15100" },
  footerGuidelines: { en: "MPSLSA Guidelines", hi: "एमपीएसएलएसए दिशानिर्देश" },
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
