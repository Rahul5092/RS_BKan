import { toGregorian, toHijri } from 'hijri-converter';

const year = 2026;
// Get approximate Hijri year for Gregorian 2026
const hjYear = toHijri(year, 1, 1).hy;

const ramadan = toGregorian(hjYear, 9, 1);
const eidAlFitr = toGregorian(hjYear, 10, 1);
const eidAlAdha = toGregorian(hjYear, 12, 10);

console.log('Ramadan starts:', new Date(ramadan.gy, ramadan.gm - 1, ramadan.gd));
console.log('Eid al-Fitr:', new Date(eidAlFitr.gy, eidAlFitr.gm - 1, eidAlFitr.gd));
console.log('Eid al-Adha (Bakrid):', new Date(eidAlAdha.gy, eidAlAdha.gm - 1, eidAlAdha.gd));
