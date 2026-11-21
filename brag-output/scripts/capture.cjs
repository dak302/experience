// מצלם את האפליקציה האמיתית, שלב אחרי שלב, עם נתונים בדיוניים בלבד.
// כל צילום: עמוד מלא בלי הסרגל התחתון (shot.png) + הסרגל לבד (shot-bar.png), ונתוני מיקום ב-shots.json
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const APP = 'http://localhost:5199/'
const OUT = process.argv[2]
const PDF = process.argv[3]
const W = 400
const DPR = 2
fs.mkdirSync(OUT, { recursive: true })
const meta = {}

const EXPL = [
  'מתנה מסבתא ליום ההולדת',
  'מכרתי את האופניים הישנים',
  'העברה לחשבון החיסכון שלי',
]

async function shot(p, name, focus = []) {
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(150)
  const bar = await p.$('.bar')
  if (bar) await bar.screenshot({ path: path.join(OUT, name + '-bar.png') })
  await p.addStyleTag({ content: '.bar{display:none!important}', }).then((h) => h.evaluate((el) => (el.id = 'hidebar')))
  const vp = p.viewportSize()
  const fullH = await p.evaluate(() => { scrollTo(0, 0); return document.documentElement.scrollHeight })
  await p.setViewportSize({ width: vp.width, height: fullH })
  await p.waitForTimeout(120)
  await p.screenshot({ path: path.join(OUT, name + '.png') })
  const boxes = {}
  for (const [k, sel] of focus) {
    const el = await p.$(sel)
    if (el) {
      const b = await el.evaluate((e) => {
        const r = e.getBoundingClientRect()
        return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }
      })
      boxes[k] = b
    }
  }
  const h = await p.evaluate(() => document.documentElement.scrollHeight)
  await p.evaluate(() => document.getElementById('hidebar')?.remove())
  await p.setViewportSize(vp)
  meta[name] = { h, bar: !!bar, boxes }
  console.log('shot', name, h)
}

async function celebration(p, name) {
  // reducedMotion: l'overlay est affiché sans animation, donc l'image est stable
  await p.waitForSelector('.celebrate', { timeout: 5000 })
  await p.waitForTimeout(120)
  await p.screenshot({ path: path.join(OUT, name + '.png') })
  meta[name] = { h: 0, viewport: true }
  await p.waitForSelector('.celebrate', { state: 'detached', timeout: 5000 })
}

;(async () => {
  const b = await chromium.launch()
  const opts = { viewport: { width: W, height: 448 }, deviceScaleFactor: DPR, locale: 'he-IL', reducedMotion: 'reduce' }
  const farm = await b.newContext(opts)
  const p = await farm.newPage()

  // 1. העלאת העו"ש
  await p.goto(APP + '#new')
  await shot(p, 'new-0', [['drop', '.drop']])
  await p.fill('input[placeholder="ישראל ישראלי"]', 'ישראל ישראלי')
  await p.setInputFiles('input[type=file]', PDF)
  await celebration(p, 'new-cel')
  await shot(p, 'new-1', [['result', 'section.card:nth-of-type(2)'], ['stamp', '.stamp'], ['ok', '.banner.ok']])

  // 2. המשק בוחר שורות
  await p.click('text=המשך לבחירת השורות')
  await p.waitForSelector('.ledger')
  await p.waitForTimeout(300)
  const pick = [2, 4, 8]
  const tx = (i) => `.tx >> nth=${i}`
  const focusRows = pick.map((i, k) => ['r' + k, `.ledger .tx:nth-child(${i < 6 ? i + 1 : i - 5})`])
  await shot(p, 'sel-0', [['first', '.month'], ['second', '.month:nth-of-type(2)']])
  for (let k = 0; k < pick.length; k++) {
    await p.click(tx(pick[k]) + ' >> .desc')
    await shot(p, 'sel-' + (k + 1), [['first', '.month'], ['row', `.tx.sel >> nth=${k}`]])
  }
  // positions des lignes cliquées
  meta.rows = []
  for (const i of pick) {
    meta.rows.push(await p.$eval(`.tx >> nth=${i}`, () => 0).catch(() => 0))
  }
  meta.rows = await p.$$eval('.tx', (els, pick) => pick.map((i) => {
    const r = els[i].getBoundingClientRect()
    return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }
  }), pick)

  // 3. נעילה ושליחה
  await p.click('text=נעילה ושליחה לחייל')
  await celebration(p, 'sent-cel')
  await p.waitForSelector('text=שליחה בוואטסאפ')
  await p.waitForTimeout(300)
  await shot(p, 'sent', [['card', 'section.card']])
  const wa = await p.getAttribute('a.btn.primary', 'href')
  const link = decodeURIComponent(wa.split('text=')[1]).split('\n').pop()
  const code = link.split('#s=')[1]

  // 4. החייל, במכשיר אחר
  const sold = await b.newContext(opts)
  const s = await sold.newPage()
  await s.goto(APP + '#s=' + code)
  await s.waitForSelector('textarea')
  await s.waitForTimeout(300)
  await shot(s, 'sol-0', [['how', 'section.card.howto'], ['lock', '.locknote'], ['first', 'section.rowcard']])
  await s.fill('input[autocomplete=name]', 'ישראל ישראלי')
  await s.fill('input[inputmode=numeric]', '1234567')
  await s.locator('input[inputmode=numeric]').blur()
  const ta = s.locator('textarea').first()
  const text = EXPL[0]
  let n = 0
  for (let i = 1; i <= text.length; i += 2) {
    await ta.fill(text.slice(0, i))
    await shot(s, 'type-' + n++, [['first', 'section.rowcard']])
  }
  await ta.fill(text)
  await ta.blur()
  await shot(s, 'type-' + n++, [['first', 'section.rowcard']])
  meta.typeFrames = n
  await s.locator('textarea').nth(1).fill(EXPL[1])
  await s.locator('textarea').nth(2).fill(EXPL[2])
  await s.locator('textarea').nth(2).blur()
  await shot(s, 'sol-1', [['cards', 'section.rowcard'], ['finish', '#finish']])
  await s.check('#finish input[type=checkbox]')
  await s.click('text=סיימתי, הכנה לשליחה')
  await celebration(s, 'sol-cel')
  const wa2 = await s.getAttribute('#finish a.btn.primary', 'href')
  const back = decodeURIComponent(wa2.split('text=')[1]).split('\n').pop()

  // 5. חזרה למשק והפקת הטופס
  await p.goto(APP + '#r=' + back.split('#r=')[1])
  await celebration(p, 'ret-cel')
  await p.waitForSelector('text=פרטי המצהיר')
  await p.waitForTimeout(300)
  await shot(p, 'ret', [['ledger', '.ledger']])
  await p.click('a[href^="#print/"]')
  await p.waitForTimeout(800)
  await shot(p, 'print', [['table', '.ftable']])
  // le formulaire aussi en largeur A4, pour la scène finale
  await p.setViewportSize({ width: 794, height: 1123 })
  await p.waitForTimeout(300)
  await shot(p, 'print-a4', [['table', '.ftable']])

  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(meta, null, 1))
  await b.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
