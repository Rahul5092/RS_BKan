import Holidays from 'date-holidays';
import hdIslamic from 'date-holidays-islamic';

const hdPK = new Holidays('PK');
hdPK.init('PK'); 
  // Wait, does date-holidays-islamic plug in automatically? 
  // Usually it is `hdPK.add(hdIslamic)` or similar. Let's try to just output PK holidays for 2026

console.log('PK 2026:');
console.log(hdPK.getHolidays(2026));
