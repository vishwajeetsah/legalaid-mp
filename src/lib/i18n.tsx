import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Bilingual, Lang } from "@/data/legalAid";

const dict = {
  appName: { en: "LegalAid India", hi: "लीगलएड इंडिया" },
  govIndia: { en: "Government of India | भारत सरकार", hi: "भारत सरकार | Government of India" },
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

  welcomeTitle: { en: "Claim your free legal aid", hi: "अपनी नि:शुल्क विधिक सहायता का दावा करें" },
  welcomeBody: {
    en: "The law gives free legal aid — a lawyer, court fees and legal advice at no cost — to citizens who qualify under the Legal Services Authorities Act, 1987. This tool checks whether you qualify and fills the official application form with you, ready to take to your district legal aid office.",
    hi: "विधिक सेवा प्राधिकरण अधिनियम, 1987 के अंतर्गत पात्र नागरिकों को नि:शुल्क विधिक सहायता — वकील, न्यायालय शुल्क और विधिक सलाह बिना किसी खर्च के — प्राप्त होती है। यह साधन जांचता है कि आप पात्र हैं या नहीं, और आपके साथ आधिकारिक आवेदन प्रपत्र भरता है, जिसे आप अपने जिला विधिक सहायता कार्यालय में ले जा सकते हैं।",
  },
  how1: { en: "Scan your Aadhaar card, or answer a few simple questions", hi: "अपना आधार कार्ड स्कैन करें, या कुछ सरल प्रश्नों के उत्तर दें" },
  how2: { en: "We check your eligibility and fill the official application form for you", hi: "हम आपकी पात्रता जांचते हैं और आपके लिए आधिकारिक आवेदन प्रपत्र भरते हैं" },
  how3: { en: "Download the filled form and take it to your DLSA office", hi: "भरा हुआ प्रपत्र डाउनलोड करें और अपने डीएलएसए कार्यालय ले जाएं" },
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
  confirmTitle: { en: "Confirm your details", hi: "अपने विवरण की पुष्टि करें" },
  confirmHelpScan: {
    en: "We filled this from your Aadhaar card. Please read it once — if everything is correct, just continue.",
    hi: "यह विवरण आपके आधार कार्ड से भरा गया है। कृपया इसे एक बार पढ़ लें — यदि सब कुछ सही है, तो बस आगे बढ़ें।",
  },
  confirmHelp: {
    en: "Fill in your details below. If your address includes your PIN code, we will find your legal aid office automatically.",
    hi: "नीचे अपना विवरण भरें। यदि आपके पते में आपका पिन कोड शामिल है, तो हम आपका विधिक सेवा कार्यालय स्वतः खोज देंगे।",
  },
  yourOfficeLabel: { en: "Your legal aid office", hi: "आपका विधिक सेवा कार्यालय" },
  dlsaName: { en: "District Legal Services Authority", hi: "जिला विधिक सेवा प्राधिकरण" },
  changeLabel: { en: "Change", hi: "बदलें" },
  editDetailsLabel: { en: "Something is wrong? Edit", hi: "कुछ गलत है? संपादित करें" },
  matterTitle: { en: "Your matter", hi: "आपका मामला" },
  matterHelp: {
    en: "Tell us what the matter is about, and what help you want.",
    hi: "बताएं कि मामला किस विषय में है, और आप क्या सहायता चाहते हैं।",
  },
  detailsTitle: { en: "Your basic details", hi: "आपका मूल विवरण" },
  detailsHelp: {
    en: "The legal aid office needs only these details to register your application.",
    hi: "विधिक सहायता कार्यालय को आपका आवेदन दर्ज करने के लिए केवल इन्हीं विवरणों की आवश्यकता है।",
  },
  choose: { en: "Choose an option", hi: "एक विकल्प चुनें" },
  beginCheck: { en: "Claim Free Legal Aid", hi: "नि:शुल्क विधिक सहायता का दावा करें" },

  scanTitle: { en: "Start with your Aadhaar card", hi: "अपने आधार कार्ड से शुरू करें" },
  scanBody: {
    en: "Take a photo of your Aadhaar card, or upload one. Your details are read on this device and filled in for you — nothing is uploaded or stored. You can correct anything in the next steps.",
    hi: "अपने आधार कार्ड का फोटो लें, या कोई फोटो अपलोड करें। आपका विवरण इसी उपकरण पर पढ़ा जाता है और आपके लिए भर दिया जाता है — कुछ भी अपलोड या संग्रहित नहीं किया जाता। अगले चरणों में आप कुछ भी सुधार सकते हैं।",
  },
  scanButton: { en: "Scan my Aadhaar card", hi: "मेरा आधार कार्ड स्कैन करें" },
  scanReading: { en: "Reading your card…", hi: "आपका कार्ड पढ़ा जा रहा है…" },
  scanTypeInstead: { en: "Type my details instead", hi: "इसके बजाय मैं अपना विवरण स्वयं लिखूँगा/लिखूँगी" },
  scanReadTitle: { en: "We read this from your card", hi: "आपके कार्ड से यह पढ़ा गया" },
  scanNoneFound: {
    en: "We could not read the card clearly. You can try another photo, or type your details instead.",
    hi: "कार्ड स्पष्ट रूप से पढ़ा नहीं जा सका। आप दूसरा फोटो लेकर पुनः प्रयास कर सकते हैं, या अपना विवरण स्वयं लिख सकते हैं।",
  },

  q1Title: { en: "Which of these are true for you?", hi: "इनमें से कौन-सी बातें आप पर लागू होती हैं?" },
  q1Help: {
    en: "Tap all that apply. Each one is a ground for free legal aid under the Legal Services Authorities Act, 1987.",
    hi: "जो भी लागू हों, सभी चुनें। इनमें से प्रत्येक विधिक सेवा प्राधिकरण अधिनियम, 1987 के अंतर्गत नि:शुल्क विधिक सहायता का आधार है।",
  },
  noneApply: { en: "None of these apply to me", hi: "इनमें से कोई भी लागू नहीं है" },
  q2Title: { en: "Is your total annual family income below your state's limit?", hi: "क्या आपकी कुल वार्षिक पारिवारिक आय आपके राज्य की सीमा से कम है?" },
  q2Help: {
    en: "Every state sets its own income limit for free legal aid — in most states it is between ₹1,00,000 and ₹3,00,000 per year. Count the income of everyone in your household for one year.",
    hi: "प्रत्येक राज्य नि:शुल्क विधिक सहायता के लिए अपनी आय सीमा तय करता है — अधिकांश राज्यों में यह ₹1,00,000 से ₹3,00,000 प्रति वर्ष के बीच है। एक वर्ष में अपने परिवार के सभी सदस्यों की आय जोड़ें।",
  },
  yes: { en: "Yes, below the limit", hi: "हाँ, सीमा से कम" },
  no: { en: "No, above the limit", hi: "नहीं, सीमा से अधिक" },
  yesGeneric: { en: "Yes", hi: "हाँ" },
  noGeneric: { en: "No", hi: "नहीं" },
  notSure: { en: "Not sure", hi: "निश्चित नहीं हूँ" },
  monthlyIncomeLabel: {
    en: "Roughly, how much does your family earn in one month? (₹)",
    hi: "लगभग, आपका परिवार एक महीने में कितना कमाता है? (₹)",
  },
  annualEstimateBefore: { en: "That is about", hi: "यह एक वर्ष में लगभग" },
  annualEstimateAfter: { en: "in a year.", hi: "है।" },
  belowLimitQuestion: {
    en: "Is this below the limit prescribed by your State Government?",
    hi: "क्या यह आपकी राज्य सरकार द्वारा निर्धारित सीमा से कम है?",
  },
  stillDontKnow: { en: "I still don't know — the DLSA can confirm", hi: "मुझे फिर भी ज्ञात नहीं है — डीएलएसए पुष्टि कर सकता है" },
  q3Title: { en: "What kind of dispute is it?", hi: "यह किस प्रकार का विवाद है?" },
  q3Help: { en: "Pick the closest match.", hi: "सबसे मिलता-जुलता विकल्प चुनें।" },
  seeResult: { en: "See my result", hi: "मेरा परिणाम देखें" },

  eligibleTitle: { en: "You can claim free legal aid", hi: "आप निःशुल्क विधिक सहायता का दावा कर सकते हैं" },
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
  genderLabel: { en: "Gender", hi: "लिंग" },
  genderFemale: { en: "Female", hi: "महिला" },
  genderMale: { en: "Male", hi: "पुरुष" },
  genderOther: { en: "Other", hi: "अन्य" },
  dobLabel: { en: "Date of birth", hi: "जन्म तिथि" },

  caseTitle: { en: "Your case", hi: "आपका प्रकरण" },
  caseHelp: {
    en: "The last few details, needed to complete the official application form.",
    hi: "आधिकारिक आवेदन प्रपत्र पूर्ण करने के लिए आवश्यक अंतिम कुछ विवरण।",
  },
  oppositeLabel: { en: "Name of the opposite party", hi: "विपक्षी पक्ष का नाम" },
  oppositeUnknownLabel: { en: "I don't know / not applicable", hi: "मुझे ज्ञात नहीं है / लागू नहीं है" },
  reliefLabel: { en: "What do you want?", hi: "आप क्या चाहते हैं?" },
  reliefFileCase: { en: "I want to file a case", hi: "मैं प्रकरण दायर करना चाहता/चाहती हूँ" },
  reliefAdvice: { en: "I only want legal advice", hi: "मैं केवल विधिक सलाह चाहता/चाहती हूँ" },
  previousApplicationLabel: { en: "Have you applied for legal aid before?", hi: "क्या आपने पहले विधिक सहायता हेतु आवेदन किया है?" },
  casePendingLabel: {
    en: "Is any case in this matter already pending in a court?",
    hi: "क्या इस मामले में कोई प्रकरण पहले से किसी न्यायालय में लंबित है?",
  },

  nextStepsTitle: { en: "What happens next", hi: "आगे क्या होगा" },
  nextStep1: {
    en: "Take this application and your documents to the DLSA office shown on it.",
    hi: "यह आवेदन और अपने दस्तावेज आवेदन पर दर्शाए गए डीएलएसए कार्यालय में ले जाएं।",
  },
  nextStep2: {
    en: "The office checks your eligibility. The final decision rests with the Legal Services Authority.",
    hi: "कार्यालय आपकी पात्रता की जांच करेगा। अंतिम निर्णय विधिक सेवा प्राधिकरण का होगा।",
  },
  nextStep3: {
    en: "If approved, a legal aid advocate is assigned to you, free of cost.",
    hi: "स्वीकृति मिलने पर आपको नि:शुल्क विधिक सहायता अधिवक्ता नियुक्त किया जाएगा।",
  },
  nextStep4: {
    en: "Your matter proceeds in court — or, if both sides agree, is settled in a Lok Adalat.",
    hi: "आपका मामला न्यायालय में आगे बढ़ेगा — या, यदि दोनों पक्ष सहमत हों, तो लोक अदालत में निपटाया जाएगा।",
  },
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

  formAppTitle: { en: "APPLICATION FORM FOR LEGAL AID", hi: "विधिक सहायता हेतु आवेदन प्रपत्र" },
  formUnderAct: {
    en: "Under the Legal Services Authorities Act, 1987",
    hi: "विधिक सेवा प्राधिकरण अधिनियम, 1987 के अंतर्गत",
  },
  formTo: { en: "To,", hi: "सेवा में," },
  formSecretary: {
    en: "The Secretary, District Legal Services Authority",
    hi: "सचिव, जिला विधिक सेवा प्राधिकरण",
  },
  f3Label: { en: "Residential Address (Contact No.)", hi: "आवासीय पता (संपर्क क्रमांक)" },
  f4Label: { en: "Category under Section 12", hi: "धारा 12 के अंतर्गत श्रेणी" },
  f4Income: {
    en: "Income below the limit prescribed by the State Government — Section 12(h)",
    hi: "राज्य सरकार द्वारा निर्धारित सीमा से कम आय — धारा 12(ज)",
  },
  f5Label: { en: "Name of Office and Address", hi: "कार्यालय का नाम एवं पता" },
  f6Label: { en: "Nationality", hi: "राष्ट्रीयता" },
  f6Value: { en: "Indian", hi: "भारतीय" },
  f7Label: { en: "Annual Income", hi: "वार्षिक आय" },
  f7NA: {
    en: "Not applicable — eligible irrespective of income under",
    hi: "लागू नहीं — निम्न के अंतर्गत आय की परवाह किए बिना पात्र",
  },
  f7Below: {
    en: "Below the limit prescribed by the State Government under Section 12(h), as declared by the applicant (affidavit on ₹10 non-judicial stamp paper to be attached)",
    hi: "धारा 12(ज) के अंतर्गत राज्य सरकार द्वारा निर्धारित सीमा से कम, आवेदक द्वारा घोषित (₹10 के गैर-न्यायिक स्टाम्प पेपर पर शपथ पत्र संलग्न किया जाए)",
  },
  f7Confirm: { en: "To be confirmed by the Authority", hi: "प्राधिकरण द्वारा पुष्टि की जाएगी" },
  f7Above: {
    en: "Above the limit prescribed by the State Government",
    hi: "राज्य सरकार द्वारा निर्धारित सीमा से अधिक",
  },
  f8Label: { en: "Name and Address of Opposite Party", hi: "विपक्षी पक्ष का नाम एवं पता" },
  f8Unknown: { en: "Not known", hi: "ज्ञात नहीं" },
  f9Label: { en: "Nature of Relief Sought", hi: "मांगी गई राहत का स्वरूप" },
  f9Advice: {
    en: "Legal advice / counselling by Legal Aid Advocate",
    hi: "विधिक सहायता अधिवक्ता द्वारा विधिक सलाह / परामर्श",
  },
  f9File: {
    en: "Legal aid to file and pursue a case",
    hi: "प्रकरण दायर करने एवं चलाने हेतु विधिक सहायता",
  },
  f10Label: { en: "Type of Case", hi: "प्रकरण का प्रकार" },
  f11Label: {
    en: "Whether any application for legal aid has been filed previously",
    hi: "क्या पहले विधिक सहायता हेतु कोई आवेदन दिया गया है",
  },
  f12Label: {
    en: "Whether any case is pending before any court",
    hi: "क्या कोई प्रकरण किसी न्यायालय में लंबित है",
  },
  formUndertaking: {
    en: "I undertake that if the legal services obtained by me are found to have been obtained by furnishing incorrect or false information or in a fraudulent manner, the legal services shall be stopped forthwith and the expenses incurred by the Legal Services Institutions shall be recovered from me.",
    hi: "मैं वचन देता/देती हूँ कि यदि मेरे द्वारा प्राप्त विधिक सेवाएँ गलत या झूठी जानकारी देकर अथवा धोखाधड़ी से प्राप्त की गई पाई जाती हैं, तो विधिक सेवाएँ तत्काल बंद कर दी जाएंगी और विधिक सेवा संस्थानों द्वारा किया गया व्यय मुझसे वसूल किया जाएगा।",
  },
  formPlace: { en: "Place", hi: "स्थान" },
  formDate: { en: "Date", hi: "दिनांक" },
  formSignatureApplicant: { en: "Signature of the Applicant", hi: "आवेदक के हस्ताक्षर" },
  counselTitle: { en: "To be filled by Legal Aid Counsel", hi: "विधिक सहायता अधिवक्ता द्वारा भरा जाए" },
  counselSummary: { en: "Summary of dispute", hi: "विवाद का सारांश" },
  counselRecommendation: {
    en: "Recommendation of Legal Aid Counsel",
    hi: "विधिक सहायता अधिवक्ता की अनुशंसा",
  },
  counselSignature: {
    en: "Signature (Name in capital letters)",
    hi: "हस्ताक्षर (नाम बड़े अक्षरों में)",
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
