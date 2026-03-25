import Holidays from 'date-holidays';

const hdUS = new Holidays('US');
const hdPK = new Holidays('PK');

console.log('US:', hdUS.getHolidays(2026).map(h => h.name));
console.log('PK:', hdPK.getHolidays(2026).map(h => h.name));
