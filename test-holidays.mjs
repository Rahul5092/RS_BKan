import Holidays from 'date-holidays';

const hdUS = new Holidays('US');
const hdPK = new Holidays('PK');

const date = new Date('2026-04-03T12:00:00Z');

console.log('US:', hdUS.isHoliday(date));
console.log('PK:', hdPK.isHoliday(date));
console.log('US Easter Monday (Apr 6 2026):', hdUS.isHoliday(new Date('2026-04-06T12:00:00Z')));
console.log('Easter in US options:', hdUS.getHolidays(2026).filter(h => h.name.includes('Easter') || h.name.includes('Good Friday') || h.name.includes('Friday')));
