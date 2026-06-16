/**
 * Pure logic for the Spond -> Meta Conversions API forwarder: file parsing, row mapping,
 * and PII hashing. No DB, no network, no Express -- so it is safe to unit-test in isolation.
 * The routes + the actual CAPI POST live in metaCapiRoutes.ts.
 *
 * Faithful port of marketing/capi-registration-upload.py (in the ops repo).
 */
import { createHash } from "crypto";
import ExcelJS from "exceljs";

// Payment contact / Guardian 1 are prioritized over Member: the Member row is the kid,
// who has no email/phone. email/phone/name must all describe the SAME adult.
const FIELD_ALIASES: Record<string, string[]> = {
  email: ["payment contact email", "guardian 1 email", "email", "e-mail", "email address",
    "guardian email", "parent email", "contact email", "member email"],
  phone: ["payment contact phone number", "guardian 1 phone number", "phone", "phone number",
    "mobile", "cell", "guardian phone", "parent phone", "member phone number"],
  firstName: ["payment contact first name", "guardian 1 first name", "first name", "firstname",
    "first", "guardian first name", "parent first name", "member first name"],
  lastName: ["payment contact last name", "guardian 1 last name", "last name", "lastname",
    "last", "surname", "guardian last name", "parent last name", "member last name"],
  // The registered PERSON (kid) -- builds the per-registration dedup key.
  memberFirst: ["member first name", "player first name", "child first name"],
  memberLast: ["member last name", "player last name", "child last name"],
  dob: ["date of birth", "dob", "birth date", "birthday", "birthdate"],
  city: ["city", "town"],
  state: ["state", "province", "region"],
  zip: ["postal code", "zip", "zip code", "zipcode", "postcode"],
  date: ["sign up date", "registration date", "registered", "signup date", "created", "date"],
  group: ["groups", "group", "program", "sub group"],
};

const US_STATES: Record<string, string> = {
  alabama: "al", alaska: "ak", arizona: "az", arkansas: "ar", california: "ca", colorado: "co",
  connecticut: "ct", delaware: "de", florida: "fl", georgia: "ga", hawaii: "hi", idaho: "id",
  illinois: "il", indiana: "in", iowa: "ia", kansas: "ks", kentucky: "ky", louisiana: "la",
  maine: "me", maryland: "md", massachusetts: "ma", michigan: "mi", minnesota: "mn",
  mississippi: "ms", missouri: "mo", montana: "mt", nebraska: "ne", nevada: "nv",
  "new hampshire": "nh", "new jersey": "nj", "new mexico": "nm", "new york": "ny",
  "north carolina": "nc", "north dakota": "nd", ohio: "oh", oklahoma: "ok", oregon: "or",
  pennsylvania: "pa", "rhode island": "ri", "south carolina": "sc", "south dakota": "sd",
  tennessee: "tn", texas: "tx", utah: "ut", vermont: "vt", virginia: "va", washington: "wa",
  "west virginia": "wv", wisconsin: "wi", wyoming: "wy",
};

export interface Registration {
  regKey: string;
  orderId: string;
  eventName: string;
  eventTime: Date | null;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  group: string;
}

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();

function cellToValue(v: any): string | Date {
  if (v == null) return "";
  if (v instanceof Date) return v;
  if (typeof v === "object") {
    if (v.text) return String(v.text);              // hyperlink cell
    if (v.result != null) return String(v.result);  // formula cell
    if (v.richText) return v.richText.map((r: any) => r.text).join("");
    return "";
  }
  return String(v);
}

/** Read a .xlsx or .csv file into an array of {headerName: value} row objects. */
export async function parseSpondFile(filePath: string): Promise<Record<string, string | Date>[]> {
  const wb = new ExcelJS.Workbook();
  if (/\.csv$/i.test(filePath)) await wb.csv.readFile(filePath);
  else await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  if (!ws) return [];

  const headers: string[] = [];
  ws.getRow(1).eachCell({ includeEmpty: true }, (cell, col) => {
    headers[col] = String(cellToValue(cell.value)).trim();
  });

  const rows: Record<string, string | Date>[] = [];
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return;
    const obj: Record<string, string | Date> = {};
    let hasAny = false;
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      const h = headers[col];
      if (!h) return;
      const val = cellToValue(cell.value);
      obj[h] = val;
      if (val !== "") hasAny = true;
    });
    if (hasAny) rows.push(obj);
  });
  return rows;
}

function buildColumnMap(headers: string[]): Record<string, string> {
  const lookup: Record<string, string> = {};
  for (const h of headers) lookup[norm(h)] = h;
  const map: Record<string, string> = {};
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const a of aliases) {
      if (lookup[a]) { map[field] = lookup[a]; break; }
    }
  }
  return map;
}

function normState(raw: string): string {
  const s = norm(raw);
  if (s.length === 2) return s;
  return US_STATES[s] || s.slice(0, 2);
}

function dobString(v: string | Date | undefined): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "").trim();
}

function registrationKey(memberFirst: string, memberLast: string, dob: string | Date | undefined, email: string, phone: string): string {
  const parts = [norm(memberFirst), norm(memberLast), dobString(dob)].filter(Boolean);
  return parts.length ? parts.join("|") : (email || phone);
}

/**
 * Map raw Spond rows -> Registration objects, one per registered kid. Optional groupFilter
 * (substring, case-insensitive) scopes to a program e.g. "Roots Fall 2026"; default = all.
 */
export function mapSpondRows(rows: Record<string, string | Date>[], groupFilter?: string) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const col = buildColumnMap(headers);
  const seen = new Set<string>();
  const registrations: Registration[] = [];
  let droppedNoId = 0, droppedGroup = 0, droppedDupeInFile = 0;
  const gf = norm(groupFilter);

  for (const row of rows) {
    const get = (field: string) => String(row[col[field]] ?? "");

    if (gf && col.group && !norm(row[col.group]).includes(gf)) { droppedGroup++; continue; }

    const email = norm(get("email"));
    const phone = (get("phone").match(/\d/g) || []).join("");
    if (!email && !phone) { droppedNoId++; continue; }

    const regKey = registrationKey(get("memberFirst"), get("memberLast"), row[col.dob], email, phone);
    if (seen.has(regKey)) { droppedDupeInFile++; continue; }
    seen.add(regKey);

    const rawDate = row[col.date];
    const eventTime = rawDate instanceof Date ? rawDate : (rawDate ? new Date(String(rawDate)) : null);

    registrations.push({
      regKey,
      orderId: "nsc-" + createHash("sha256").update(regKey).digest("hex").slice(0, 16),
      eventName: "CompleteRegistration",
      eventTime: eventTime && !isNaN(eventTime.getTime()) ? eventTime : null,
      email,
      phone,
      firstName: get("firstName").trim(),
      lastName: get("lastName").trim(),
      city: get("city").trim(),
      state: get("state").trim(),
      zip: get("zip").trim(),
      country: "US",
      group: col.group ? get("group").trim() : "",
    });
  }
  return { registrations, droppedNoId, droppedGroup, droppedDupeInFile, columns: col };
}

const sha = (v: string) => (v ? createHash("sha256").update(v).digest("hex") : undefined);

/** Hash a registration's PII into Meta user_data. Raw PII never leaves this function. */
export function hashUserData(r: Registration) {
  const ud: Record<string, string[]> = {};
  const em = r.email.trim().toLowerCase();
  const ph = (r.phone.match(/\d/g) || []).join("");
  const fn = r.firstName.trim().toLowerCase();
  const ln = r.lastName.trim().toLowerCase();
  const ct = (r.city.toLowerCase().match(/[a-z0-9]/g) || []).join("");
  const st = normState(r.state);
  const zp = r.zip.trim().toLowerCase();
  const co = (r.country || "us").trim().toLowerCase();
  if (em) ud.em = [sha(em)!];
  if (ph) ud.ph = [sha(ph)!];
  if (fn) ud.fn = [sha(fn)!];
  if (ln) ud.ln = [sha(ln)!];
  if (ct) ud.ct = [sha(ct)!];
  if (st) ud.st = [sha(st)!];
  if (zp) ud.zp = [sha(zp)!];
  if (co) ud.country = [sha(co)!];
  return ud;
}

export function buildEvent(r: Registration) {
  const ts = r.eventTime ? Math.floor(r.eventTime.getTime() / 1000) : Math.floor(Date.now() / 1000);
  return {
    event_name: r.eventName,
    event_time: ts,
    action_source: "system_generated",
    event_id: r.orderId,
    user_data: hashUserData(r),
  };
}
