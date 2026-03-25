import Holidays from 'date-holidays';
import { isWeekend, addDays, subDays } from 'date-fns';
import { toHijri } from 'hijri-converter';

// Initialize date-holidays for the United States and Pakistan
const hdUS = new Holidays('US');
const hdPK = new Holidays('PK');

/**
 * Calculates Easter Sunday for a given year using the Meeus/Jones/Butcher algorithm.
 */
function getEasterSunday(year: number): Date {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

/**
 * Get holiday details for a given date, if any.
 * Returns a combined name for all holidays found (US + PK + Easter + Islamic).
 */
export function getHolidayForDate(date: Date) {
  const usHolidays = hdUS.isHoliday(date) || [];
  const pkHolidays = hdPK.isHoliday(date) || [];
  
  const allHolidays = [...usHolidays, ...pkHolidays];

  // Manually check Easter-based holidays
  const easter = getEasterSunday(date.getFullYear());
  const goodFriday = subDays(easter, 2);
  const easterMonday = addDays(easter, 1);

  if (date.getMonth() === goodFriday.getMonth() && date.getDate() === goodFriday.getDate()) {
    allHolidays.push({ name: 'Good Friday' } as any);
  } else if (date.getMonth() === easter.getMonth() && date.getDate() === easter.getDate()) {
    allHolidays.push({ name: 'Easter Sunday' } as any);
  } else if (date.getMonth() === easterMonday.getMonth() && date.getDate() === easterMonday.getDate()) {
    allHolidays.push({ name: 'Easter Monday' } as any);
  }

  // Check Islamic dates
  const hj = toHijri(date.getFullYear(), date.getMonth() + 1, date.getDate());
  if (hj) {
    if (hj.hm === 9 && hj.hd === 1) {
      allHolidays.push({ name: 'Ramzan Starts (Tentative)' } as any);
    } else if (hj.hm === 10 && hj.hd === 1) {
      allHolidays.push({ name: 'Eid al-Fitr (Tentative)' } as any);
    } else if (hj.hm === 12 && hj.hd === 10) {
      allHolidays.push({ name: 'Bakrid (Tentative)' } as any);
    }
  }
  
  if (allHolidays.length > 0) {
    // Collect unique holiday names (in case of overlap or multiple observances)
    const uniqueNames = Array.from(new Set(allHolidays.map(h => h.name)));
    return { name: uniqueNames.join(' / ') };
  }
  return null;
}

/**
 * Checks if a date is part of a "Long Weekend".
 * A date is part of a long weekend if it is a weekend or a holiday, AND
 * it connects to a holiday on a Friday or Monday.
 */
export function isLongWeekend(date: Date): boolean {
  const isWknd = isWeekend(date);
  const isHol = getHolidayForDate(date) !== null;
  
  // If it's neither a weekend nor a holiday, it can't be part of a long weekend
  if (!isWknd && !isHol) return false;

  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, ..., 5 is Friday, 6 is Saturday

  // If it's a Friday holiday, it forms a long weekend with Saturday and Sunday
  if (dayOfWeek === 5 && isHol) return true;
  // If it's a Monday holiday, it forms a long weekend with Saturday and Sunday
  if (dayOfWeek === 1 && isHol) return true;

  // If it's Saturday, check if Friday or Monday is a holiday
  if (dayOfWeek === 6) {
    const isFridayHoliday = getHolidayForDate(subDays(date, 1)) !== null;
    const isMondayHoliday = getHolidayForDate(addDays(date, 2)) !== null;
    return isFridayHoliday || isMondayHoliday;
  }

  // If it's Sunday, check if Friday or Monday is a holiday
  if (dayOfWeek === 0) {
    const isFridayHoliday = getHolidayForDate(subDays(date, 2)) !== null;
    const isMondayHoliday = getHolidayForDate(addDays(date, 1)) !== null;
    return isFridayHoliday || isMondayHoliday;
  }

  return false;
}
