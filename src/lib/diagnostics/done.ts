/**
 * Day-scoped "done" for the nightly worklist action.
 *
 * A tick means "handled TODAY" — it must never hide a problem on a later day,
 * even when the nightly worklist run (which normally clears it when writing a
 * new action) fails. A done-mark from a previous Amsterdam calendar day is
 * treated as expired.
 */
const amsDay = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: "Europe/Amsterdam" });

export function effectiveDoneAt(doneAt: Date | null): Date | null {
  if (!doneAt) return null;
  return amsDay(doneAt) === amsDay(new Date()) ? doneAt : null;
}
