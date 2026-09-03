/**
 * Persian number conversion and Quran page metadata helpers
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return '';
  return n.toString().replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

/**
 * Standard 30 Juz page start boundaries in standard 604-page Medina Mushaf
 */
export const JUZ_START_PAGES = [
  { juz: 1, startPage: 1 },
  { juz: 2, startPage: 22 },
  { juz: 3, startPage: 42 },
  { juz: 4, startPage: 62 },
  { juz: 5, startPage: 82 },
  { juz: 6, startPage: 102 },
  { juz: 7, startPage: 121 },
  { juz: 8, startPage: 142 },
  { juz: 9, startPage: 162 },
  { juz: 10, startPage: 182 },
  { juz: 11, startPage: 201 },
  { juz: 12, startPage: 222 },
  { juz: 13, startPage: 242 },
  { juz: 14, startPage: 262 },
  { juz: 15, startPage: 282 },
  { juz: 16, startPage: 302 },
  { juz: 17, startPage: 322 },
  { juz: 18, startPage: 342 },
  { juz: 19, startPage: 362 },
  { juz: 20, startPage: 382 },
  { juz: 21, startPage: 402 },
  { juz: 22, startPage: 422 },
  { juz: 23, startPage: 442 },
  { juz: 24, startPage: 462 },
  { juz: 25, startPage: 482 },
  { juz: 26, startPage: 502 },
  { juz: 27, startPage: 522 },
  { juz: 28, startPage: 542 },
  { juz: 29, startPage: 562 },
  { juz: 30, startPage: 582 },
];

export function getJuzForPage(page: number): number {
  if (page < 1) return 1;
  if (page > 604) return 30;
  for (let i = JUZ_START_PAGES.length - 1; i >= 0; i--) {
    if (page >= JUZ_START_PAGES[i].startPage) {
      return JUZ_START_PAGES[i].juz;
    }
  }
  return 1;
}

/**
 * Returns a direct URL to read the Quran page online (e.g. quran.com or official Quran pages)
 */
export function getQuranPageUrl(page: number): string {
  const safePage = Math.max(1, Math.min(604, page));
  return `https://quran.com/page/${safePage}`;
}
