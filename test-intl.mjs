const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
  month: 'numeric',
  day: 'numeric'
});

const year = 2026;
// Test March dates to find Ramadan in 2026
for (let i = 1; i <= 31; i++) {
  const d = new Date(year, 1, i); // Feb
  console.log('Feb', i, formatter.format(d));
}
for (let i = 1; i <= 31; i++) {
  const d = new Date(year, 2, i); // March
  console.log('Mar', i, formatter.format(d));
}
