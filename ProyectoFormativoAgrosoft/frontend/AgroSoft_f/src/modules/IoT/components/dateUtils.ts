
export function ensureDate(date: Date | string | number): Date {
  if (date instanceof Date) return date;
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) throw new Error(`Fecha inválida: ${date}`);
  return parsedDate;
}

export function formatDateForDisplay(date: Date | string | number, locale = 'es-ES'): string {
  return ensureDate(date).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatDateTimeForDisplay(date: Date | string | number, locale = 'es-ES'): string {
  return ensureDate(date).toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getDefaultDateRange(days = 7): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - days);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function isDateValid(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}