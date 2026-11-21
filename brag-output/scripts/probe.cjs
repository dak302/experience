const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 400, height: 760 }, deviceScaleFactor: 1, locale: 'he-IL' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:5199/#new');
  await p.fill('input[placeholder="ישראל ישראלי"]', 'ישראל ישראלי');
  await p.setInputFiles('input[type=file]', process.argv[2]);
  await p.waitForSelector('text=תוצאת הקריאה', { timeout: 20000 });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: 'probe-new.png', fullPage: true });
  console.log((await p.textContent('main')).slice(0, 900));
  await b.close();
})();
