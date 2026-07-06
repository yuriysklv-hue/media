// Форматирование дат и меты в стиле макета: mono-даты, «сегодня/вчера», минуты чтения.
// Все даты показываем по Москве независимо от TZ сборочной машины (в CI обычно UTC).

const MSK = 'Europe/Moscow';

const dayKeyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: MSK, year: 'numeric', month: '2-digit', day: '2-digit' });
const timeFmt = new Intl.DateTimeFormat('ru-RU', { timeZone: MSK, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayMonthFmt = new Intl.DateTimeFormat('ru-RU', { timeZone: MSK, day: 'numeric', month: 'long' });
const fullFmt = new Intl.DateTimeFormat('ru-RU', { timeZone: MSK, day: 'numeric', month: 'long', year: 'numeric' });
const yearFmt = new Intl.DateTimeFormat('en-US', { timeZone: MSK, year: 'numeric' });

/** «3 июля 2026» — полная дата для меты материала и hero. */
export function formatDate(date: Date): string {
  return fullFmt.format(date).replace(/\s*г\.$/, '');
}

/** ISO-дата для <time datetime> и JSON-LD. */
export function isoDate(date: Date): string {
  return date.toISOString();
}

/**
 * Мета в ленте: «сегодня, 09:40» / «вчера, 19:02» / «2 июля» / «2 июля 2025».
 * Отсчёт — от момента сборки (сайт статический, обновляется при каждом деплое).
 */
export function formatFeedDate(date: Date, now: Date = new Date()): string {
  const dayDiff = mskDayNumber(now) - mskDayNumber(date);
  if (dayDiff === 0) return `сегодня, ${timeFmt.format(date)}`;
  if (dayDiff === 1) return `вчера, ${timeFmt.format(date)}`;
  return yearFmt.format(date) === yearFmt.format(now)
    ? dayMonthFmt.format(date)
    : formatDate(date);
}

/** «2 часа назад» / «5 часов назад» / «вчера» — для блока «Главное сейчас». */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const diffMin = Math.max(0, Math.round((now.getTime() - date.getTime()) / 60_000));
  if (diffMin < 60) return diffMin <= 1 ? 'только что' : `${diffMin} мин назад`;
  const hours = Math.round(diffMin / 60);
  if (hours < 24) return `${hours} ${plural(hours, 'час', 'часа', 'часов')} назад`;
  if (mskDayNumber(now) - mskDayNumber(date) === 1) return 'вчера';
  return formatFeedDate(date, now);
}

/** «4 мин» — время чтения. */
export function formatReadingTime(minutes?: number): string | null {
  return minutes ? `${minutes} мин` : null;
}

/** Порядковый номер календарного дня в Москве — для сравнения «сегодня/вчера». */
function mskDayNumber(date: Date): number {
  const [y, m, d] = dayKeyFmt.format(date).split('-').map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
