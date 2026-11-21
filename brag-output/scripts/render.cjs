// Rendu image par image (t = i / 30), envoyé directement à ffmpeg
const { chromium } = require('playwright')
const { spawn } = require('child_process')
const out = process.argv[2]
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
  p.on('pageerror', (e) => console.log('ERR', e.message))
  await p.goto('http://127.0.0.1:5288/index.html')
  await p.evaluate(() => window.ready)
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', '30', out], { stdio: ['pipe', 'inherit', 'inherit'] })
  const N = 25 * 30
  for (let i = 0; i < N; i++) {
    await p.evaluate((t) => renderAt(t), i / 30)
    const buf = await p.screenshot({ type: 'png' })
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
    if (i % 150 === 0) console.log('frame', i)
  }
  ff.stdin.end()
  await new Promise((r) => ff.on('close', r))
  await b.close()
})()
