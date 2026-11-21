// עו"ש בדיוני לגמרי לצורך הסרטון. אין כאן נתונים של אדם אמיתי.
const { chromium } = require('playwright');
const out = process.argv[2];
const open = 1240.5;
const rows = [
  ['02/09/2026', 'משכורת', 0, 1350],
  ['05/09/2026', 'כרטיס דביט סופרמרקט', 186.4, 0],
  ['09/09/2026', 'העברה בביט', 0, 400],
  ['14/09/2026', 'משיכה מכספומט', 300, 0],
  ['21/09/2026', 'הפקדת מזומן', 0, 250],
  ['27/09/2026', 'הוראת קבע סלולר', 49.9, 0],
  ['02/10/2026', 'משכורת', 0, 1350],
  ['08/10/2026', 'העברה בביט', 120, 0],
  ['12/10/2026', 'העברה לחשבון אחר', 700, 0],
  ['18/10/2026', 'כרטיס דביט סופרמרקט', 212.3, 0],
  ['25/10/2026', 'העברה בביט', 0, 150],
];
const f = (n) => n ? n.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '';
let bal = open, trs = '';
for (const [d, s, deb, cr] of rows) {
  bal = Math.round((bal - deb + cr) * 100) / 100;
  trs += `<tr><td>${d}</td><td>${s}</td><td>${f(deb)}</td><td>${f(cr)}</td><td>${f(bal)}</td></tr>`;
}
const html = `<html dir="rtl"><meta charset="utf-8"><style>body{font-family:sans-serif;font-size:12px}td,th{padding:6px 10px;text-align:right}</style>
<body><p>תנועות בחשבון</p><table><tr><th>תאריך</th><th>הפעולה</th><th>חובה</th><th>זכות</th><th>יתרה בש"ח</th></tr>
<tr><td></td><td>יתרת פתיחה</td><td></td><td></td><td>${f(open)}</td></tr>${trs}</table></body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent(html); await p.pdf({ path: out, format: 'A4' }); await b.close();
})();
