import type { Answers } from "@/lib/eligibility";

/**
 * Best-effort fields read from a photo of the PRINTED Aadhaar card.
 * Only fields that were actually found are present; anything unreadable
 * is simply absent so the user can type it in the normal steps.
 */
export type AadhaarScan = Partial<
  Pick<Answers, "applicantName" | "fatherName" | "address" | "gender" | "dob" | "pin">
>;

const HEADER_WORDS = [
  "government of india",
  "unique identification",
  "uidai",
  "aadhaar",
  "enrolment",
  "enrollment",
  "dob",
  "date of birth",
  "male",
  "female",
  "address",
  "www",
  "help@",
];

function cleanName(raw: string): string {
  return raw
    .replace(/[^A-Za-z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeName(line: string): boolean {
  const cleaned = cleanName(line);
  if (cleaned.length < 3) return false;
  const lower = line.toLowerCase();
  if (HEADER_WORDS.some((w) => lower.includes(w))) return false;
  // A name line is mostly letters; reject lines dominated by digits/symbols.
  const letters = (line.match(/[A-Za-z]/g) ?? []).length;
  return letters >= 3 && letters / Math.max(line.length, 1) > 0.6;
}

export function parseAadhaarText(text: string): AadhaarScan {
  const found: AadhaarScan = {};
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Date of birth: "12/05/1990", or "Year of Birth : 1990".
  const dobMatch = text.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
  if (dobMatch?.[1]) {
    found.dob = dobMatch[1];
  } else {
    const yobMatch = text.match(/year of birth[:\s]*(\d{4})/i);
    if (yobMatch?.[1]) found.dob = yobMatch[1];
  }

  // Gender.
  const genderMatch = text.match(/\b(FEMALE|MALE)\b/i);
  if (genderMatch) {
    found.gender = genderMatch[1]!.toUpperCase() === "FEMALE" ? "female" : "male";
  }

  // PIN code — the last 6-digit code on the card is the address PIN.
  const pins = text.match(/\b[1-9]\d{5}\b/g);
  const pin = pins && pins.length > 0 ? pins[pins.length - 1] : undefined;
  if (pin) found.pin = pin;

  // Father's / husband's name from the "S/O", "D/O", "W/O", "C/O" line.
  const careMatch = text.match(/(?:S\/O|D\/O|W\/O|C\/O)[:\s]+([A-Za-z ]+)/i);
  if (careMatch) {
    const careName = cleanName(careMatch[1]!);
    if (careName.length >= 3) found.fatherName = careName;
  }

  // Address: the lines after the "Address" heading, up to the PIN line.
  const addrIdx = lines.findIndex((l) => /address/i.test(l));
  if (addrIdx >= 0) {
    const parts: string[] = [];
    const first = lines[addrIdx]!.replace(/^.*?address[:\s]*/i, "").trim();
    if (first) parts.push(first);
    for (let i = addrIdx + 1; i < lines.length && parts.length < 7; i++) {
      const line = lines[i]!;
      parts.push(line);
      if (pin && line.includes(pin)) break;
    }
    const address = parts
      .join(", ")
      .replace(/\s+/g, " ")
      .replace(/(,\s*){2,}/g, ", ")
      .trim();
    if (address.length >= 8) found.address = address;
  }

  // Name: the line immediately above the date-of-birth line; otherwise the
  // first plausible name line after the "Government of India" header.
  const dobLineIdx = lines.findIndex(
    (l) => (found.dob !== undefined && l.includes(found.dob)) || /date of birth|\bDOB\b/i.test(l),
  );
  if (dobLineIdx > 0) {
    const above = lines[dobLineIdx - 1]!;
    if (looksLikeName(above)) found.applicantName = cleanName(above);
  }
  if (!found.applicantName) {
    const headerIdx = lines.findIndex((l) => /government of india/i.test(l));
    const start = headerIdx >= 0 ? headerIdx + 1 : 0;
    for (let i = start; i < Math.min(lines.length, start + 6); i++) {
      const line = lines[i]!;
      if (looksLikeName(line)) {
        found.applicantName = cleanName(line);
        break;
      }
    }
  }

  return found;
}

/**
 * Reads a photo of the printed Aadhaar card entirely on the device.
 * The image is never uploaded: tesseract.js runs in the browser and the
 * recognised text is parsed locally. Returns whatever could be read —
 * an empty object when nothing was legible. Never throws.
 */
export async function scanAadhaarImage(file: File): Promise<AadhaarScan> {
  let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | null = null;
  try {
    const { createWorker } = await import("tesseract.js");
    worker = await createWorker("eng");
    const { data } = await worker.recognize(file);
    return parseAadhaarText(data.text ?? "");
  } catch {
    return {};
  } finally {
    try {
      await worker?.terminate();
    } catch {
      /* worker already gone */
    }
  }
}
