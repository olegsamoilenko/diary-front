export function getTodayDateStr(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
