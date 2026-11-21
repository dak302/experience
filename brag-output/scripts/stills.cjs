// Rend des images fixes à des instants donnés, pour vérifier avant le rendu complet
const { chromium } = require('playwright')
const [, , out, ...times] = process.argv
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
  p.on('console', (m) => console.log('page:', m.text()))
  p.on('pageerror', (e) => console.log('ERR', e.message))
  await p.goto('http://127.0.0.1:5288/index.html')
  await p.evaluate(() => window.ready)
  for (const t of times) {
    await p.evaluate((t) => renderAt(t), Number(t))
    await p.screenshot({ path: `${out}/still-${Number(t).toFixed(2)}.png` })
  }
  await b.close()
})()
