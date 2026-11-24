import { INDIA_STATES, type IndiaDistrict, type IndiaState } from "@/data/india";

export type DerivedOffice = {
  /** LGD state code as a string, "" when it could not be derived. */
  stateCode: string;
  /** LGD district code as a string, "" when it could not be derived. */
  district: string;
  /** Taluk name as stored in the LGD data, "" when it could not be derived. */
  taluk: string;
};

const EMPTY: DerivedOffice = { stateCode: "", district: "", taluk: "" };

/**
 * India Post PIN zones: first two digits -> the state(s)/UT(s) that prefix can
 * belong to (names exactly as in INDIA_STATES). Prefixes that span two states
 * (e.g. 20-28 for Uttar Pradesh / Uttarakhand, 80-85 for Bihar / Jharkhand)
 * list both; the district-name match in the address then decides. 90-99 is
 * the Army Postal Service and maps to no state.
 */
const PIN_STATES: Record<string, string[]> = {
  "11": ["Delhi"],
  "12": ["Haryana"],
  "13": ["Haryana"],
  "14": ["Punjab"],
  "15": ["Punjab"],
  "16": ["Punjab", "Chandigarh"],
  "17": ["Himachal Pradesh"],
  "18": ["Jammu and Kashmir"],
  "19": ["Jammu and Kashmir", "Ladakh", "Uttar Pradesh", "Uttarakhand"],
  "20": ["Uttar Pradesh", "Uttarakhand"],
  "21": ["Uttar Pradesh", "Uttarakhand"],
  "22": ["Uttar Pradesh", "Uttarakhand"],
  "23": ["Uttar Pradesh", "Uttarakhand"],
  "24": ["Uttar Pradesh", "Uttarakhand"],
  "25": ["Uttar Pradesh", "Uttarakhand"],
  "26": ["Uttar Pradesh", "Uttarakhand"],
  "27": ["Uttar Pradesh", "Uttarakhand"],
  "28": ["Uttar Pradesh", "Uttarakhand"],
  "30": ["Rajasthan"],
  "31": ["Rajasthan"],
  "32": ["Rajasthan"],
  "33": ["Rajasthan"],
  "34": ["Rajasthan"],
  "36": ["Gujarat"],
  "37": ["Gujarat"],
  "38": ["Gujarat"],
  "39": ["Gujarat", "The Dadra and Nagar Haveli and Daman and Diu"],
  "40": ["Maharashtra", "Goa"],
  "41": ["Maharashtra"],
  "42": ["Maharashtra"],
  "43": ["Maharashtra"],
  "44": ["Maharashtra"],
  "45": ["Madhya Pradesh"],
  "46": ["Madhya Pradesh"],
  "47": ["Madhya Pradesh"],
  "48": ["Madhya Pradesh"],
  "49": ["Chhattisgarh"],
  "50": ["Telangana"],
  "51": ["Andhra Pradesh", "Telangana"],
  "52": ["Andhra Pradesh"],
  "53": ["Andhra Pradesh"],
  "56": ["Karnataka"],
  "57": ["Karnataka"],
  "58": ["Karnataka"],
  "59": ["Karnataka"],
  "60": ["Tamil Nadu", "Puducherry"],
  "61": ["Tamil Nadu", "Puducherry"],
  "62": ["Tamil Nadu"],
  "63": ["Tamil Nadu"],
  "64": ["Tamil Nadu"],
  "67": ["Kerala"],
  "68": ["Kerala", "Lakshadweep"],
  "69": ["Kerala"],
  "70": ["West Bengal"],
  "71": ["West Bengal"],
  "72": ["West Bengal"],
  "73": ["West Bengal", "Sikkim"],
  "74": ["West Bengal", "Andaman and Nicobar Islands"],
  "75": ["Odisha"],
  "76": ["Odisha"],
  "77": ["Odisha"],
  "78": ["Assam"],
  "79": ["Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Tripura"],
  "80": ["Bihar", "Jharkhand"],
  "81": ["Bihar", "Jharkhand"],
  "82": ["Bihar", "Jharkhand"],
  "83": ["Bihar", "Jharkhand"],
  "84": ["Bihar", "Jharkhand"],
  "85": ["Bihar", "Jharkhand"],
};

/**
 * Spelling variants seen on real Aadhaar cards: when the first phrase appears
 * in the address, the second is appended to the searchable text so the LGD
 * district name also matches (the original text stays, so taluk matching
 * still sees e.g. "Port Blair").
 */
const ADDRESS_ALIASES: [string, string][] = [
  ["udham singh nagar", "udam singh nagar"],
  ["port blair", "south andamans"],
];

/** Lowercase, punctuation -> spaces, padded so whole-phrase matching works. */
function normalize(value: string): string {
  return ` ${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

function nameAppears(addressNorm: string, name: string): boolean {
  const needle = normalize(name);
  // Very short names ("Mau", "Una") are too noisy to match on.
  if (needle.trim().length < 3) return false;
  return addressNorm.includes(needle);
}

function longestMatch<T extends { name: string }>(items: T[], addressNorm: string): T | undefined {
  let best: T | undefined;
  for (const item of items) {
    if (!nameAppears(addressNorm, item.name)) continue;
    if (!best || normalize(item.name).length > normalize(best.name).length) best = item;
  }
  return best;
}

function lastPinIn(text: string): string {
  const pins = text.match(/\b[1-9]\d{5}\b/g);
  return pins && pins.length > 0 ? pins[pins.length - 1]! : "";
}

/**
 * Derives the applicant's legal-aid office (state / district / taluk) from
 * the PIN code and the address text, so the applicant does not have to pick
 * them from long lists. Anything that cannot be pinned down confidently is
 * left "" for manual selection:
 * - a PIN prefix naming exactly one state settles the state on its own;
 * - a prefix spanning two states is settled only when a district named in
 *   the address belongs to exactly one of them;
 * - with no usable PIN, a district named in the address settles the state
 *   only when all matches fall in a single state.
 */
export function deriveOffice(address: string, pin: string): DerivedOffice {
  let addressNorm = normalize(address ?? "");
  for (const [phrase, extra] of ADDRESS_ALIASES) {
    if (addressNorm.includes(` ${phrase} `)) addressNorm += `${extra} `;
  }
  const effectivePin = /^[1-9]\d{5}$/.test(pin ?? "") ? pin : lastPinIn(address ?? "");
  const prefix = effectivePin.slice(0, 2);
  const candidateNames = PIN_STATES[prefix] ?? [];
  const candidates = INDIA_STATES.filter((s) => candidateNames.includes(s.name));

  // Every district whose name appears in the address, grouped by state.
  const matches: { state: IndiaState; district: IndiaDistrict }[] = [];
  for (const state of INDIA_STATES) {
    for (const district of state.districts) {
      if (nameAppears(addressNorm, district.name)) matches.push({ state, district });
    }
  }

  let chosenState: IndiaState | undefined;
  if (candidates.length === 1) {
    chosenState = candidates[0];
  } else {
    const pool = candidates.length > 1 ? matches.filter((m) => candidates.includes(m.state)) : matches;
    const statesInPool = [...new Set(pool.map((m) => m.state))];
    if (statesInPool.length === 1) chosenState = statesInPool[0];
  }
  if (!chosenState) return EMPTY;

  const districtMatches = matches.filter((m) => m.state === chosenState).map((m) => m.district);
  const chosenDistrict =
    districtMatches.length === 1 ? districtMatches[0] : longestMatch(districtMatches, addressNorm);

  let taluk = "";
  if (chosenDistrict) {
    const talukObjects = chosenDistrict.taluks.map((name) => ({ name }));
    taluk = longestMatch(talukObjects, addressNorm)?.name ?? "";
  }

  return {
    stateCode: String(chosenState.code),
    district: chosenDistrict ? String(chosenDistrict.code) : "",
    taluk,
  };
}
