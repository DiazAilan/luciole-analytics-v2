export function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isoToDate(iso: string): Date {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date(NaN);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function dateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isReleaseInRange(
  releaseIso: string,
  start: Date | null,
  end: Date | null,
): boolean {
  if (!start && !end) return true;
  if (start && releaseIso < dateToIso(start)) return false;
  if (end && releaseIso > dateToIso(end)) return false;
  return true;
}

export function filterTasksByReleaseRange<T extends { release: string }>(
  tasks: T[],
  range: [Date | null, Date | null],
): T[] {
  const [start, end] = range;
  return tasks.filter((task) => isReleaseInRange(task.release, start, end));
}
