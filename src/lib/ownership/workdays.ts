// ─── Working days + NL public holidays ────────────────────────────────────────
// Deadlines and the "1 working day late" rule must respect weekends + Dutch
// public holidays (the team is in Europe/Amsterdam). Pure, dependency-free.

/** Anonymous Gregorian algorithm — returns Easter Sunday for a given year. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000);
}

/** Set of ISO date strings that are NL public holidays for the given year. */
function nlHolidays(year: number): Set<string> {
  const easter = easterSunday(year);
  const days: Date[] = [
    new Date(Date.UTC(year, 0, 1)),   // Nieuwjaarsdag
    addDays(easter, 1),                // Tweede Paasdag (Easter Monday)
    addDays(easter, 39),               // Hemelvaartsdag (Ascension)
    addDays(easter, 50),               // Tweede Pinksterdag (Whit Monday)
    new Date(Date.UTC(year, 11, 25)),  // Eerste Kerstdag
    new Date(Date.UTC(year, 11, 26)),  // Tweede Kerstdag
  ];

  // Koningsdag: 27 April, moved to 26 April when the 27th falls on a Sunday.
  const kings = new Date(Date.UTC(year, 3, 27));
  days.push(kings.getUTCDay() === 0 ? new Date(Date.UTC(year, 3, 26)) : kings);

  return new Set(days.map(iso));
}

// Small memo so repeated runs in one process don't recompute holidays.
const holidayCache = new Map<number, Set<string>>();
function holidaysFor(year: number): Set<string> {
  let s = holidayCache.get(year);
  if (!s) { s = nlHolidays(year); holidayCache.set(year, s); }
  return s;
}

/** True for Mon–Fri that is not a NL public holiday (evaluated in UTC date terms). */
export function isWorkingDay(date: Date): boolean {
  const dow = date.getUTCDay();
  if (dow === 0 || dow === 6) return false; // Sun / Sat
  return !holidaysFor(date.getUTCFullYear()).has(iso(date));
}

/**
 * Number of whole working days elapsed in the interval (from, to].
 * Used for "overdue > 1 working day". Returns 0 if `to` <= `from`.
 */
export function workingDaysBetween(from: Date, to: Date): number {
  if (to <= from) return 0;
  let count = 0;
  // Walk day-by-day at UTC midnight boundaries after `from`, up to and incl `to`'s day.
  let cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const end = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));
  while (cursor < end) {
    cursor = addDays(cursor, 1);
    if (isWorkingDay(cursor)) count++;
  }
  return count;
}

/** Add N working days to a date (skips weekends + NL holidays). */
export function addWorkingDays(date: Date, n: number): Date {
  let cursor = new Date(date.getTime());
  let remaining = n;
  while (remaining > 0) {
    cursor = addDays(cursor, 1);
    if (isWorkingDay(cursor)) remaining--;
  }
  return cursor;
}
